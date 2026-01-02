# LapGalaxy - Azure Cloud Native Deployment Guide 🚀

## Overview
මේ guide එකෙන් LapGalaxy project එක Azure Cloud Native services use කරලා deploy කරන්නේ කොහොමද කියලා කියලා දෙනවා.

**Architecture:**
- **Frontend**: Azure Static Web Apps (Free!)
- **Backend**: Azure Container Apps (Pay-as-you-go, Scale to Zero)
- **Database**: Azure Database for MySQL Flexible Server
- **Container Registry**: Azure Container Registry (ACR)

---

## Step 1: Azure Resource Group එක හදමු 🏗️

### 1.1 Azure Portal එකට Login වෙන්න
- https://portal.azure.com
- Student account එකක් තියෙනම් Azure for Students activate කරන්න ($100 free credit!)

### 1.2 Resource Group හදන්න
1. Search bar එකේ "Resource groups" search කරන්න
2. **+ Create** click කරන්න
3. Details:
   - **Name**: `rg-lapgalaxy`
   - **Region**: `East US` (Free services වැඩියෙන් තියෙනවා)
4. **Review + Create** → **Create**

---

## Step 2: Azure Container Registry (ACR) 📦

### 2.1 ACR හදන්න
1. Search: "Container registries" → **+ Create**
2. Details:
   - **Resource Group**: `rg-lapgalaxy`
   - **Registry name**: `acrlapgalaxyshehan` (unique name - lowercase only)
   - **Location**: `East US`
   - **SKU**: `Basic` (ලාබයි)
3. **Review + Create** → **Create**

### 2.2 Access Keys ගන්න
1. ACR resource එකට ගිහින් **Settings** → **Access keys**
2. **Admin user** → **Enable** කරන්න
3. මේවා save කරගන්න:
   - Login server: `acrlapgalaxyshehan.azurecr.io`
   - Username: `acrlapgalaxyshehan`
   - Password: (shown password එක copy කරන්න)

---

## Step 3: Azure Database for MySQL 🗄️

### 3.1 MySQL Server හදන්න
1. Search: "Azure Database for MySQL flexible servers" → **+ Create**
2. Details:
   - **Resource Group**: `rg-lapgalaxy`
   - **Server name**: `mysql-lapgalaxy`
   - **Region**: `East US`
   - **Workload type**: `For development or hobby projects` (Burstable B1ms)
   - **Authentication**: MySQL authentication
   - **Admin username**: `lapgalaxyadmin`
   - **Password**: (strong password එකක් දෙන්න)
3. **Networking** tab:
   - ✅ "Allow public access from any Azure service within Azure"
   - ✅ "Allow public access from 0.0.0.0" (development වලදී - production වලදී මේක off කරන්න)
4. **Review + Create** → **Create**

### 3.2 Database එක හදන්න
1. MySQL server resource එකට ගිහින් **Settings** → **Databases**
2. **+ Add** → Name: `lapgalaxy` → **Save**

### 3.3 Connection String
```
jdbc:mysql://mysql-lapgalaxy.mysql.database.azure.com:3306/lapgalaxy?useSSL=true&requireSSL=true
```

---

## Step 4: Container Apps Environment 🐳

### 4.1 Container Apps Environment හදන්න
1. Search: "Container Apps Environments" → **+ Create**
2. Details:
   - **Resource Group**: `rg-lapgalaxy`
   - **Environment name**: `lapgalaxy-env`
   - **Region**: `East US`
   - **Zone redundancy**: Disabled (cost save)
3. **Review + Create** → **Create**

---

## Step 5: Azure Static Web App (Frontend) 🌐

### 5.1 Static Web App හදන්න
1. Search: "Static Web Apps" → **+ Create**
2. Details:
   - **Resource Group**: `rg-lapgalaxy`
   - **Name**: `lapgalaxy-frontend`
   - **Plan type**: `Free`
   - **Region**: `East US 2`
   - **Source**: `GitHub`
3. GitHub එක connect කරන්න:
   - Organization: (ඔයාගේ username)
   - Repository: `lap_galaxy`
   - Branch: `main`
4. Build Details:
   - **Build Presets**: `React`
   - **App location**: `/frontend`
   - **Api location**: (empty)
   - **Output location**: `dist`
5. **Review + Create** → **Create**

### 5.2 API Token එක ගන්න
1. Static Web App resource එකට ගිහින් **Settings** → **Manage deployment token**
2. Token එක copy කරන්න (GitHub secret එකට ඕන)

---

## Step 6: GitHub Secrets 🔑

