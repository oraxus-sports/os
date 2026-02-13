#!/bin/bash

# Production Build Script for Microfrontends
# Usage: ./build-production.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Environment URLs (can be overridden with environment variables)
COMPONENTS_URL=${COMPONENTS_URL:-"https://components.yourdomain.com"}
AUTH_URL=${AUTH_URL:-"https://auth.yourdomain.com"}
PLATFORM_URL=${PLATFORM_URL:-"https://platform.yourdomain.com"}

echo -e "${BLUE}🚀 Building Microfrontends for Production${NC}\n"
echo -e "${YELLOW}Components URL: $COMPONENTS_URL${NC}"
echo -e "${YELLOW}Auth URL: $AUTH_URL${NC}"
echo -e "${YELLOW}Platform URL: $PLATFORM_URL${NC}\n"

# Build Components
echo -e "${BLUE}📦 Building Components...${NC}"
cd components
PUBLIC_PATH="${COMPONENTS_URL}/" npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Components built successfully${NC}\n"
else
    echo -e "${RED}✗ Components build failed${NC}"
    exit 1
fi
cd ..

# Build Auth
echo -e "${BLUE}📦 Building Auth...${NC}"
cd auth
PUBLIC_PATH="${AUTH_URL}/" npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Auth built successfully${NC}\n"
else
    echo -e "${RED}✗ Auth build failed${NC}"
    exit 1
fi
cd ..

# Build Platform (must be last)
echo -e "${BLUE}📦 Building Platform...${NC}"
cd platform
COMPONENTS_URL="$COMPONENTS_URL" \
AUTH_URL="$AUTH_URL" \
PUBLIC_PATH="${PLATFORM_URL}/" \
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Platform built successfully${NC}\n"
else
    echo -e "${RED}✗ Platform build failed${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}✨ All microfrontends built successfully!${NC}\n"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Deploy components/dist to $COMPONENTS_URL"
echo "2. Deploy auth/dist to $AUTH_URL"
echo "3. Deploy platform/dist to $PLATFORM_URL"
echo ""
