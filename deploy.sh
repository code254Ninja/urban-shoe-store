#!/bin/bash

# Shoe Store Docker Deployment Script
# This script helps deploy the application using Docker

set -e

echo "🚀 Shoe Store Docker Deployment"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Function to show menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Build and start services"
    echo "2) Stop services"
    echo "3) View logs"
    echo "4) Restart services"
    echo "5) Clean up (remove containers and volumes)"
    echo "6) Build without cache"
    echo "7) Check service status"
    echo "8) Exit"
    echo ""
}

# Function to build and start
build_and_start() {
    echo ""
    print_warning "Building and starting services..."
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        print_success "Services started successfully!"
        echo ""
        echo "📱 Application URLs:"
        echo "   Frontend: http://localhost"
        echo "   Backend API: http://localhost:5001"
        echo ""
        echo "To view logs, run: docker-compose logs -f"
    else
        print_error "Failed to start services"
    fi
}

# Function to stop services
stop_services() {
    echo ""
    print_warning "Stopping services..."
    docker-compose stop
    print_success "Services stopped"
}

# Function to view logs
view_logs() {
    echo ""
    echo "Select service:"
    echo "1) All services"
    echo "2) Frontend only"
    echo "3) Backend only"
    read -p "Choice: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f ;;
        2) docker-compose logs -f frontend ;;
        3) docker-compose logs -f backend ;;
        *) print_error "Invalid choice" ;;
    esac
}

# Function to restart services
restart_services() {
    echo ""
    print_warning "Restarting services..."
    docker-compose restart
    print_success "Services restarted"
}

# Function to clean up
cleanup() {
    echo ""
    print_warning "This will remove all containers and volumes (including uploaded images)"
    read -p "Are you sure? (y/N): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        docker-compose down -v
        print_success "Cleanup complete"
    else
        print_warning "Cleanup cancelled"
    fi
}

# Function to build without cache
build_no_cache() {
    echo ""
    print_warning "Building without cache..."
    docker-compose build --no-cache
    print_success "Build complete"
}

# Function to check status
check_status() {
    echo ""
    docker-compose ps
    echo ""
    print_success "Service status displayed above"
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice
    
    case $choice in
        1) build_and_start ;;
        2) stop_services ;;
        3) view_logs ;;
        4) restart_services ;;
        5) cleanup ;;
        6) build_no_cache ;;
        7) check_status ;;
        8) 
            echo ""
            print_success "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            ;;
    esac
done
