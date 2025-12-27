#!/bin/bash

# Production Deployment Script for my-test.co.ke
# Server: 77.237.241.239

set -e

echo "🚀 Deploying Urbansole Shoe Store to Production Server"
echo "=================================================="

SERVER_IP="77.237.241.239"
SERVER_USER="root"
DEPLOY_PATH="/var/www/shoe-store"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Testing server connection...${NC}"
ssh -o ConnectTimeout=10 ${SERVER_USER}@${SERVER_IP} "echo 'Connection successful!'"

echo -e "\n${YELLOW}Step 2: Installing Docker and Docker Compose on server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    # Update system
    apt-get update
    
    # Install prerequisites
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
    
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Verify installation
    docker --version
    docker compose version
    
    echo "✅ Docker installed successfully!"
ENDSSH

echo -e "\n${YELLOW}Step 3: Creating deployment directory...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"

echo -e "\n${YELLOW}Step 4: Copying project files to server...${NC}"
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'server/uploads' \
    --exclude '.env' \
    ./ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/

echo -e "\n${YELLOW}Step 5: Setting up production configuration...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << ENDSSH
    cd ${DEPLOY_PATH}
    
    # Create uploads directory with proper permissions
    mkdir -p server/uploads
    chmod 755 server/uploads
    
    # Build and start containers
    docker compose down 2>/dev/null || true
    docker compose up -d --build
    
    # Show running containers
    echo ""
    echo "Running containers:"
    docker compose ps
    
    echo ""
    echo "✅ Deployment complete!"
ENDSSH

echo -e "\n${GREEN}=================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "=================================================="
echo ""
echo "Your site is now running at:"
echo "  http://${SERVER_IP}:9090"
echo "  http://my-test.co.ke:9090 (if DNS is configured)"
echo ""
echo "Admin panel:"
echo "  http://${SERVER_IP}:9090/admin/login"
echo ""
echo "Next steps:"
echo "  1. Configure DNS A records to point to ${SERVER_IP}"
echo "  2. Set up SSL certificate (run: ./setup-ssl.sh)"
echo "  3. Change frontend port to 80 in docker-compose.yml"
echo ""
