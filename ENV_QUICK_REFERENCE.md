# Quick Reference: Environment Variables

## 📦 Project Structure

```
lap_galaxy/
├── .env                          # Docker Compose environment
├── .env.example                  # Docker Compose template
├── backend/
│   ├── .env                     # Backend Spring Boot environment
│   └── .env.example             # Backend template
└── frontend/
    ├── .env                     # Frontend Vite environment
    └── .env.example             # Frontend template
```

## 🔑 Environment Variables by Component

### Root (.env) - Docker Compose
```env
DB_PASSWORD=root
JWT_SECRET=your_jwt_secret_key_here
ECR_REGISTRY=your-aws-account-id.dkr.ecr.region.amazonaws.com
```

### Backend (.env)
```env
# Database
DB_PASSWORD=1234
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lapGalaxy

# Security
JWT_SECRET=your_jwt_secret_key_here

# Server
SERVER_PORT=8080

# File Upload
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB
```

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# App Info
VITE_APP_NAME=Lap Galaxy
VITE_APP_VERSION=1.0.0
```

## 🎯 Common Tasks

### Change API Endpoint
Edit `frontend/.env`:
```env
# For local backend
VITE_API_BASE_URL=http://localhost:8080/api

# For staging
VITE_API_BASE_URL=https://staging-api.lapgalaxy.com/api

# For production
VITE_API_BASE_URL=https://api.lapgalaxy.com/api
```

### Change Database Password
Edit `backend/.env`:
```env
DB_PASSWORD=your_new_password
```

Also update `docker-compose.yml` or root `.env`:
```env
DB_PASSWORD=your_new_password
```

### Generate Secure JWT Secret
```bash
# Using OpenSSL
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

## 🚀 Running the Application

### With Docker
```bash
# Make sure root .env exists
docker-compose up -d
```

### Local Development

**Backend:**
```bash
cd backend
# Make sure backend/.env exists
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
# Make sure frontend/.env exists
npm install
npm run dev
```

## 🔒 Security Checklist

- [ ] `.env` files are listed in `.gitignore`
- [ ] Changed default passwords
- [ ] Generated strong JWT secret
- [ ] Created `.env` from `.env.example`
- [ ] Never commit `.env` files to Git
- [ ] Use different secrets for each environment

## 📝 Notes

- **VITE_** prefix is required for frontend environment variables
- Backend uses Spring Boot's property substitution: `${VAR_NAME:default}`
- All `.env` files are ignored by Git
- Use `.env.example` files as templates for new developers

## 🔗 Related Documentation

- [ENV_SETUP.md](ENV_SETUP.md) - Complete setup guide
- [FRONTEND_ENV_UPDATE.md](FRONTEND_ENV_UPDATE.md) - Frontend update details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
