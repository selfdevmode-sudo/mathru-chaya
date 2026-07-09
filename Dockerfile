# syntax=docker/dockerfile:1

# ---- Stage 1: install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: build the app ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3: minimal runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Bind to all interfaces so the container is reachable from the host.
ENV HOSTNAME=0.0.0.0

# The self-contained server produced by `output: "standalone"`, plus the
# static assets, the public/ folder (uploaded images live here), and the
# starter content in data/.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/data ./data

EXPOSE 3000

# ADMIN_PASSWORD and SESSION_SECRET should be provided at run time
# (docker run -e ... / compose). Content is written to /app/data and
# uploads to /app/public/uploads — mount those as volumes to persist them.
CMD ["node", "server.js"]