GitHub Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value |
|-------------|-------|
| `AZURE_CREDENTIALS` | Service Principal JSON (Step 6.1 බලන්න) |
| `AZURE_REGISTRY_LOGIN_SERVER` | `acrlapgalaxyshehan.azurecr.io` |
| `AZURE_REGISTRY_USERNAME` | `acrlapgalaxyshehan` |
| `AZURE_REGISTRY_PASSWORD` | (ACR password) |
| `AZURE_RESOURCE_GROUP` | `rg-lapgalaxy` |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | (Static Web App deployment token) |
| `AZURE_BACKEND_URL` | `https://lapgalaxy-backend.<random>.eastus.azurecontainerapps.io/api` |
| `DB_URL` | `jdbc:mysql://mysql-lapgalaxy.mysql.database.azure.com:3306/lapgalaxy?useSSL=true` |
| `DB_USERNAME` | `lapgalaxyadmin` |
| `DB_PASSWORD` | (MySQL password) |

### 6.1 AZURE_CREDENTIALS හදන්න

**Option A: Azure CLI (Local PC එකේ)**
```bash
# Azure CLI install කරන්න (Windows)
winget install Microsoft.AzureCLI

# Login වෙන්න
az login

# Service Principal හදන්න
az ad sp create-for-rbac --name "lapgalaxy-github-deploy" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/rg-lapgalaxy \
  --sdk-auth
```

**Option B: Azure Cloud Shell (Portal එකේ)**
1. Portal එකේ top bar එකේ `>_` icon එක click කරන්න
2. Bash select කරන්න
3. ඉහත command එක run කරන්න

Output JSON එක සම්පූර්ණයෙන්ම copy කරලා `AZURE_CREDENTIALS` secret එකට paste කරන්න.

---

## Step 7: Container App Secrets 🔐

Azure Portal → Container Apps → lapgalaxy-backend → **Settings** → **Secrets**

මේ secrets add කරන්න:
- `db-url`: (DB_URL value)
- `db-username`: (DB_USERNAME value)  
- `db-password`: (DB_PASSWORD value)
- `jwt-secret`: (random long string)

---

## Step 8: Deploy! 🎉

### 8.1 Backend Deploy
```bash
git add .
git commit -m "Deploy backend to Azure"
git push
```
`backend/` folder එකේ changes detect වුනොත් auto deploy වෙනවා.

### 8.2 Frontend Deploy
Frontend changes detect වුනොත් Static Web App auto deploy වෙනවා.

---

## Step 9: Access Your App 🌐

- **Frontend**: `https://lapgalaxy-frontend.azurestaticapps.net`
- **Backend API**: `https://lapgalaxy-backend.<random>.eastus.azurecontainerapps.io/api`

---

## Useful Azure CLI Commands 📋

```bash
# Container App logs බලන්න
az containerapp logs show -n lapgalaxy-backend -g rg-lapgalaxy --follow

# Container App restart කරන්න
az containerapp revision restart -n lapgalaxy-backend -g rg-lapgalaxy

# Scale settings
az containerapp update -n lapgalaxy-backend -g rg-lapgalaxy --min-replicas 0 --max-replicas 3

# Environment variables update
az containerapp update -n lapgalaxy-backend -g rg-lapgalaxy --set-env-vars "KEY=VALUE"
```

---

## Cost Breakdown (Student/Free Tier) 💰

| Service | Cost |
|---------|------|
| Static Web Apps | **FREE** |
| Container Apps (Scale to 0) | ~$0-5/month |
| ACR Basic | ~$5/month |
| MySQL Flexible B1ms | ~$15/month (Student credit එකෙන්) |
| **Total** | **~$20-25/month** (mostly covered by Student credits) |

---

## Architecture Diagram 📊

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                               │
│                                                                  │
│  ┌────────────────────┐         ┌────────────────────────────┐  │
│  │  Static Web Apps   │         │    Container Apps Env      │  │
│  │    (Frontend)      │         │                            │  │
│  │                    │  API    │  ┌──────────────────────┐  │  │
│  │   React + Vite     │◄───────►│  │  lapgalaxy-backend   │  │  │
│  │   FREE HTTPS       │         │  │   (Spring Boot)      │  │  │
│  │                    │         │  │   Port: 8080         │  │  │
│  └────────────────────┘         │  └──────────┬───────────┘  │  │
│                                 │             │              │  │
│                                 └─────────────┼──────────────┘  │
│                                               │                 │
│  ┌────────────────────┐         ┌─────────────▼──────────────┐  │
│  │ Container Registry │         │   MySQL Flexible Server    │  │
│  │      (ACR)         │         │      (Managed DB)          │  │
│  │   Docker Images    │         │      Port: 3306            │  │
│  └────────────────────┘         └────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting 🔧

### Backend deploy fail?
```bash
# Logs check කරන්න
az containerapp logs show -n lapgalaxy-backend -g rg-lapgalaxy --tail 100
```

### Database connection error?
1. MySQL server එකේ Networking settings check කරන්න
2. Firewall rules check කරන්න
3. SSL settings check කරන්න

### Frontend not updating?
1. GitHub Actions tab එකේ workflow run වුණාද check කරන්න
2. Static Web App deployment tab එකේ status check කරන්න

---

**Happy Deploying to Azure! ☁️🚀**
