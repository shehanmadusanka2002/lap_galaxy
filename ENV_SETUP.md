# Lap Galaxy - Environment Setup Guide

This project uses environment variables for configuration. Follow these steps to set up your development environment.

## 📁 Environment Files Structure

```
lap_galaxy/
├── .env                    # Root environment (Docker Compose)
├── .env.example           # Root template
├── backend/
│   ├── .env              # Backend environment
│   └── .env.example      # Backend template
└── frontend/
    ├── .env              # Frontend environment
    └── .env.example      # Frontend template
```

## 🚀 Setup Instructions

### 1. Root Directory (.env)
For Docker Compose deployment:

```bash
# Copy the example file
cp .env.example .env
```

**Required Variables:**
- `DB_PASSWORD`: MySQL root password
- `JWT_SECRET`: Secret key for JWT token generation
- `ECR_REGISTRY`: AWS ECR registry URL (for deployment)

### 2. Backend (.env)
For local Spring Boot development:

```bash
# Navigate to backend directory
cd backend

# Copy the example file
cp .env.example .env
```

**Required Variables:**
- `DB_PASSWORD`: MySQL database password
- `JWT_SECRET`: Secret key for JWT authentication
- `SERVER_PORT`: Backend server port (default: 8080)
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 3306)
- `DB_NAME`: Database name (default: lapGalaxy)

### 3. Frontend (.env)
For Vite React development:

```bash
# Navigate to frontend directory
cd frontend

# Copy the example file
cp .env.example .env
```

**Required Variables:**
- `VITE_API_BASE_URL`: Backend API URL (default: http://localhost:8080/api)
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## 🔐 Security Best Practices

### Generating Strong JWT Secret
Use one of these methods to generate a secure JWT secret:

```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### Important Notes
- ⚠️ Never commit `.env` files to version control
- ✅ Always use `.env.example` as a template
- 🔒 Use strong passwords and secrets in production
- 🔄 Rotate secrets regularly
- 📝 Document all required environment variables

## 🐳 Docker Compose Usage

Start the application with Docker:

```bash
# Make sure .env file exists in root directory
docker-compose up -d
```

## 💻 Local Development

### Backend
```bash
cd backend
# Make sure .env file exists
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
# Make sure .env file exists
npm install
npm run dev
```

## 📋 Environment Variables Reference

### Backend Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| DB_PASSWORD | MySQL password | 1234 | Yes |
| JWT_SECRET | JWT signing key | (see example) | Yes |
| SERVER_PORT | Server port | 8080 | No |
| DB_HOST | Database host | localhost | No |
| DB_PORT | Database port | 3306 | No |
| DB_NAME | Database name | lapGalaxy | No |
| MAX_FILE_SIZE | Max upload size | 10MB | No |
| MAX_REQUEST_SIZE | Max request size | 10MB | No |

### Frontend Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8080/api | Yes |
| VITE_APP_NAME | Application name | Lap Galaxy | No |
| VITE_APP_VERSION | App version | 1.0.0 | No |

### Docker Compose Variables
| Variable | Description | Required |
|----------|-------------|----------|
| DB_PASSWORD | MySQL root password | Yes |
| JWT_SECRET | JWT signing key | Yes |
| ECR_REGISTRY | AWS ECR registry | For deployment |

## 🔍 Troubleshooting

### Backend Not Starting
- Check if MySQL is running on the specified port
- Verify DB_PASSWORD matches your MySQL password
- Ensure database name exists or has createDatabaseIfNotExist=true

### Frontend API Errors
- Verify VITE_API_BASE_URL points to running backend
- Check backend is accessible at the specified URL
- Ensure CORS is properly configured in backend

### Docker Compose Issues
- Verify .env file exists in root directory
- Check all required variables are set
- Ensure ports 3306 and 8080 are not in use

## 📞 Support
For issues or questions, please check the project documentation or create an issue.
