# Expenso Application

## Prerequisites

Before running the application, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running the Application

To run the application using Docker Compose, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Expenso
   ```

2. Build and start the services:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images for the client and server, and start all services defined in the `docker-compose.yml` file.

3. Access the application:

   - The client will be available at `http://localhost:3000`
   - The server will be available at `http://localhost:4000`

## Environment Variables

The following environment variables are used in the application:

### Server

- `NODE_ENV`: Set to `production`.
- `DATABASE_URL`: Connection string for PostgreSQL.
- `JWT_SECRET`: Secret key for JWT authentication (replace `your_jwt_secret_here` with your actual secret).

### PostgreSQL

- `POSTGRES_USER`: Database user (default: `postgres`).
- `POSTGRES_PASSWORD`: Database password (default: `postgres`).
- `POSTGRES_DB`: Database name (default: `expenso`).

## Stopping the Application

To stop the application, press `CTRL+C` in the terminal where the Docker Compose command is running. You can also run:

```bash
docker-compose down
```

This command will stop and remove all containers defined in the `docker-compose.yml` file.
