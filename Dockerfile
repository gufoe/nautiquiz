FROM oven/bun:1-alpine AS builder

WORKDIR /app/ui

COPY ui/package.json ui/bun.lock ./
RUN bun install --frozen-lockfile

COPY ui/ ./
RUN bun run build

FROM alpine:3.16
RUN apk add --no-cache wget ca-certificates && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 && \
    chmod +x /usr/local/bin/dumb-init

RUN adduser --disabled-password noob
WORKDIR /home/noob
COPY --from=builder /app/ui/dist/spa ./static
RUN wget -O sfz.tar https://github.com/weihanglo/sfz/releases/download/v0.4.0/sfz-v0.4.0-x86_64-unknown-linux-musl.tar.gz && \
    tar xf sfz.tar && \
    rm -f sfz.tar

RUN apk del wget

USER noob


EXPOSE 8080
ENTRYPOINT ["dumb-init", "./sfz", "-b", "0.0.0.0", "-p", "8080", "-r", "./static"]
