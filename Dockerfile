FROM oven/bun:1-alpine AS builder

WORKDIR /app/ui

COPY ui/package.json ui/bun.lock ./
RUN bun install --frozen-lockfile

COPY ui/ ./
RUN bun run build

FROM alpine:3.16
RUN apk add --no-cache ca-certificates python3

RUN adduser --disabled-password noob
WORKDIR /home/noob
COPY --from=builder /app/ui/dist/spa ./static

USER noob

EXPOSE 8080
CMD ["python3", "-m", "http.server", "8080", "-d", "/home/noob/static"]
