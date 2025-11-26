# Frontend S3 Bucket Setup Guide

## Prerequisites
- AWS Account
- AWS CLI installed and configured
- Your frontend built files ready (React build output)

## Step 1: Install AWS CLI (if not installed)

### Windows:
```powershell
# Download and install AWS CLI
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

### Linux/Mac:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

## Step 2: Configure AWS CLI

```bash
aws configure
```

Enter your credentials:
```
AWS Access Key ID: YOUR_ACCESS_KEY
AWS Secret Access Key: YOUR_SECRET_KEY
Default region name: us-east-1
Default output format: json
```

## Step 3: Create S3 Bucket

### Option A: Using AWS CLI (Recommended)

```bash
# Create bucket (bucket names must be globally unique)
aws s3 mb s3://lapgalaxy-frontend --region us-east-1

# Or with your custom name
aws s3 mb s3://your-unique-bucket-name --region us-east-1
```

### Option B: Using AWS Console

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **"Create bucket"**
3. **Bucket name**: `lapgalaxy-frontend` (must be globally unique)
4. **AWS Region**: `us-east-1` (or your preferred region)
5. **Block Public Access settings**: 
   - ⚠️ **UNCHECK** "Block all public access"
   - Check the acknowledgment box
6. Click **"Create bucket"**

## Step 4: Enable Static Website Hosting

### Using AWS CLI:
```bash
aws s3 website s3://lapgalaxy-frontend \
  --index-document index.html \
  --error-document index.html
```

### Using AWS Console:
1. Click on your bucket name
2. Go to **Properties** tab
3. Scroll to **Static website hosting**
4. Click **Edit**
5. Select **Enable**
6. **Index document**: `index.html`
7. **Error document**: `index.html` (important for React Router)
8. Click **Save changes**
9. Note the **Bucket website endpoint** URL

## Step 5: Set Bucket Policy for Public Access

### Create `bucket-policy.json`:
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

### Apply policy using AWS CLI:
```bash
aws s3api put-bucket-policy \
  --bucket lapgalaxy-frontend \
  --policy file://bucket-policy.json
```

### Or via AWS Console:
1. Go to **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste the JSON policy (replace `lapgalaxy-frontend` with your bucket name)
5. Click **Save changes**

## Step 6: Configure CORS (if needed)

If your frontend makes API calls to a different domain:

### Create `cors-config.json`:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

### Apply CORS:
```bash
aws s3api put-bucket-cors \
  --bucket lapgalaxy-frontend \
  --cors-configuration file://cors-config.json
```

## Step 7: Build and Deploy Frontend

### Manual Deployment:

```bash
# Navigate to frontend directory
cd frontend

# Build production bundle
npm run build

# Upload to S3
aws s3 sync dist/ s3://lapgalaxy-frontend --delete --acl public-read

# Or with specific files
aws s3 cp dist/ s3://lapgalaxy-frontend/ --recursive --acl public-read
```

### Test Your Deployment:
Your site will be available at:
```
http://lapgalaxy-frontend.s3-website-us-east-1.amazonaws.com
```

## Step 8: Set Up CloudFront (Optional - Recommended for Production)

CloudFront provides:
- HTTPS support
- Global CDN (faster loading)
- Custom domain names
- Better security

### Using AWS CLI:

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name lapgalaxy-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### Using AWS Console:

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create Distribution**
3. **Origin domain**: Select your S3 bucket from dropdown
4. **Origin access**: **Origin access control settings (recommended)**
   - Click **Create control setting**
   - Use default settings
5. **Default root object**: `index.html`
6. **Viewer protocol policy**: Redirect HTTP to HTTPS
7. **Allowed HTTP methods**: GET, HEAD, OPTIONS
8. **Cache policy**: CachingOptimized
9. Click **Create distribution**
10. Wait 10-15 minutes for deployment
11. Note your **Distribution domain name** (e.g., `d1234abcd.cloudfront.net`)
12. Copy the **Distribution ID** (needed for GitHub Secrets)

### Update S3 Bucket Policy for CloudFront:

After creating CloudFront OAC, update your S3 bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lapgalaxy-frontend/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

### Configure Custom Error Pages (for React Router):

In CloudFront distribution settings:
1. Go to **Error pages** tab
2. Click **Create custom error response**
3. **HTTP error code**: 403
4. **Customize error response**: Yes
5. **Response page path**: `/index.html`
6. **HTTP Response Code**: 200
7. Click **Create**
8. Repeat for error code 404

## Step 9: Set Up Custom Domain (Optional)

### Prerequisites:
- Domain registered (Route 53, GoDaddy, Namecheap, etc.)
- SSL certificate in AWS Certificate Manager (ACM)

### Steps:

1. **Request SSL Certificate** (ACM - must be in us-east-1 for CloudFront):
```bash
aws acm request-certificate \
  --domain-name lapgalaxy.com \
  --subject-alternative-names www.lapgalaxy.com \
  --validation-method DNS \
  --region us-east-1
