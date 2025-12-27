#!/bin/bash

# SSL Certificate Setup Script for my-test.co.ke
# Server: 77.237.241.239

set -e

SERVER_IP="77.237.241.239"
SERVER_USER="root"
DOMAIN="my-test.co.ke"
DEPLOY_PATH="/var/www/shoe-store"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔒 Setting up SSL Certificate for ${DOMAIN}"
echo "=================================================="

echo -e "${YELLOW}Step 1: Checking DNS configuration...${NC}"
DNS_IP=$(dig +short ${DOMAIN} | tail -n1)
if [ "$DNS_IP" == "$SERVER_IP" ]; then
    echo -e "${GREEN}✓ DNS correctly points to ${SERVER_IP}${NC}"
else
    echo -e "${RED}⚠ WARNING: DNS does not point to server!${NC}"
    echo "Current DNS IP: ${DNS_IP}"
    echo "Server IP: ${SERVER_IP}"
    echo ""
    echo "Please configure your DNS A records:"
    echo "  my-test.co.ke → ${SERVER_IP}"
    echo "  www.my-test.co.ke → ${SERVER_IP}"
    echo ""
    read -p "Continue anyway? (y/N): " continue
    if [ "$continue" != "y" ]; then
        exit 1
    fi
fi

echo -e "\n${YELLOW}Step 2: Installing Certbot...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo "✅ Certbot installed"
ENDSSH

echo -e "\n${YELLOW}Step 3: Stopping containers temporarily...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_PATH} && docker compose down"

echo -e "\n${YELLOW}Step 4: Obtaining SSL certificate...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
    certbot certonly --standalone \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        --non-interactive \
        --agree-tos \
        -m admin@${DOMAIN} \
        --preferred-challenges http
    
    echo "✅ SSL certificate obtained"
ENDSSH

echo -e "\n${YELLOW}Step 5: Creating nginx SSL configuration...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cat > /var/www/shoe-store/nginx-ssl.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name my-test.co.ke www.my-test.co.ke;
    return 301 https://my-test.co.ke$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name my-test.co.ke www.my-test.co.ke;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/my-test.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/my-test.co.ke/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Redirect www to non-www
    if ($host = 'www.my-test.co.ke') {
        return 301 https://my-test.co.ke$request_uri;
    }
    
    # Root directory for static files
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Client body size limit (for file uploads)
    client_max_body_size 10M;

    # API proxy to backend
    location /api/ {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded images proxy to backend
    location /uploads/ {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files with caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF
    echo "✅ nginx SSL configuration created"
ENDSSH

echo -e "\n${YELLOW}Step 6: Updating docker-compose for SSL...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cat > /var/www/shoe-store/docker-compose.yml << 'EOF'
services:
  # Backend service (Express API)
  backend:
    build:
      context: .
      dockerfile: server/Dockerfile
    container_name: shoe-store-backend
    restart: unless-stopped
    ports:
      - "5001:5001"
    volumes:
      - uploads:/app/server/uploads
    networks:
      - shoe-store-network
    environment:
      - NODE_ENV=production
      - PORT=5001

  # Frontend service (React + nginx)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: shoe-store-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - shoe-store-network
    depends_on:
      - backend

networks:
  shoe-store-network:
    driver: bridge

volumes:
  uploads:
    driver: local
EOF
    echo "✅ docker-compose updated for SSL"
ENDSSH

echo -e "\n${YELLOW}Step 7: Starting containers with SSL...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "cd ${DEPLOY_PATH} && docker compose up -d --build"

echo -e "\n${YELLOW}Step 8: Setting up automatic certificate renewal...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    # Add renewal hook to restart containers
    cat > /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh << 'HOOK'
#!/bin/bash
cd /var/www/shoe-store
docker compose restart frontend
HOOK
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/restart-docker.sh
    
    # Test renewal
    certbot renew --dry-run
    
    echo "✅ Auto-renewal configured"
ENDSSH

echo -e "\n${GREEN}=================================================="
echo "✅ SSL CERTIFICATE INSTALLED SUCCESSFULLY!"
echo "=================================================="
echo ""
echo "Your site is now available at:"
echo "  https://my-test.co.ke"
echo "  https://www.my-test.co.ke (redirects to non-www)"
echo ""
echo "HTTP traffic is automatically redirected to HTTPS"
echo ""
echo "Certificate will auto-renew every 90 days"
echo ""
