# syntax=docker.io/docker/dockerfile:1

# Based on the NextJS example dockerfile at:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:23 AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Rebuild the source code only when needed
FROM base AS tester
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "test"]