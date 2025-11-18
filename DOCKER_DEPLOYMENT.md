# Docker Deployment Guide

This guide explains how to deploy the Shoe Store application using Docker and nginx for production.

## Architecture

The application consists of two main services:

1. **Frontend**: React application built with Vite, served by nginx on port 80
2. **Backend**: Express.js API server running on port 5001

### Service Communication

- nginx acts as a reverse proxy
- API requests (`/api/*`) are proxied to the backend service
- Uploaded images (`/uploads/*`) are served through the backend
- Static React files are served directly by nginx

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Development Mode (Current Setup)

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm start
```

- Frontend: http://localhost:3002
- Backend: http://localhost:5001

### Production Mode (Docker)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

The application will be available at:
- **Main App**: http://localhost (port 80)
- **Backend API**: http://localhost:5001 (for direct API access)

## Docker Configuration Files

### 1. `docker-compose.yml`
Orchestrates both frontend and backend services with:
- Automatic service discovery via Docker networking
- Volume persistence for uploaded images
- Automatic container restarts

### 2. `Dockerfile` (Frontend)
Multi-stage build:
- **Stage 1**: Builds the React app using Node.js
- **Stage 2**: Serves static files with nginx

### 3. `server/Dockerfile` (Backend)
Builds the Express.js API server with:
- Production dependencies only
- Persistent uploads directory

### 4. `nginx.conf`
nginx configuration with:
- Reverse proxy to backend API
- Client-side routing support (React Router)
- Gzip compression
- Security headers
- Static asset caching

## Build and Deployment Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend

# Build without cache
docker-compose build --no-cache
```

### Run Services

```bash
# Start in detached mode
docker-compose up -d

# Start with build
docker-compose up -d --build

# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Stop Services

```bash
# Stop containers (keeps volumes)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove volumes (deletes uploaded images)
docker-compose down -v
```

### Maintenance

```bash
# Restart a service
docker-compose restart backend

# Execute commands in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# View container stats
docker stats

# Remove unused images and containers
docker system prune -a
```

## Environment Variables

### Backend (server/Dockerfile)
- `NODE_ENV=production` - Sets Node.js environment
- `PORT=5001` - Backend server port

### Custom Configuration

Create a `.env` file in the root directory:

```env
# Backend
BACKEND_PORT=5001
NODE_ENV=production

# Frontend
NGINX_PORT=80
```

Update `docker-compose.yml` to use environment variables:

```yaml
services:
  backend:
    ports:
      - "${BACKEND_PORT:-5001}:5001"
  frontend:
    ports:
      - "${NGINX_PORT:-80}:80"
```

## Production Deployment Checklist

- [ ] Update API endpoints to use production URLs
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS certificates (use nginx with Let's Encrypt)
- [ ] Configure environment variables
- [ ] Set up database (if migrating from localStorage)
- [ ] Configure backup strategy for uploads volume
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Enable security headers (already in nginx.conf)

## Scaling

### Horizontal Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Update nginx to load balance
# (requires nginx upstream configuration)
```

### Volume Backup

```bash
# Backup uploads volume
docker run --rm -v shoe-store_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .

# Restore uploads volume
docker run --rm -v shoe-store_uploads:/data -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## Troubleshooting

### Check Service Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service with tail
docker-compose logs --tail=100 -f backend
```

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "8080:80"  # Use port 8080 instead
   ```

2. **Images not loading**
   - Check backend is running: `docker-compose ps`
   - Check nginx proxy configuration
   - Verify uploads volume is mounted

3. **Build failures**
   ```bash
   # Clear build cache
   docker-compose build --no-cache
   
   # Remove old images
   docker image prune -a
   ```

## SSL/HTTPS Setup (Optional)

For production with SSL, use nginx with Let's Encrypt:

```yaml
# Add to docker-compose.yml
services:
  nginx-proxy:
    image: jwilder/nginx-proxy
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
```

## Monitoring

### Health Checks

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5001/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
