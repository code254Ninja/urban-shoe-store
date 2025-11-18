# Docker Quick Start Guide

## 🚀 Quick Deploy

### Option 1: Interactive Script (Recommended)

```bash
./deploy.sh
```

This interactive script provides a menu with options to:
- Build and start services
- Stop/restart services
- View logs
- Clean up containers and volumes
- Check service status

### Option 2: Manual Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📍 Access Points

Once deployed, access the application at:

- **Frontend (Main App)**: http://localhost
- **Backend API**: http://localhost:5001
- **Admin Panel**: http://localhost/admin/login

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│           nginx (Port 80)               │
│  ┌─────────────────────────────────┐   │
│  │   React App (Static Files)      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Reverse Proxy:                         │
│  • /api/* → backend:5001                │
│  • /uploads/* → backend:5001            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Express Backend (Port 5001)        │
│  ┌─────────────────────────────────┐   │
│  │   API Routes & File Uploads     │   │
│  └─────────────────────────────────┘   │
│  Volume: /app/server/uploads            │
└─────────────────────────────────────────┘
```

## 📁 Docker Files Created

1. **`Dockerfile`** - Multi-stage build for React frontend with nginx
2. **`server/Dockerfile`** - Backend Node.js/Express container
3. **`docker-compose.yml`** - Service orchestration
4. **`nginx.conf`** - nginx reverse proxy configuration
5. **`.dockerignore`** - Exclude unnecessary files from builds
6. **`deploy.sh`** - Interactive deployment script

## 🔑 Key Features

### Frontend Container (nginx)
- Serves built React app
- Reverse proxy to backend API
- Gzip compression enabled
- Client-side routing support (React Router)
- Security headers configured
- Static asset caching (1 year for /assets/)

### Backend Container (Express)
- Production-optimized Node.js
- Persistent volume for uploads
- Automatic restart on failure
- Environment variables configurable

### Networking
- Services communicate via internal Docker network
- Only ports 80 and 5001 exposed to host
- Service discovery by container name

## 📊 Common Commands

### Viewing Status
```bash
# Check running containers
docker-compose ps

# View resource usage
docker stats

# Check logs (last 100 lines)
docker-compose logs --tail=100

# Follow logs for specific service
docker-compose logs -f backend
```

### Management
```bash
# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose build frontend

# Scale backend (requires load balancer)
docker-compose up -d --scale backend=3

# Execute commands in container
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Cleanup
```bash
# Stop containers (keep volumes)
docker-compose stop

# Remove containers (keep volumes)
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Remove unused Docker resources
docker system prune -a
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
PORT=5001
NODE_ENV=production
BACKEND_PORT=5001
NGINX_PORT=80
```

### Custom Port

Edit `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8080:80"  # Use port 8080 instead of 80
```

### Volume Backup

```bash
# Backup uploads
docker run --rm -v shoe-store_uploads:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/uploads-backup.tar.gz -C /data .

# Restore uploads
docker run --rm -v shoe-store_uploads:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/uploads-backup.tar.gz -C /data
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d
```

### Port already in use
```bash
# Find process using port 80
lsof -i :80

# Or use different port in docker-compose.yml
```

### Images not loading
1. Check backend is running: `docker-compose ps`
2. Check nginx proxy config: `docker-compose exec frontend cat /etc/nginx/conf.d/default.conf`
3. Verify uploads volume: `docker volume inspect shoe-store_uploads`

### Database/localStorage issue
- Admin dashboard saves to localStorage (client-side)
- In production, consider migrating to a database
- Uploaded images persist in Docker volume

## 🚀 Production Deployment

For production deployment:

1. **Set up SSL/TLS**
   - Use Let's Encrypt with certbot
   - Update nginx.conf for HTTPS
   - Redirect HTTP to HTTPS

2. **Use Environment Variables**
   - Store sensitive data in `.env` (not in git)
   - Use Docker secrets for sensitive data

3. **Database Setup**
   - Migrate from localStorage to PostgreSQL/MongoDB
   - Add database service to docker-compose.yml

4. **Monitoring**
   - Add health checks to containers
   - Set up logging aggregation
   - Configure alerts

5. **Security**
   - Review and update CORS settings
   - Enable rate limiting
   - Keep Docker images updated

## 📚 Full Documentation

For complete documentation, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## 🆘 Need Help?

- Check [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for detailed instructions
- View [README.md](./README.md) for application features
- Check Docker logs: `docker-compose logs -f`
