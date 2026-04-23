FROM node:22-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY infraestructure/persistence/prisma ./infraestructure/persistence/prisma/
RUN npm ci --omit=dev

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3003

EXPOSE 3003

CMD ["sh", "-c", "npx prisma db push && node presentation/http/server.js"]
