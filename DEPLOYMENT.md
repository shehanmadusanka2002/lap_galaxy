# LapGalaxy CI/CD Pipeline Setup Guide

## Overview
This project uses GitHub Actions for automated CI/CD pipeline with separate workflows for Continuous Integration and Continuous Deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
- **Triggers**: Push/PR to `main` or `develop` branches
- **Jobs**:
  - Backend build and test with MySQL
  - Frontend build and lint
  - Integration checks

### 2. CD Pipeline (`cd-deploy.yml`)
- **Triggers**: Push to `main` branch (production deployment)
- **Jobs**:
  - Run tests with MySQL service
  - Build backend Docker image and push to AWS ECR
  - Build frontend and deploy to AWS S3
  - Deploy backend to EC2/ECS
  - Send deployment notifications

## Required GitHub Secrets

Add these secrets in: **Settings → Secrets and variables → Actions → New repository secret**

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - e.g., `us-east-1` (optional, defaults to us-east-1)

### Backend Deployment
- `ECR_REGISTRY` - AWS ECR registry URL (e.g., `123456789.dkr.ecr.us-east-1.amazonaws.com`)
- `BACKEND_API_URL` - Backend API URL (e.g., `https://api.lapgalaxy.com`)

### Frontend Deployment
- `S3_BUCKET_NAME` - S3 bucket name for frontend (e.g., `lapgalaxy-frontend`)
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID (optional)

### EC2 Deployment (if using EC2)
- `EC2_SSH_PRIVATE_KEY` - Private SSH key for EC2 access
- `EC2_HOST` - EC2 instance public IP or domain
- `EC2_USER` - SSH username (e.g., `ubuntu`, `ec2-user`)

### ECS Deployment (if using ECS)
- `ECS_CLUSTER_NAME` - ECS cluster name
- `ECS_SERVICE_NAME` - ECS service name

### Application Secrets
- `JWT_SECRET` - JWT secret key for production
- `DB_PASSWORD` - MySQL root password for production

## Infrastructure Setup

### 1. AWS ECR (Elastic Container Registry)
```bash
# Create ECR repository for backend
aws ecr create-repository --repository-name lapgalaxy-backend --region us-east-1
```

### 2. AWS S3 + CloudFront (Frontend)
```bash
# Create S3 bucket
aws s3 mb s3://lapgalaxy-frontend

# Enable static website hosting
aws s3 website s3://lapgalaxy-frontend --index-document index.html --error-document index.html

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket lapgalaxy-frontend --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lapgalaxy-frontend/*"
    }
  ]
}
```

### 3. EC2 Instance Setup

**SSH into EC2 and install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Create application directory
sudo mkdir -p /opt/lapgalaxy
sudo chown $USER:$USER /opt/lapgalaxy
cd /opt/lapgalaxy

# Copy docker-compose.yml to this directory
```

**Create `.env` file on EC2:**
```bash
# /opt/lapgalaxy/.env
ECR_REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com
DB_PASSWORD=your_secure_password
JWT_SECRET=your_secure_jwt_secret
```

**Configure AWS CLI on EC2:**
```bash
aws configure
# Enter AWS credentials to allow ECR login
```

### 4. AWS RDS (Production Database - Optional)
For production, consider using AWS RDS instead of MySQL container:

```bash
# Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier lapgalaxy-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

Then update `SPRING_DATASOURCE_URL` to point to RDS endpoint.

## Deployment Flow

### Automatic Deployment (CD Pipeline)
1. Push code to `main` branch
2. GitHub Actions automatically:
   - Runs all tests with MySQL
   - Builds backend Docker image
   - Pushes image to AWS ECR
   - Builds frontend React app
   - Deploys frontend to S3
   - Pulls latest backend image on EC2
   - Restarts backend container with docker-compose

### Manual Deployment
Trigger deployment manually from GitHub Actions:
- Go to **Actions** → **CD - Deploy to Production** → **Run workflow**

## Local Development with Docker

### Build and run locally:
```bash
# Build backend JAR
cd backend
mvn clean package -DskipTests

# Build Docker image
docker build -t lapgalaxy-backend .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Monitoring

### View Pipeline Status
- Go to **GitHub → Actions** tab
- Click on workflow run to see detailed logs

### View Application Logs on EC2
```bash
ssh user@ec2-host
cd /opt/lapgalaxy
docker-compose logs -f backend
```

## Rollback

### Rollback to previous version:
```bash
# SSH into EC2
ssh user@ec2-host
cd /opt/lapgalaxy

# Pull specific image tag
docker pull <ECR_REGISTRY>/lapgalaxy-backend:<commit-sha>

# Update docker-compose.yml with specific tag
# Restart
docker-compose up -d
```

## Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Rotate credentials** regularly
3. **Use IAM roles** for EC2 instead of access keys when possible
4. **Enable S3 bucket encryption**
5. **Use HTTPS** - Set up SSL/TLS certificates
6. **Restrict security groups** - Only allow necessary ports
7. **Enable CloudWatch** logging and monitoring
8. **Use AWS Secrets Manager** for production secrets

## Troubleshooting

### Build fails on GitHub Actions
- Check GitHub Actions logs
- Verify all secrets are correctly set
- Test locally with `docker build`

### Backend won't connect to database
- Verify MySQL service is healthy
- Check `SPRING_DATASOURCE_URL` environment variable
- Ensure database name exists

### Frontend deployment fails
- Check S3 bucket permissions
- Verify AWS credentials
- Ensure bucket name is correct

### ECR authentication fails
- Verify IAM permissions for ECR
- Check AWS credentials are valid
- Try `aws ecr get-login-password` manually

## Cost Optimization

- Use **AWS Free Tier** (t2.micro EC2, 5GB S3)
- Stop EC2 instances when not needed
- Use **S3 lifecycle policies** to archive old files
- Monitor AWS billing dashboard

## Next Steps

1. Set up all required GitHub Secrets
2. Create AWS infrastructure (ECR, S3, EC2)
3. Configure EC2 with Docker and docker-compose
4. Push to main branch to trigger deployment
5. Monitor deployment in GitHub Actions
6. Verify application is running

## Support

For issues or questions:
- Check GitHub Actions logs
- Review application logs with `docker-compose logs`
- Verify AWS resource configurations
