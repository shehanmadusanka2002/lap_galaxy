# LapGalaxy - AWS EC2 Kubernetes (K3s) Deployment Guide 🚀

## Prerequisites
- AWS EC2 Ubuntu 22.04 (t2.micro - Free Tier)
- Docker Hub Account
- GitHub Account

---

## Step 1: AWS EC2 Server Setup 🏗️

### 1.1 Create EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Select **Ubuntu 22.04 LTS**
3. Instance type: **t2.micro** (Free Tier)
4. Create/Select Key Pair (.pem file)
5. Security Group Inbound Rules:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 8080 (Backend)
   - Port 30000-32767 (NodePorts)

### 1.2 Connect to Server
```bash
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

### 1.3 Setup Swap Memory (Important for t2.micro!)
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 1.4 Install K3s (Lightweight Kubernetes)
```bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
echo 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml' >> ~/.bashrc
```

### 1.5 Verify Installation
```bash
kubectl get nodes
```

---

## Step 2: GitHub Secrets Setup 🔑

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password |
| `EC2_HOST` | Your EC2 Public IP |
| `EC2_SSH_KEY` | Contents of your .pem file |

---

## Step 3: MySQL Database Setup 🗄️

### 3.1 Create MySQL Deployment
SSH into your EC2 and run:

```bash
cat <<EOF > mysql-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "lapgalaxy123"
        - name: MYSQL_DATABASE
          value: "lapgalaxy"
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
EOF

kubectl apply -f mysql-deployment.yaml
```

### 3.2 Create Kubernetes Secrets
```bash
kubectl create secret generic db-secrets \
  --from-literal=username='root' \
  --from-literal=password='lapgalaxy123' \
  --from-literal=url='jdbc:mysql://mysql-service:3306/lapgalaxy?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true'

kubectl create secret generic app-secrets \
  --from-literal=jwt-secret='your-super-secret-jwt-key-here-make-it-long'
```

---

## Step 4: Deploy! 🎉

### Option 1: Automatic Deployment
Simply push code to `main` branch:
- Backend changes → triggers `deploy-backend.yml`
- Frontend changes → triggers `deploy-frontend.yml`

### Option 2: Manual Deployment
Go to **GitHub Actions → Select Workflow → Run workflow**

---

## Step 5: Access Your App 🌐

After successful deployment:

- **Frontend**: `http://<EC2_PUBLIC_IP>:30000`
- **Backend API**: `http://<EC2_PUBLIC_IP>:32050/api`

---

## Useful Commands 📋

### Check Deployments
```bash
kubectl get pods
kubectl get services
kubectl get deployments
```

### View Logs
```bash
kubectl logs -f deployment/backend-deployment
kubectl logs -f deployment/frontend-deployment
```

### Restart Deployment
```bash
kubectl rollout restart deployment/backend-deployment
kubectl rollout restart deployment/frontend-deployment
```

### Delete Everything (Reset)
```bash
kubectl delete deployment --all
kubectl delete service --all
kubectl delete secret db-secrets app-secrets
```

---

## Troubleshooting 🔧

### Pod not starting?
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Database connection issues?
```bash
kubectl exec -it <mysql-pod-name> -- mysql -u root -plapgalaxy123
```

### Out of memory?
Check swap:
```bash
free -h
```

---

## Architecture Diagram 📊

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS EC2 (t2.micro)                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    K3s Cluster                       │    │
│  │                                                      │    │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│  │   │   Frontend   │  │   Backend    │  │  MySQL   │ │    │
│  │   │   (Nginx)    │  │ (Spring Boot)│  │          │ │    │
│  │   │   Port:80    │  │   Port:8080  │  │ Port:3306│ │    │
│  │   └──────────────┘  └──────────────┘  └──────────┘ │    │
│  │         │                  │                │      │    │
│  │   NodePort:30000    NodePort:32050    ClusterIP    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                    │                  │
                    ▼                  ▼
            http://IP:30000    http://IP:32050/api
              (Frontend)          (Backend)
```

---

## Cost: $0 (Free Tier) 💰

All resources used are within AWS Free Tier limits:
- EC2 t2.micro: 750 hours/month free
- Storage: 30GB EBS free
- Data Transfer: 15GB/month free

---

**Happy Deploying! 🚀**
