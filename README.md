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

Links
	•	CloudFront URL: https://ddmswlyuv30b2.cloudfront.net
	•	S3 Bucket Name: deploywebappstack-deploymentfrontendbucket67ceb713-baqkestilsbo
