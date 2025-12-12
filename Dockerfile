FROM node:20-alpine3.16 AS builder

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn install
COPY --chmod=777 . .
RUN yarn install && yarn build

FROM alpine:3.16
RUN apk add --no-cache wget ca-certificates && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 && \
    chmod +x /usr/local/bin/dumb-init

RUN adduser --disabled-password noob
USER noob
WORKDIR /home/noob
COPY --from=builder /home/node/app/dist/spa ./static
RUN wget -O sfz.tar https://github.com/weihanglo/sfz/releases/download/v0.4.0/sfz-v0.4.0-x86_64-unknown-linux-musl.tar.gz \
    && tar xf sfz.tar \
    && rm -f sfz.tar


EXPOSE 8080
ENTRYPOINT ["dumb-init", "./sfz", "-b", "0.0.0.0", "-p", "8080", "-r", "./static"]
