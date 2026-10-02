# QRCanvasPlatform - Dockerfile for Vercel Deployment
# Multi-stage build: Node.js for frontend + Bun/Node for backend

# ---------- Stage 1: Build Frontend ----------
FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* .npmrc ./
RUN npm ci

# Copy source and build
COPY vite.config.ts tsconfig*.json postcss.config.js ./
COPY src ./src
COPY public ./public
COPY index.html ./

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build:frontend

# ---------- Stage 2: Build Backend ----------
FROM node:22-bookworm-slim AS backend-builder

WORKDIR /app

COPY package.json package-lock.json* .npmrc ./
RUN npm ci

COPY tsconfig.server.json ./
COPY server ./server

RUN npm run build:backend

# ---------- Stage 3: Runtime ----------
FROM node:22-bookworm-slim AS runtime

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy built backend
COPY --from=backend-builder /app/dist/server ./dist/server
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json ./

# Copy built frontend to public folder
COPY --from=frontend-builder /app/dist ./public

# Create uploads directory
RUN mkdir -p uploads && chown -R appuser:appuser uploads

# Environment
ENV NODE_ENV=production
ENV PORT=3001

USER appuser

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/api/health" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server/index.js"]