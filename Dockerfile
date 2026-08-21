# Stage 1: Build the Vue SPA with Bun
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Build arguments for compile-time environment variables
ARG VITE_USE_MOCK=false
ARG VITE_API_BASE_URL=https://chequeyar-back.chbkn.dev/api/v1

ENV VITE_USE_MOCK=$VITE_USE_MOCK
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install dependencies using frozen lockfile
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and build
COPY . .
RUN bun run build

# Stage 2: Serve the static bundle with Nginx
FROM nginx:alpine AS runner

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to the web root matching nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/dist

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
