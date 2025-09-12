import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  CfnOutput, RemovalPolicy, Duration,
} from 'aws-cdk-lib';

import { Construct } from 'constructs';

const assetsPath = './resources/build';

export class DeploymentService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'FrontendBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,   // для учебы
      autoDeleteObjects: true,                // для учебы
    });

    const dist = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        compress: true,
      },
      defaultRootObject: 'index.html',
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
        ttl: Duration.seconds(0),
      }],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    });

    new s3deploy.BucketDeployment(this, 'Deploy', {
      sources: [s3deploy.Source.asset(assetsPath)],
      destinationBucket: bucket,
      distribution: dist,
      distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'CloudFrontURL', { value: dist.domainName, description: 'CloudFront domain' });
    new CfnOutput(this, 'BucketName',   { value: bucket.bucketName, description: 'S3 bucket name' });
  }
}