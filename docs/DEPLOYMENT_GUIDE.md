# 🚀 MediBot Deployment Guide

**Complete guide for deploying MediBot to production**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Azure Deployment](#azure-deployment)
6. [Production Checklist](#production-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Prerequisites

### Required Software

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Git**

### Cloud Accounts (Optional)

- AWS Account (for AWS deployment)
- Azure Account (for Azure deployment)
- Domain name (for production URL)

---

## 💻 Local Development

### Quick Start

```bash
# Clone repository
cd "D:\Gemini CLI\QWEN\AI Powered Medibot\MediBot\docker"

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Database:** localhost:5432

---

## 🐳 Docker Deployment

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: medibot
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - medibot_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - medibot_network

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
      target: production
    restart: always
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/medibot
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      SECRET_KEY: ${SECRET_KEY}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      APP_ENV: production
      DEBUG: False
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - medibot_network

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
      target: production
      args:
        - REACT_APP_API_URL=https://api.yourdomain.com
    restart: always
    depends_on:
      - backend
    networks:
      - medibot_network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - medibot_network

volumes:
  postgres_data:
  redis_data:

networks:
  medibot_network:
    driver: bridge
```

### Environment Variables

Create `.env.production`:

```bash
# Database
DB_USER=medibot_prod
DB_PASSWORD=super-secure-password-change-this
DB_NAME=medibot

# Redis
REDIS_PASSWORD=redis-secure-password

# Security
SECRET_KEY=your-super-secret-key-min-32-chars
JWT_SECRET_KEY=your-jwt-secret-key-min-32-chars

# Application
APP_ENV=production
DEBUG=False

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Deploy

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ☁️ AWS Deployment

### Option 1: EC2 Instance

#### 1. Launch EC2 Instance

```bash
# Instance Type: t3.medium (minimum)
# AMI: Amazon Linux 2 or Ubuntu 22.04
# Storage: 20 GB GP2
# Security Group:
#   - Port 80 (HTTP)
#   - Port 443 (HTTPS)
#   - Port 22 (SSH)
```

#### 2. Install Docker

```bash
# Update system
sudo yum update -y  # Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # Ubuntu

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

#### 3. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd MediBot/docker

# Copy production env
cp .env.example .env.production
nano .env.production  # Edit variables

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y  # Amazon Linux

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet
```

---

### Option 2: AWS Elastic Beanstalk

#### 1. Install EB CLI

```bash
pip install awsebcli
```

#### 2. Initialize EB

```bash
cd backend
eb init

# Select:
# - Region: your-region
# - Platform: Docker
# - SSH: Yes
```

#### 3. Create Environment

```bash
eb create medibot-production

# Set environment variables
eb setenv SECRET_KEY=your-key JWT_SECRET_KEY=your-jwt-key
```

#### 4. Deploy

```bash
eb deploy
```

---

## 🌐 Azure Deployment

### Option 1: Azure App Service

#### 1. Create Resource Group

```bash
az group create --name medibot-rg --location eastus
```

#### 2. Create App Service Plan

```bash
az appservice plan create \
  --name medibot-plan \
  --resource-group medibot-rg \
  --sku B1 \
  --is-linux
```

#### 3. Create Web App

```bash
az webapp create \
  --resource-group medibot-rg \
  --plan medibot-plan \
  --name medibot-app \
  --deployment-container-image-name \
  your-dockerhub-username/medibot-backend:latest
```

#### 4. Configure Settings

```bash
az webapp config appsettings set \
  --resource-group medibot-rg \
  --name medibot-app \
  --settings \
  DATABASE_URL="postgresql://..." \
  SECRET_KEY="your-key" \
  JWT_SECRET_KEY="your-jwt-key"
```

---

### Option 2: Azure Kubernetes Service (AKS)

#### 1. Install Azure CLI

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### 2. Create AKS Cluster

```bash
az aks create \
  --resource-group medibot-rg \
  --name medibot-aks \
  --node-count 2 \
  --enable-addons monitoring \
  --generate-ssh-keys
```

#### 3. Deploy to Kubernetes

```bash
# Get credentials
az aks get-credentials --resource-group medibot-rg --name medibot-aks

# Deploy
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## ✅ Production Checklist

### Security

- [ ] Change all default passwords
- [ ] Generate new SECRET_KEY and JWT_SECRET_KEY
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall rules
- [ ] Enable automatic security updates
- [ ] Set up backup strategy
- [ ] Configure logging and monitoring

### Database

- [ ] Use managed database (RDS/Azure SQL)
- [ ] Enable automated backups
- [ ] Configure read replicas for scaling
- [ ] Set up monitoring alerts
- [ ] Test disaster recovery

### Application

- [ ] Set DEBUG=False
- [ ] Configure proper logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure rate limiting
- [ ] Enable CORS for specific domains
- [ ] Test all API endpoints
- [ ] Load testing

### Monitoring

- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up alerts for errors
- [ ] Monitor database performance
- [ ] Monitor server resources
- [ ] Track API response times

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Database status
docker-compose exec postgres pg_isready

# Redis status
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Backups

```bash
# Database backup
docker-compose exec postgres pg_dump -U medibot_user medibot > backup.sql

# Restore
docker-compose exec -T postgres psql -U medibot_user medibot < backup.sql
```

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check resources
docker stats

# Restart
docker-compose restart
```

#### 2. Database Connection Error

```bash
# Check if postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres pg_isready -U medibot_user
```

#### 3. High Memory Usage

```bash
# Check memory
docker stats

# Restart services
docker-compose restart

# Clear unused resources
docker system prune -a
```

---

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review documentation: `docs/` folder
- Contact team: See README.md

---

**© 2024 MediBot Team**
