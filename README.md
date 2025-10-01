# My Store App

## Features
- Product catalog with real backend integration (AWS Lambda + DynamoDB)
- Add to cart, checkout, and order management
- Admin panel for product management
- Modern UI with Material-UI
- Automated deployment to S3 + CloudFront (CDK)

## Backend API
- GET /products — list all products (with stock count)
- GET /products/{productId} — get product by ID
- POST /products — create new product

API base: https://b5x9a7w5n8.execute-api.eu-central-1.amazonaws.com/prod

## How to run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file:
   ```env
   VITE_API_BASE=https://b5x9a7w5n8.execute-api.eu-central-1.amazonaws.com/prod
   ```
3. Start dev server:
   ```bash
   npm run start
   ```

## What was done?

- Created **S3 bucket** and uploaded frontend build  
- Configured **CloudFront distribution** with OAC  
- Connected S3 bucket and CloudFront  
- Automated deployment with **AWS CDK** (`cdk deploy`)  
- Implemented **CloudFront invalidation** on redeploy  

## How to deploy

1. **Build frontend app**  

```bash
npm run build
```

2.	Copy build output into infra/resources/build
```bash
cp -r dist/* infra/resources/build/
```

3.	Deploy with CDK
```bash
cd infra
AWS_PROFILE=course cdk deploy
```

4.	After deploy you will see outputs:
```bash
DeployWebAppStack.deploymentBucketNameA59FA865 = <bucket-name>
DeployWebAppStack.deploymentCloudFrontURL05BF422F = <cloudfront-url>
```

Open https://ddmswlyuv30b2.cloudfront.net in browser – the app is available globally.

## Useful links
- CloudFront: https://ddmswlyuv30b2.cloudfront.net/
- API: https://b5x9a7w5n8.execute-api.eu-central-1.amazonaws.com/prod/products
- S3 bucket: deploywebappstack-deploymentfrontendbucket67ceb713-baqkestilsbo

---

**Author:** Nika Beridze
