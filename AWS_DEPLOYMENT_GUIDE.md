# AWS EC2 Deployment Guide

## Database Setup Options

### Option 1: PostgreSQL on EC2 (Recommended)

1. **Install PostgreSQL on your EC2 instance:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

2. **Create database and user:**
```bash
sudo -u postgres psql
CREATE DATABASE cyber_crm;
CREATE USER crm_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cyber_crm TO crm_user;
\q
```

3. **Update Prisma schema:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. **Update environment variables:**
```bash
# .env
DATABASE_URL="postgresql://crm_user:your_secure_password@localhost:5432/cyber_crm"
JWT_SECRET="your_jwt_secret_here"
PORT=5000
NODE_ENV=production
```

### Option 2: AWS RDS PostgreSQL (Production Ready)

1. **Create RDS instance in AWS Console**
2. **Update DATABASE_URL:**
```bash
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/cyber_crm"
```

## Deployment Steps

### 1. Prepare Backend for Production

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Build application
npm run build
```

### 2. Frontend Build

```bash
cd frontend
npm install
npm run build
```

### 3. EC2 Setup Script

```bash
#!/bin/bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Clone your repository
git clone your-repo-url
cd cyber-crm

# Setup backend
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build

# Start backend with PM2
pm2 start dist/server.js --name "crm-backend"

# Setup frontend
cd ../frontend
npm install
npm run build

# Copy frontend build to Nginx
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo tee /etc/nginx/sites-available/cyber-crm << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/cyber-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Save PM2 configuration
pm2 save
pm2 startup
```

## Quick Commands

```bash
# Database migration
npx prisma migrate deploy

# Restart backend
pm2 restart crm-backend

# View logs
pm2 logs crm-backend

# Update frontend
npm run build && sudo cp -r dist/* /var/www/html/
```