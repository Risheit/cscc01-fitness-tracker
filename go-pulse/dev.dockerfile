# syntax=docker/dockerfile:1

FROM node:23-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to 
# understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Taken from the NodeJS Docker template:
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci


ENV NODE_ENV=development
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Allow our non-root user to modify source files
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy over the rest of our source files
COPY . .

# Change ownership of /app after copying
RUN chown -R nextjs:nodejs /app

# Switch to our non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Run the application.
CMD ["npm", "run", "dev"]