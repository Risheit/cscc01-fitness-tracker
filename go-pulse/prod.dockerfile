# syntax=docker.io/docker/dockerfile:1

# Based on the NextJS example dockerfile at:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:23-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to 
# understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for database config
ARG DB_PORT
ARG POSTGRES_DB
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD

# Arguments to be passed into the docker container in during build. 
# These should contain any NEXT_PUBLIC_ environment variables 
# needed for the app.
#
# Next.js public variables need to be decidable during build time,
# They can't be accessed in client components in production builds 
# if they're being passed in as environment variables, since they're
# inline during build time. They can be accessed as environment 
# variables in server context though.
# Whatever service is deploying this should pass in these variables 
# when building. You can do it locally if needed through
#   docker-compose --profile prod build 
#           --build-arg ARG1=VAL1 
#           --build-arg ARG2=VAL2 
#           ...    
ARG NEXT_PUBLIC_WS_HOST="socket"
ARG NEXT_PUBLIC_WS_PORT="8080"

ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ARG NEXT_PUBLIC_NINJA_API_KEY

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# We bind our the build time arguments to environment variables 
# we can access within the app here.
#       ENV ENV_VAR_NAME ${ARG_NAME}
# For NEXT_PUBLIC_ environment variables, also add an ARG tag.
# Remember also to update the env.d.ts file so TypeScript recognizes
# your variables correctly.
ENV NODE_ENV=production
ENV DB_PORT ${DB_PORT}
ENV JWT_SECRET ${JWT_SECRET}

ENV NEXT_PUBLIC_WS_HOST ${NEXT_PUBLIC_WS_HOST}
ENV NEXT_PUBLIC_WS_PORT ${NEXT_PUBLIC_WS_PORT}

ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY ${NEXT_PUBLIC_VAPID_PUBLIC_KEY}
ENV VAPID_PRIVATE_KEY ${VAPID_PRIVATE_KEY}
ENV NEXT_PUBLIC_NINJA_API_KEY ${NEXT_PUBLIC_NINJA_API_KEY}

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]