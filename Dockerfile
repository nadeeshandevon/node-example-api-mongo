# Build stage
FROM node:20-bookworm AS builder
WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json jest.config.ts ./
COPY src ./src
COPY tests ./tests
RUN npm ci

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]

