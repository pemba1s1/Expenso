# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies and copy all project files
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN bunx prisma generate

# Copy the rest of the application
COPY . .

# Create a script to handle migrations and start
RUN echo '#!/bin/sh\nbunx prisma migrate deploy\nbun run start' > ./start.sh
RUN chmod +x ./start.sh

EXPOSE 4000
CMD ["./start.sh"]
