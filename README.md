# Lap Galaxy 🚀

A full-stack e-commerce platform for laptop sales, built with modern web technologies and cloud-ready architecture.

## 📋 Overview

Lap Galaxy is a comprehensive e-commerce solution featuring product management, shopping cart functionality, order processing, and user authentication. The application is containerized with Docker and includes Kubernetes deployment configurations for scalable cloud deployments.

## ✨ Features

### Customer Features
- 🛍️ **Product Browsing**: Search and filter laptops with detailed specifications
- 🛒 **Shopping Cart**: Add, update, and remove items with real-time price calculations
- 💳 **Secure Checkout**: Complete order processing with user authentication
- 👤 **User Authentication**: JWT-based secure login and registration
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🌙 **Dark Mode**: Toggle between light and dark themes

### Admin Features
- 📊 **Admin Dashboard**: Comprehensive management interface
- 📦 **Product Management**: CRUD operations for laptop inventory
- 👥 **User Management**: View and manage customer accounts
- 📋 **Order Management**: Track and process customer orders
- 🖼️ **Hero Section Management**: Dynamic homepage banner updates
- 📤 **File Upload**: Image management for product listings

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot (Java)
- **Security**: Spring Security with JWT Authentication
- **Database**: MySQL/PostgreSQL
- **Build Tool**: Maven
- **File Storage**: Local/Cloud storage configuration

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Hooks

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes
- **Web Server**: Nginx (for frontend)
- **Deployment**: AWS S3 (static hosting) / Container platforms

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **Java JDK** (11 or higher)
- **Maven** (3.6+)
- **Docker** and **Docker Compose** (for containerized deployment)
- **MySQL/PostgreSQL** (or Docker container)

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/lap-galaxy.git
cd lap-galaxy
```

### Environment Configuration

1. **Backend Configuration**
   - Navigate to `backend/src/main/resources/`
   - Configure `application.properties` with your database credentials
   - Set JWT secret and expiration settings
   - Configure file upload directory

2. **Frontend Configuration**
   - Create `.env` file in the `frontend/` directory
   - Add API endpoint configuration:
     ```
     VITE_API_URL=http://localhost:8080/api
     ```

Refer to [ENV_SETUP.md](ENV_SETUP.md) and [ENV_QUICK_REFERENCE.md](ENV_QUICK_REFERENCE.md) for detailed configuration.

### Running with Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8080

### Manual Setup

#### Backend

```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The backend API will start on `http://localhost:8080`

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The frontend will start on `http://localhost:5173` (dev mode)

## 📁 Project Structure

```
lap-galaxy/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source files
│   │   │   │   └── com/example/productmanagement/
│   │   │   │       ├── config/        # Security & JWT config
│   │   │   │       ├── controller/    # REST controllers
│   │   │   │       ├── dto/           # Data transfer objects
│   │   │   │       ├── model/         # Entity models
│   │   │   │       ├── repository/    # Data access layer
│   │   │   │       └── service/       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/           # Unit tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/                  # Additional documentation
├── uploads/               # File upload directory
├── docker-compose.yml     # Multi-container setup
└── README.md
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Password reset

### Product Endpoints
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Cart & Order Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/admin/orders` - Get all orders (Admin)

## 🚢 Deployment

### Docker Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Docker deployment instructions.

### Kubernetes Deployment
See [K8S_DEPLOYMENT.md](K8S_DEPLOYMENT.md) for Kubernetes manifests and deployment guide.

### AWS S3 Static Hosting
See [docs/S3_FRONTEND_SETUP.md](docs/S3_FRONTEND_SETUP.md) for frontend deployment to AWS S3.

## 📚 Additional Documentation

- [Cart Implementation](CART_IMPLEMENTATION.md) - Shopping cart feature details
- [Order Management](ORDER_MANAGEMENT.md) - Order processing workflow
- [Responsive Updates](RESPONSIVE_UPDATES.md) - Mobile responsiveness guide
- [Frontend Environment](FRONTEND_ENV_UPDATE.md) - Frontend configuration

## 🔐 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control (User/Admin)
- CORS configuration
- Secure file upload validation

## 🧪 Testing

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests (if configured)
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Shehan**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Spring Boot community
- React and Vite teams
- Tailwind CSS
- All open-source contributors

---

⭐ If you found this project helpful, please give it a star!
