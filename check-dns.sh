#!/bin/bash

# DNS Propagation Checker for my-test.co.ke
# Checks if DNS is properly configured

DOMAIN="my-test.co.ke"
EXPECTED_IP="77.237.241.239"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Checking DNS Configuration for ${DOMAIN}"
echo "Expected IP: ${EXPECTED_IP}"
echo "============================================"
echo ""

# Function to check DNS
check_dns() {
    local hostname=$1
    echo -e "${YELLOW}Checking: ${hostname}${NC}"
    
    # Get IP from DNS
    IP=$(dig +short ${hostname} | tail -n1)
    
    if [ -z "$IP" ]; then
        echo -e "${RED}❌ No DNS record found${NC}"
        return 1
    elif [ "$IP" == "$EXPECTED_IP" ]; then
        echo -e "${GREEN}✅ Correct! Points to ${IP}${NC}"
        return 0
    else
        echo -e "${RED}❌ Wrong IP: ${IP} (expected ${EXPECTED_IP})${NC}"
        return 1
    fi
}

# Check root domain
echo "1. Root Domain"
check_dns "${DOMAIN}"
ROOT_STATUS=$?
echo ""

# Check www subdomain
echo "2. WWW Subdomain"
check_dns "www.${DOMAIN}"
WWW_STATUS=$?
echo ""

# Check nameservers
echo "3. Nameservers"
echo -e "${YELLOW}Checking nameservers...${NC}"
NS=$(dig NS ${DOMAIN} +short | head -n2)
if [ -z "$NS" ]; then
    echo -e "${RED}❌ No nameservers found${NC}"
else
    echo -e "${GREEN}Nameservers:${NC}"
    echo "$NS"
fi
echo ""

# Overall status
echo "============================================"
if [ $ROOT_STATUS -eq 0 ] && [ $WWW_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 DNS IS CONFIGURED CORRECTLY!${NC}"
    echo ""
    echo "Your site should be accessible at:"
    echo "  http://${DOMAIN}:9090"
    echo "  http://www.${DOMAIN}:9090"
    echo ""
    echo "Next steps:"
    echo "  1. Test in browser: http://${DOMAIN}:9090"
    echo "  2. Update port to 80 (remove :9090)"
    echo "  3. Run ./setup-ssl.sh to enable HTTPS"
    exit 0
else
    echo -e "${RED}⚠️  DNS NOT CONFIGURED YET${NC}"
    echo ""
    echo "What to do:"
    echo "  1. Log into your domain registrar"
    echo "  2. Add A record: @ → ${EXPECTED_IP}"
    echo "  3. Add A record: www → ${EXPECTED_IP}"
    echo "  4. Wait 5-60 minutes for propagation"
    echo "  5. Run this script again"
    echo ""
    echo "In the meantime, access your site at:"
    echo "  http://${EXPECTED_IP}:9090"
    echo ""
    echo "See DNS_SETUP_GUIDE.md for detailed instructions"
    exit 1
fi
