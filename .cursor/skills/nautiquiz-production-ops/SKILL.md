---
name: nautiquiz-production-ops
description: Documents Nautiquiz production operations on host gufoe: environment layout, SSH access, Docker compose services, SQLite inspection, API verification, and deployment steps. Use when the user asks about production setup, inspecting live data, checking leaderboards, or deploying updates.
---

# Nautiquiz Production Ops

## Purpose

Use this skill for Nautiquiz production tasks:
- explain infrastructure and runtime topology
- inspect live data (SQLite in container volume)
- verify API behavior from production
- deploy latest code safely

## Production Topology

- **Host**: `gufoe` (SSH target)
- **Repo path**: `~/pro/nautiquiz`
- **Deploy launcher**: `/root/pro/bin/nautiquiz`
- **Orchestration**: `docker compose -f docker-compose.prod.yml`
- **Services**:
  - `nautiquiz-api-1` (Bun + Hono API)
  - `nautiquiz-ui-1` (frontend)
  - `nautiquiz-edge-1` (Caddy reverse proxy)
- **Host Caddy service**: system Caddy (`systemctl status caddy`) using `/etc/caddy/Caddyfile`
- **DB**: SQLite at `/data/nautiquiz.sqlite` inside API container
- **Persistent volume**: `nautiquiz_nautiquiz_sqlite`

## Access Workflow

1. Confirm host access:
   - `ssh gufoe "hostname && whoami"`
2. Confirm repo and compose files:
   - `ssh gufoe "cd ~/pro/nautiquiz && ls -la"`
3. Confirm containers:
   - `ssh gufoe "docker ps --format 'table {{.Names}}\t{{.Status}}'"`

## Inspect Production Config

- Compose file:
  - `ssh gufoe "sed -n '1,240p' ~/pro/nautiquiz/docker-compose.prod.yml"`
- Environment:
  - `ssh gufoe "sed -n '1,200p' ~/pro/nautiquiz/.env.production"`

Expected key values:
- `SQLITE_PATH=/data/nautiquiz.sqlite` (in API container env)
- `UI_ORIGIN` includes `https://nautiquiz.gufoe.it`
- `JWT_SECRET` is set

## Caddy Routing (Server /etc)

Nautiquiz has **two Caddy layers**:

1. **Host Caddy (systemd)**: `/etc/caddy/Caddyfile`
   - Terminates external traffic for `nautiquiz.gufoe.it`
   - Proxies to `localhost:5010`
2. **Compose edge Caddy**: `nautiquiz-edge-1`
   - Listens on host bind `127.0.0.1:5010`
   - Uses `~/pro/nautiquiz/deploy/Caddyfile.prod`
   - Proxies internally to `api:3333` and `ui:8080`

Quick checks:

- host Caddy config
  - `ssh gufoe "sed -n '1,260p' /etc/caddy/Caddyfile"`
- host Caddy service health
  - `ssh gufoe "systemctl status caddy --no-pager | sed -n '1,40p'"`
- host Caddy route for Nautiquiz
  - look for:
    - `nautiquiz.gufoe.it {`
    - `reverse_proxy localhost:5010`
- compose edge config
  - `ssh gufoe "sed -n '1,260p' ~/pro/nautiquiz/deploy/Caddyfile.prod"`

Validate/reload host Caddy after `/etc/caddy/Caddyfile` edits:

```bash
ssh gufoe "caddy validate --config /etc/caddy/Caddyfile"
ssh gufoe "systemctl reload caddy"
```

Validate compose edge after `deploy/Caddyfile.prod` edits:

```bash
ssh gufoe "cd ~/pro/nautiquiz && docker compose -f docker-compose.prod.yml up -d --build edge"
```

## Query SQLite Data (Inside API Container)

`sqlite3` may be unavailable in the image. Prefer Bun SQLite:

```bash
ssh gufoe "docker exec nautiquiz-api-1 sh -lc 'bun -e \"import { Database } from \\\"bun:sqlite\\\"; const db=new Database(\\\"/data/nautiquiz.sqlite\\\"); console.log(db.query(\\\"select count(*) as c from answers\\\").get());\"'"
```

Useful checks:

