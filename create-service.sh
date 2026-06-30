#!/bin/bash

#############################################
#
# Author: Srikhar Dogiparthy
# Date: 06/20/2026
# Version: v1
# Usage: To creates file structure skeleton for each service
#
############################################

# Usage:
# ./create-service.sh example

if [ -z "$1" ]; then
	echo "Usage: ./create-service.sh <service-name> --> creates you a service-name skeleton." 
	exit 1
fi

SERVICE_NAME=$1
SERVICE_DIR="${SERVICE_NAME}-service"

# translate (tr) first letter to uppercase
ENTITY_NAME="$(tr '[:lower:]' '[:upper:]' <<< "${SERVICE_NAME:0:1}")${SERVICE_NAME:1}"

echo "Creating $SERVICE_DIR..."

#Create directories
mkdir -p "$SERVICE_DIR/src"/{config,entities,middleware,routes,controllers,types}

# Create files
touch "$SERVICE_DIR/src/config/database.ts"
touch "$SERVICE_DIR/src/config/swagger.ts"

touch "$SERVICE_DIR/src/entities/${ENTITY_NAME}.ts"

touch "$SERVICE_DIR/src/middleware/auth.middleware.ts"
touch "$SERVICE_DIR/src/routes/${SERVICE_NAME}.routes.ts"
touch "$SERVICE_DIR/src/controllers/${SERVICE_NAME}.controller.ts"

touch "$SERVICE_DIR/src/types/index.ts"
touch "$SERVICE_DIR/src/app.ts"

touch "$SERVICE_DIR/.env"

# Create .dockerignore with predefined content
cat > "$SERVICE_DIR/.dockerignore" << 'EOF'
node_modules/
dist/
.env
EOF

# Create .gitignore with predefined content
cat > "$SERVICE_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.*
!.env.example

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage
coverage/

# TypeScript cache
*.tsbuildinfo

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/

# Docker
.docker/

# ESLint cache
.eslintcache

# Package manager lock files (choose based on team preference)
# package-lock.json
# yarn.lock
# pnpm-lock.yaml

*.txt
EOF

echo "Service created successfully!"
echo "Location: $SERVICE_DIR"
