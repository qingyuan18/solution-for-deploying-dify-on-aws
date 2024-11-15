# solution-for-deploying-dify-on-aws

This solution demostrates how to deploy community version of dify on AWS using CDK.
It also provide a solution for deploying langfuse as a plugin of dify for tracing and monitoring.

It utilized AWS managed services including ALB, EKS, Aurora PostgreSQL, Opensearch, and S3.
All the services deployed using Graviton processors to take maximum advantage of AWS cost optimization.

The default configuration is only for test purpose, please update the corresponding values in cdk.json for production use.
Also, please consider to purchase dify enterprise version for production use in AWS marketplace.

![Deployment Architecture](https://github.com/aws-samples/solution-for-deploying-dify-on-aws/blob/main/doc/deployment_architecture.png?raw=true)

## Install from CDK

0.Prepare the CDK enviroment
```bash
sudo dnf install nodejs git -y
sudo npm install -g aws-cdk 
sudo npm install -g typescript ts-node
```

Configure AWS CLI
```bash
aws configure
```

Download cdk code
```bash
git clone https://github.com/aws-samples/solution-for-deploying-dify-on-aws.git
cd dify_helm/dify-cdk/
npm install
```

1.Deploy dify and langfuse

Configure cdk.json for dify
```json
    "dbPassword": "Your.dbPassword.0910",
    "opensearchPassword": "Your.aosPassword.0910",
    "S3AccessKey": "Your.S3.AccessKey",
    "S3SecretKey": "Your.S3.SecretKey",
```
[Optional] Configure cdk.json for langfuse
```json
    "nextAuthSecret":"openssl rand -base64 32",
    "salt":"openssl rand -base64 32",
```

2.Configure cdk environment, only need to run once
```bash
cdk synth
cdk bootstrap
```

3.Deploy CDK
```bash
cdk deploy --all --concurrency 5 --require-approval never
```
Please use concurrency deployment, the whole deployment process takes about 20 minutes, if not using concurrency, it will take extra time.

4.Configure helm environment variables
Edit dify-helm-stack.ts in lib directory
If you don't have your own domain, please configure the two host variables in the file to be the DNS name of the ALB created by CDK, such as:
```ts
    const difyHelm = new eks.HelmChart(this, 'DifyHelmChart', {
      cluster: props.cluster,
      chart: 'dify',
      repository: 'https://douban.github.io/charts/',
      release: 'dify',
      namespace: 'default',
      values: {
        global: {
          //Specify your host on ALB DNS name
          host: 'k8s-default-dify-324ef51b8a-687325639.us-east-1.elb.amazonaws.com',
```
```ts
        ingress: {
          enabled: true,
          className: 'alb',
          annotations: {
            'kubernetes.io/ingress.class': 'alb',
            'alb.ingress.kubernetes.io/scheme': 'internet-facing',
            'alb.ingress.kubernetes.io/target-type': 'ip',
            'alb.ingress.kubernetes.io/listen-ports': '[{"HTTP": 80}]',
            //'alb.ingress.kubernetes.io/listen-ports': '[{"HTTPS": 443}]',
            //'alb.ingress.kubernetes.io/certificate-arn': 'arn:aws:acm:ap-southeast-1:788668107894:certificate/6404aaf8-6051-4637-8d93-d948932b18b6',
          },
          hosts: [{
            host: 'k8s-default-dify-324ef51b8a-687325639.us-east-1.elb.amazonaws.com',
```

If you have your own domain, please configure your domain, and open tls, and configure your certificate ARN to 'alb.ingress.kubernetes.io/certificate-arn'.


Other environment variables injection, please refer to 
https://docs.dify.ai/v/zh-hans/getting-started/install-self-hosted/environments

5.dify database initialization
Please find a terminal that can connect to EKS, and run
```bash
kubectl exec -it $(kubectl get pods -n dify -l app.kubernetes.io/component=api -o jsonpath='{.items[0].metadata.name}') -n dify -- flask db upgrade
```

After execution, you can access dify using http://ALBDNSName, and register as an administrator.

Finally
Happy dify with AWS

About upgrade:
dify community version is very active, please update the tag variable in dify-helm-stack.ts for upgrade.
And then run cdk deploy and database initialization again.
```ts
        global: {
          host: '',
          port: '',
          enableTLS: false,
          image: { tag: '0.11.1' },
          edition: 'SELF_HOSTED',
          storageType: 's3',
          extraEnvs: [],
          extraBackendEnvs: [
```
After upgrade, please run step5 again for database initialization.