- table counts (legacy `user_client_state` / `quiz_sessions` are dropped by `0005_answers_only` and idempotently by `0008_drop_legacy_client_tables` if they still existed; lists sync uses `quiz_issue_reports` / `quiz_favorites`)
```bash
ssh gufoe "docker exec nautiquiz-api-1 sh -lc 'bun -e \"import { Database } from \\\"bun:sqlite\\\"; const db=new Database(\\\"/data/nautiquiz.sqlite\\\"); console.log({users:db.query(\\\"select count(*) as c from users\\\").get().c, answers:db.query(\\\"select count(*) as c from answers\\\").get().c, quiz_issue_reports:db.query(\\\"select count(*) as c from quiz_issue_reports\\\").get().c, quiz_favorites:db.query(\\\"select count(*) as c from quiz_favorites\\\").get().c});\"'"
```

- recent users
```bash
ssh gufoe "docker exec nautiquiz-api-1 sh -lc 'bun -e \"import { Database } from \\\"bun:sqlite\\\"; const db=new Database(\\\"/data/nautiquiz.sqlite\\\"); console.log(db.query(\\\"select id,email,username,created_at from users order by created_at desc limit 20\\\").all());\"'"
```

- inspect one user’s segnalazioni row count (replaces legacy `user_client_state.data_json` size check)
```bash
ssh gufoe "docker exec nautiquiz-api-1 sh -lc 'bun -e \"import { Database } from \\\"bun:sqlite\\\"; const db=new Database(\\\"/data/nautiquiz.sqlite\\\"); const u=db.query(\\\"select id, username from users where username=?\\\").get(\\\"gufoe\\\"); if (!u) { console.log({ user: null }); process.exit(0); } const n = db.query(\\\"select count(*) as c from quiz_issue_reports where user_id=?\\\").get(u.id).c; console.log({ id: u.id, username: u.username, issue_rows: n });\"'"
```

## Verify Live API Behavior

Use `curl` directly against production:

```bash
curl -s "https://nautiquiz.gufoe.it/api/leaderboards" \
  -H "authorization: Bearer <TOKEN>"
```

When debugging leaderboard mismatches, always compare:
1. API response payload
2. `answers` row counts for the relevant scope
3. User identity (`users.username`) if the issue is account-specific

## Deploy Workflow

Preferred deploy command:

```bash
ssh gufoe "/root/pro/bin/nautiquiz"
```

What it does:
- `cd ~/pro/nautiquiz`
- `git pull`
- reads `.env.production` if present
- recreates stack with:
  - `docker compose ... up -d --build --remove-orphans`

Post-deploy checks:

1. Container status:
   - `ssh gufoe "docker ps --format 'table {{.Names}}\t{{.Status}}' | sed -n '1,20p'"`
2. API health:
   - `curl -s https://nautiquiz.gufoe.it/health`
3. Key endpoint sanity:
   - `curl -s https://nautiquiz.gufoe.it/api/leaderboards/weekly-top`

## Troubleshooting

- **Path mistake**: `/root/pro/bin/nautiquiz` is a script, not a directory.
- **`sqlite3: not found`**: run queries with Bun (`bun:sqlite`) via `docker exec`.
- **Unexpected low counts**:
  - verify active DB path in compose (`/data/nautiquiz.sqlite`)
  - verify correct volume (`nautiquiz_nautiquiz_sqlite`)
  - compare `answers` / `quiz_issue_reports` counts to API expectations (legacy `user_client_state` / `quiz_sessions` should be absent after migration `0008`)
- **502/404 through domain**:
  - verify `/etc/caddy/Caddyfile` still proxies `nautiquiz.gufoe.it` -> `localhost:5010`
  - verify `nautiquiz-edge-1` is running and bound to `127.0.0.1:5010`
  - verify edge Caddy routes `/api/*` to API and other paths to UI
- **CORS/auth errors**:
  - check `UI_ORIGIN` in `.env.production`
  - confirm `Authorization: Bearer <token>` header

## Safety Rules

- Never print or commit real JWT secrets/tokens in logs or docs.
- Never run destructive DB commands unless explicitly requested.
- For data fixes, take a backup first:
  - `ssh gufoe "docker run --rm -v nautiquiz_nautiquiz_sqlite:/data alpine tar czf - /data" > nautiquiz-sqlite-backup.tgz`
