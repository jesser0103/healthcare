FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY server.js ./
COPY public ./public

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1:3000/api/status > /dev/null || exit 1

CMD ["npm", "start"]
