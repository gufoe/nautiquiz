# Build from repository root: docker compose uses context: . and dockerfile: api/Dockerfile
FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/quiz-catalog ./packages/quiz-catalog
COPY api ./api
COPY ui/package.json ./ui/package.json

RUN bun install --frozen-lockfile --production

WORKDIR /app/api

EXPOSE 3333

ENV NODE_ENV=production

CMD ["bun", "src/index.ts"]
