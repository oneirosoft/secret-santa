# Use Bun's official image as base
FROM oven/bun:1.1.17 AS base
WORKDIR /app

# Install dependencies stage
FROM base AS install

# Copy workspace configuration
COPY package.json bun.lock ./
COPY tsconfig.json tsconfig.base.json ./

# Copy all workspace packages and apps
COPY packages ./packages
COPY apps/api ./apps/api

# Install all dependencies
RUN rm -rf node_modules && bun install

# Build stage - bundle the application
FROM install AS build
WORKDIR /app

# Remove workspace node_modules with broken symlinks
RUN rm -rf apps/api/node_modules packages/*/node_modules

# Bundle the API - should now resolve from root node_modules
RUN bun build apps/api/src/index.ts \
    --outfile=dist/server.js \
    --target=bun

# Production stage - just the bundle (all dependencies bundled in)
FROM base AS production
WORKDIR /app

# Copy only the bundled output
COPY --from=build /app/dist/server.js ./server.js

# Expose the port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Run the bundled application
CMD ["bun", "run", "server.js"]
