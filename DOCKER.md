# Docker Setup for Secret Santa

This directory contains the Docker configuration for running the Secret Santa application in containers.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose V2+

## Services

### API (apps/api)
The API service runs the Elysia-based backend server.

**Port:** 3000  
**Health check:** HTTP GET to `http://localhost:3000/`

### Azurite (Azure Storage Emulator) - Coming Soon
Local Azure Storage emulator for development with Azure Table Storage.

**Ports:**
- 10000: Blob service
- 10001: Queue service
- 10002: Table service

### Web UI - Coming Soon
The frontend web application.

## Quick Start

### Build and run the API:
```bash
docker-compose up -d api
```

### View logs:
```bash
docker-compose logs -f api
```

### Stop services:
```bash
docker-compose down
```

### Rebuild after code changes:
```bash
docker-compose up -d --build api
```

## Development

The Dockerfile uses a multi-stage build:
1. **base**: Sets up the Bun runtime
2. **install**: Installs all workspace dependencies
3. **build**: Runs type checking
4. **production**: Creates the minimal production image

### Building individual services:
```bash
docker-compose build api
```

### Running with all services (when available):
```bash
docker-compose up -d
```

## Environment Variables

Environment variables can be added to `docker-compose.yml` or in a `.env` file at the root:

```env
NODE_ENV=production
PORT=3000
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;...
```

## Troubleshooting

### Port already in use
If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### Container won't start
Check logs:
```bash
docker-compose logs api
```

### Rebuild from scratch:
```bash
docker-compose down
docker-compose build --no-cache api
docker-compose up -d api
```

## Notes

- The Dockerfile is optimized for Bun's workspace architecture
- Health checks ensure the service is ready before marking as healthy
- Volumes are prepared for Azurite persistence (commented out until needed)
