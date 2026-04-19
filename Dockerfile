# UI static build — context must be repo root so workspace:* resolves to packages/quiz-catalog
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/quiz-catalog ./packages/quiz-catalog
COPY api/package.json ./api/package.json
COPY ui/package.json ./ui/package.json

RUN bun install --frozen-lockfile

COPY ui ./ui

RUN bun run --cwd ui build

FROM alpine:3.16
RUN apk add --no-cache ca-certificates python3

RUN adduser --disabled-password noob
WORKDIR /home/noob
COPY --from=builder /app/ui/dist/spa ./static

USER noob

EXPOSE 8080
CMD ["python3", "-m", "http.server", "8080", "-d", "/home/noob/static"]
