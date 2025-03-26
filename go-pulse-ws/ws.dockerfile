# syntax=docker.io/docker/dockerfile:1

FROM --platform=linux/amd64 node:23-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to 
# understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /ws

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /ws
COPY --from=deps /ws/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run node
FROM base AS runner
WORKDIR /ws

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 server

COPY --from=deps --chown=nodejs:server /ws/node_modules ./node_modules
COPY --from=builder --chown=nodejs:server /ws/package.json ./package.json
COPY --from=builder --chown=nodejs:server /ws/package-lock.json ./package-lock.json
COPY --from=builder --chown=nodejs:server /ws/build ./build

USER server

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]