# Lightweight Node.js Alpine Container for HustleForge AI
FROM node:20-alpine

WORKDIR /app

# Copy package and server
COPY package.json ./
COPY server.js ./
COPY public ./public

# Expose Web Port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