```

2. **Validate certificate** via DNS (add CNAME records)

3. **Update CloudFront distribution**:
   - Add alternate domain names (CNAMEs): `lapgalaxy.com`, `www.lapgalaxy.com`
   - Select your SSL certificate

4. **Create Route 53 records** (or update your DNS provider):
```bash
# Create A record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR-HOSTED-ZONE-ID \
  --change-batch file://route53-changes.json
```

**route53-changes.json:**
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "lapgalaxy.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d1234abcd.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
```

## Step 10: Add to GitHub Secrets

Go to: **GitHub → Settings → Secrets and variables → Actions → New repository secret**

Add:
- **Name**: `S3_BUCKET_NAME`
- **Value**: `lapgalaxy-frontend`

If using CloudFront:
- **Name**: `CLOUDFRONT_DISTRIBUTION_ID`
- **Value**: Your distribution ID (e.g., `E1234ABCD5678`)

## Step 11: Test Automatic Deployment

```bash
# Make a change to frontend
cd frontend/src
echo "// Test change" >> App.jsx

# Commit and push
git add .
git commit -m "Test frontend deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build your React app
2. Deploy to S3
3. Invalidate CloudFront cache (if configured)

## Verification Checklist

- [ ] S3 bucket created and configured
- [ ] Static website hosting enabled
- [ ] Bucket policy allows public read
- [ ] Frontend builds locally (`npm run build`)
- [ ] Files uploaded to S3
- [ ] Website accessible via S3 endpoint
- [ ] CloudFront distribution created (if using)
- [ ] Custom domain configured (if using)
- [ ] GitHub Secrets added
- [ ] CI/CD pipeline tested

## Useful Commands

### View bucket contents:
```bash
aws s3 ls s3://lapgalaxy-frontend
```

### Sync local files to S3:
```bash
aws s3 sync dist/ s3://lapgalaxy-frontend --delete
```

### Delete all files:
```bash
aws s3 rm s3://lapgalaxy-frontend --recursive
```

### Get bucket website URL:
```bash
aws s3api get-bucket-website --bucket lapgalaxy-frontend
```

### Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234ABCD5678 \
  --paths "/*"
```

## Troubleshooting

### 403 Forbidden Error:
- Check bucket policy is correctly applied
- Verify "Block public access" is turned off
- Ensure files have public-read ACL

### 404 Not Found for Routes:
- Set error document to `index.html` in S3 static website hosting
- Configure CloudFront custom error responses (403 and 404 → /index.html)

### Slow Loading:
- Use CloudFront CDN
- Enable gzip compression in CloudFront
- Optimize React bundle size

### CORS Errors:
- Configure CORS in S3 bucket settings
- Add proper headers in CloudFront

## Cost Estimation

### AWS Free Tier (First 12 months):
- **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests
- **CloudFront**: 50GB data transfer out, 2,000,000 HTTP requests

### After Free Tier:
- **S3 Storage**: ~$0.023/GB/month
- **S3 Requests**: ~$0.0004 per 1,000 requests
- **CloudFront**: ~$0.085/GB data transfer
- **Total for small site**: $1-5/month

## Security Best Practices

1. Enable **S3 bucket versioning** for rollback capability
2. Enable **S3 bucket logging** to track access
3. Use **CloudFront** with HTTPS only
4. Enable **AWS WAF** for DDoS protection (optional)
5. Set up **CloudWatch alarms** for unusual traffic
6. Use **IAM roles** with least privilege
7. Enable **MFA Delete** for production buckets

## Next Steps

1. ✅ Create S3 bucket
2. ✅ Configure static website hosting
3. ✅ Set bucket policy
4. ✅ Test manual deployment
5. ✅ Set up CloudFront (recommended)
6. ✅ Configure custom domain (optional)
7. ✅ Add GitHub Secrets
8. ✅ Test CI/CD pipeline

Your frontend will be live at:
- **S3 Direct**: `http://lapgalaxy-frontend.s3-website-us-east-1.amazonaws.com`
- **CloudFront**: `https://d1234abcd.cloudfront.net`
- **Custom Domain**: `https://lapgalaxy.com` (if configured)

🎉 **Congratulations!** Your frontend is now deployed on AWS S3 with automatic CI/CD!
