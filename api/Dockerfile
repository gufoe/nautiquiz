FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY . .

EXPOSE 3333

ENV NODE_ENV=production

CMD ["bun", "src/index.ts"]
