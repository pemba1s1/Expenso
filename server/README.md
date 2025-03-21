# Expenso Server

This is the backend server for the Expenso application. It provides APIs for managing expenses, user authentication, and more.

## Prerequisites

- Node.js (v16 or later)
- Bun (v1 or later)
- PostgreSQL
- Docker (optional, for containerized setup)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/expenso.git
   cd expenso/server
   ```

2. **Install dependencies:**

   ```bash
   bun install --save-text-lockfile
   ```

3. **Set up environment variables:**

   Copy the `.env.example` file to `.env` and update the values as needed.

   ```bash
   cp .env.example .env
   ```

4. **Set up the database:**

   Ensure PostgreSQL is running and create a database for the application. Update the `DATABASE_URL` in the `.env` file with your database credentials.

5. **Run database migrations:**

   ```bash
   bunx prisma migrate deploy
   ```

6. **Generate Prisma Client:**

   ```bash
   bunx prisma generate
   ```

## Running the Server

1. **Start the server in development mode:**

   ```bash
   bun run dev
   ```

   The server will start on the port specified in the `.env` file (default is 4000).

2. **Build and start the server in production mode:**

   ```bash
   bun run build
   bun run start
   ```

## Docker Setup

1. **Build the Docker image:**

   ```bash
   docker build -t expenso-server .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 4000:4000 --env-file .env expenso-server
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running. It is generated using Swagger.

## License

This project is licensed under the MIT License.
