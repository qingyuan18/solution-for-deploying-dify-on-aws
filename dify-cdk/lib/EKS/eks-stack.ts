有什么可以帮你的吗
{
"app": "npx ts-node --prefer-ts-exts bin/dify.ts",
"watch": {
"include": [
""
],
"exclude": [
"README.md",
"cdk*.json",
"/.d.ts",
"**/.js",
"tsconfig.json",
"package*.json",
"yarn.lock",
"node_modules",
"test"
]
},
"context": {
"dbPassword": "awsAWS09100910!",
"opensearchPassword": "awsAWS09100910!",
"S3AccessKey": "Your S3AccessKey",
"S3SecretKey": "Your S3SecretKey",
"difySecretKey":"J5SNSa8Cx6auHbNwoKM3mHV2cTGoauoza9zJ93WwCwtl0w/RDgY0dPeV",
"nextAuthSecret":"Kxg/iQevwQKRwtY9HhVo1mi8nPilYOJeyxngqPVYtuI=",
"salt":"SVMSi70+mrWLJU41NaXCBH8fa0GOvtt0TdjbFTUuTIk=",
"@aws-cdk/aws-lambda:recognizeLayerVersion": true,
"@aws-cdk/core:checkSecretUsage": true,
"@aws-cdk/core:target-partitions": [
"aws",
"aws-cn"
],
"@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver": true,
"@aws-cdk/aws-ec2:uniqueImdsv2TemplateName": true,
"@aws-cdk/aws-ecs:arnFormatIncludesClusterName": true,
"@aws-cdk/aws-iam:minimizePolicies": true,
"@aws-cdk/core:validateSnapshotRemovalPolicy": true,
"@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName": true,
"@aws-cdk/aws-s3:createDefaultLoggingPolicy": true,
"@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption": true,
"@aws-cdk/aws-apigateway:disableCloudWatchRole": true,
"@aws-cdk/core:enablePartitionLiterals": true,
"@aws-cdk/aws-events:eventsTargetQueueSameAccount": true,
"@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker": true,
"@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName": true,
"@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true,
"@aws-cdk/aws-route53-patters:useCertificate": true,
"@aws-cdk/customresources:installLatestAwsSdkDefault": false,
"@aws-cdk/aws-rds:databaseProxyUniqueResourceName": true,
"@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup": true,
"@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId": true,
"@aws-cdk/aws-ec2:launchTemplateDefaultUserData": true,
"@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments": true,
"@aws-cdk/aws-redshift:columnId": true,
"@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2": true,
"@aws-cdk/aws-ec2:restrictDefaultSecurityGroup": true,
"@aws-cdk/aws-apigateway:requestValidatorUniqueId": true,
"@aws-cdk/aws-kms:aliasNameRef": true,
"@aws-cdk/aws-autoscaling:generateLaunchTemplateInsteadOfLaunchConfig": true,
"@aws-cdk/core:includePrefixInUniqueNameGeneration": true,
"@aws-cdk/aws-efs:denyAnonymousAccess": true,
"@aws-cdk/aws-opensearchservice:enableOpensearchMultiAzWithStandby": true,
"@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion": true,
"@aws-cdk/aws-efs:mountTargetOrderInsensitiveLogicalId": true,
"@aws-cdk/aws-rds:auroraClusterChangeScopeOfInstanceParameterGroupWithEachParameters": true,
"@aws-cdk/aws-appsync:useArnForSourceApiAssociationIdentifier": true,
"@aws-cdk/aws-rds:preventRenderingDeprecatedCredentials": true,
"@aws-cdk/aws-codepipeline-actions:useNewDefaultBranchForCodeCommitSource": true,
"@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction": true,
"@aws-cdk/aws-codepipeline:crossAccountKeysDefaultValueToFalse": true,
"@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2": true,
"@aws-cdk/aws-kms:reduceCrossAccountRegionPolicyScope": true,
"@aws-cdk/aws-eks:nodegroupNameAttribute": true,
"@aws-cdk/aws-ec2:ebsDefaultGp3Volume": true,
"@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm": true,
"@aws-cdk/custom-resources:logApiResponseDataPropertyTrueDefault": false,
"@aws-cdk/aws-s3:keepNotificationInImportedBucket": false
}
}

帮我修改上面aws cdk的config，使得cdk deploy的时候，如果已经有指定对应的VPC，aos，rds等资源，则不用再重复创建
要实现复用已存在的资源，你需要在 context 中添加相关资源的标识符。以下是修改后的配置示例：

{
  "app": "npx ts-node --prefer-ts-exts bin/dify.ts",
  "watch": {
    // ... (保持不变)
  },
  "context": {
    // 已有资源的标识符
    "existingResources": {
      "vpcId": "vpc-xxxxxxxx", // 替换为已存在的 VPC ID
      "rdsInstance": "arn:aws:rds:region:account:db:instance-name", // 替换为已存在的 RDS ARN
      "opensearchDomain": "arn:aws:opensearch:region:account:domain/domain-name", // 替换为已存在的 OpenSearch ARN
      "subnetIds": [ // 替换为已存在的子网 IDs
        "subnet-xxxxxxxx",
        "subnet-yyyyyyyy"
      ],
      "securityGroups": [ // 替换为已存在的安全组 IDs
        "sg-xxxxxxxx"
      ]
    },
    // 其他配置保持不变
    "dbPassword": "awsAWS09100910!",
    "opensearchPassword": "awsAWS09100910!",
    "S3AccessKey": "Your S3AccessKey",
    "S3SecretKey": "Your S3SecretKey",
    "difySecretKey": "J5SNSa8Cx6auHbNwoKM3mHV2cTGoauoza9zJ93WwCwtl0w/RDgY0dPeV",
    "nextAuthSecret": "Kxg/iQevwQKRwtY9HhVo1mi8nPilYOJeyxngqPVYtuI=",
    "salt": "SVMSi70+mrWLJU41NaXCBH8fa0GOvtt0TdjbFTUuTIk=",
    // ... (其余配置保持不变)
  }
}
然后在你的 CDK 代码中，你需要使用 fromXXX 方法来引用现有资源，而不是创建新的。例如：

// 在你的 Stack 代码中：

// 引用现有 VPC
const existingVpcId = this.node.tryGetContext('existingResources').vpcId;
const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
  vpcId: existingVpcId
});

// 引用现有 RDS 实例
const existingRdsArn = this.node.tryGetContext('existingResources').rdsInstance;
const database = rds.DatabaseInstance.fromDatabaseInstanceAttributes(this, 'ExistingRDS', {
  instanceIdentifier: existingRdsArn,
  instanceEndpointAddress: '...', // 需要提供端点地址
  port: 3306, // 需要提供端口
  securityGroups: [...] // 需要提供安全组
});

// 引用现有 OpenSearch 域
const existingOpenSearchArn = this.node.tryGetContext('existingResources').opensearchDomain;
const opensearch = opensearch.Domain.fromDomainAttributes(this, 'ExistingOpenSearch', {
  domainArn: existingOpenSearchArn,
  domainEndpoint: '...', // 需要提供端点
});
记住要：

填入正确的资源标识符（ID、ARN 等）
确保这些资源在同一个区域和账户中
确保你的 IAM 角色有权限访问这些资源
修改你的 CDK 代码以使用 fromXXX 方法而不是创建新资源
这样配置后，CDK 将会使用已存在的资源而不是创建新的资源。如果某个资源的标识符没有提供，则会创建新的资源。
“existingResources”：{}我传空的可以么？
是的,你可以传空的 "existingResources"。这样的话 CDK 会按照默认行为创建所有需要的资源。

{
  "app": "npx ts-node --prefer-ts-exts bin/dify.ts",
  "watch": {
    // ... (保持不变)
  },
  "context": {
    "existingResources": {}, // 空对象意味着将创建所有新资源
    "dbPassword": "awsAWS09100910!",
    // ... (其他配置保持不变)
  }
}
在你的 CDK 代码中,你可以这样检查:

const existingResources = this.node.tryGetContext('existingResources') || {};

// 检查是否有现有 VPC
if (existingResources.vpcId) {
  // 使用现有 VPC
  vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
    vpcId: existingResources.vpcId
  });
} else {
  // 创建新的 VPC
  vpc = new ec2.Vpc(this, 'NewVPC', {
    // ... VPC 配置
  });
}

// 类似的模式可以应用到其他资源
这种方式可以让你的代码更灵活,既可以创建新资源,也可以复用现有资源。当 "existingResources" 为空对象时,所有资源都会被重新创建。
给我一个安装cdk opensearch插件的命令
要安装 AWS CDK OpenSearch 模块，你可以使用以下 npm 命令：

npm install @aws-cdk/aws-opensearchservice
如果你使用的是 CDK v2，应该使用：

npm install aws-cdk-lib
CDK v2 已经包含了 OpenSearch 模块，你可以这样导入：

import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
注意：推荐使用 CDK v2，因为 v1 已经进入维护模式。如果你还在使用 v1，建议升级到 v2。
{
"app": "npx ts-node --prefer-ts-exts bin/dify.ts",
"watch": {
// ... (保持不变)
},
"context": {
// 已有资源的标识符
"existingResources": {
"vpcId": "vpc-xxxxxxxx", // 替换为已存在的 VPC ID
"rdsInstance": "arn:aws:rds:region:account:db:instance-name", // 替换为已存在的 RDS ARN
"opensearchDomain": "arn:aws:opensearch:region:account:domain/domain-name", // 替换为已存在的 OpenSearch ARN
"subnetIds": [ // 替换为已存在的子网 IDs
"subnet-xxxxxxxx",
"subnet-yyyyyyyy"
],
"securityGroups": [ // 替换为已存在的安全组 IDs
"sg-xxxxxxxx"
]
},
// 其他配置保持不变
"dbPassword": "awsAWS09100910!",
"opensearchPassword": "awsAWS09100910!",
"S3AccessKey": "Your S3AccessKey",
"S3SecretKey": "Your S3SecretKey",
"difySecretKey": "J5SNSa8Cx6auHbNwoKM3mHV2cTGoauoza9zJ93WwCwtl0w/RDgY0dPeV",
"nextAuthSecret": "Kxg/iQevwQKRwtY9HhVo1mi8nPilYOJeyxngqPVYtuI=",
"salt": "SVMSi70+mrWLJU41NaXCBH8fa0GOvtt0TdjbFTUuTIk=",
// ... (其余配置保持不变)
}
}
这里还需要添加已经有的eks集群
是的,你可以在 existingResources 中添加已有的 EKS 集群信息,像这样:

{
  "app": "npx ts-node --prefer-ts-exts bin/dify.ts",
  "watch": {
    // ... (保持不变)
  },
  "context": {
    "existingResources": {
      "vpcId": "vpc-xxxxxxxx",
      "rdsInstance": "arn:aws:rds:region:account:db:instance-name",
      "opensearchDomain": "arn:aws:opensearch:region:account:domain/domain-name",
      "subnetIds": [
        "subnet-xxxxxxxx",
        "subnet-yyyyyyyy"
      ],
      "securityGroups": [
        "sg-xxxxxxxx"
      ],
      "eksCluster": {
        "clusterName": "your-existing-cluster-name",
        "clusterArn": "arn:aws:eks:region:account:cluster/your-cluster-name",
        "openIdConnectProviderArn": "arn:aws:iam::account:oidc-provider/oidc.eks.region.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE"
      }
    },
    "dbPassword": "awsAWS09100910!",
    // ... (其他配置保持不变)
  }
}
在 eksCluster 对象中:

clusterName: EKS 集群的名称
clusterArn: EKS 集群的 ARN
openIdConnectProviderArn: EKS 集群的 OIDC provider ARN (用于 IAM 角色设置)
这些信息可以从 AWS Console 或使用 AWS CLI 获取:

# 获取集群信息
aws eks describe-cluster --name your-cluster-name

# 获取 OIDC provider ARN
aws eks describe-cluster --name your-cluster-name --query "cluster.identity.oidc.issuer" --output text
import * as cdk from 'aws-cdk-lib';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface OpenSearchStackProps extends cdk.StackProps {
vpc: cdk.aws_ec2.Vpc;
subnets: cdk.aws_ec2.SelectedSubnets;
domainName: string;
}

export class OpenSearchStack extends cdk.Stack {
public readonly openSearchDomain: opensearch.Domain;

constructor(scope: Construct, id: string, props: OpenSearchStackProps) {
super(scope, id, props);

// Retrieve the password from context
const masterUserPassword = this.node.tryGetContext('opensearchPassword');
if (!masterUserPassword) {
  throw new Error("Context variable 'opensearchPassword' is missing");
}

const openSearchSecurityGroup = new cdk.aws_ec2.SecurityGroup(this, 'OpenSearchSecurityGroup', {
  vpc: props.vpc,
  description: 'Security group for Amazon OpenSearch Service',
  allowAllOutbound: true,
});

openSearchSecurityGroup.addIngressRule(
  ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
  ec2.Port.tcp(443),
  'Allow HTTPS connections from within the VPC'
);

// 添加对 9200 端口的入站规则
openSearchSecurityGroup.addIngressRule(
  ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
  ec2.Port.tcp(9200),
  'Allow HTTP connections on port 9200 from within the VPC'
);

this.openSearchDomain = new opensearch.Domain(this, 'Domain', {
  version: opensearch.EngineVersion.OPENSEARCH_2_13,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  domainName: props.domainName,
  capacity: {
    multiAzWithStandbyEnabled: false,
    masterNodes: 3,
    masterNodeInstanceType: 'r6g.large.search',
    dataNodes: 2,
    dataNodeInstanceType: 'r6g.large.search',
  },
  ebs: {
    volumeSize: 10,
    volumeType: ec2.EbsDeviceVolumeType.GP3,
  },
  zoneAwareness: {
    enabled: true,
  },
  nodeToNodeEncryption: true,
  enforceHttps: true,
  encryptionAtRest: {
    enabled: true,
  },
  fineGrainedAccessControl: {
    masterUserName: 'admin',
    masterUserPassword: cdk.SecretValue.unsafePlainText(masterUserPassword),
  },
  vpc: props.vpc,
  securityGroups: [openSearchSecurityGroup],

  accessPolicies: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AnyPrincipal()], 
      actions: ['es:*'],  
      resources: [`arn:aws:es:${this.region}:${this.account}:domain/${props.domainName}/*`],
    }),
  ],
});

// Outputs
new cdk.CfnOutput(this, 'OpenSearchDomainEndpoint', {
  value: this.openSearchDomain.domainEndpoint,
  description: 'OpenSearch Domain Endpoint',
  exportName: 'OpenSearchDomainEndpoint',
});
}
}

修改上面的脚本，如果刚才的cdk.json里面已经提供了exsiting的aos的集群配置，则在该集群基础上进行操作
以下是修改后的脚本，它会检查是否存在现有的 OpenSearch 域，如果存在则使用它，否则创建新的：

import * as cdk from 'aws-cdk-lib';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface OpenSearchStackProps extends cdk.StackProps {
  vpc: cdk.aws_ec2.Vpc;
  subnets: cdk.aws_ec2.SelectedSubnets;
  domainName: string;
}

export class OpenSearchStack extends cdk.Stack {
  public readonly openSearchDomain: opensearch.IDomain;

  constructor(scope: Construct, id: string, props: OpenSearchStackProps) {
    super(scope, id, props);

    // 检查是否存在现有的 OpenSearch 域
    const existingResources = this.node.tryGetContext('existingResources');
    const existingOpenSearchArn = existingResources?.opensearchDomain;

    if (existingOpenSearchArn) {
      // 如果存在现有的 OpenSearch 域，则导入它
      this.openSearchDomain = opensearch.Domain.fromDomainAttributes(this, 'ExistingDomain', {
        domainArn: existingOpenSearchArn,
        domainEndpoint: this.extractDomainEndpoint(existingOpenSearchArn)
      });

      // 为现有域创建输出
      new cdk.CfnOutput(this, 'OpenSearchDomainEndpoint', {
        value: this.openSearchDomain.domainEndpoint,
        description: 'Existing OpenSearch Domain Endpoint',
        exportName: 'OpenSearchDomainEndpoint',
      });
    } else {
      // 如果不存在现有域，则创建新的
      const masterUserPassword = this.node.tryGetContext('opensearchPassword');
      if (!masterUserPassword) {
        throw new Error("Context variable 'opensearchPassword' is missing");
      }

      const openSearchSecurityGroup = new ec2.SecurityGroup(this, 'OpenSearchSecurityGroup', {
        vpc: props.vpc,
        description: 'Security group for Amazon OpenSearch Service',
        allowAllOutbound: true,
      });

      openSearchSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
        ec2.Port.tcp(443),
        'Allow HTTPS connections from within the VPC'
      );

      openSearchSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
        ec2.Port.tcp(9200),
        'Allow HTTP connections on port 9200 from within the VPC'
      );

      this.openSearchDomain = new opensearch.Domain(this, 'Domain', {
        version: opensearch.EngineVersion.OPENSEARCH_2_13,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        domainName: props.domainName,
        capacity: {
          multiAzWithStandbyEnabled: false,
          masterNodes: 3,
          masterNodeInstanceType: 'r6g.large.search',
          dataNodes: 2,
          dataNodeInstanceType: 'r6g.large.search',
        },
        ebs: {
          volumeSize: 10,
          volumeType: ec2.EbsDeviceVolumeType.GP3,
        },
        zoneAwareness: {
          enabled: true,
        },
        nodeToNodeEncryption: true,
        enforceHttps: true,
        encryptionAtRest: {
          enabled: true,
        },
        fineGrainedAccessControl: {
          masterUserName: 'admin',
          masterUserPassword: cdk.SecretValue.unsafePlainText(masterUserPassword),
        },
        vpc: props.vpc,
        securityGroups: [openSearchSecurityGroup],
        accessPolicies: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            actions: ['es:*'],
            resources: [`arn:aws:es:${this.region}:${this.account}:domain/${props.domainName}/*`],
          }),
        ],
      });

      // 为新域创建输出
      new cdk.CfnOutput(this, 'OpenSearchDomainEndpoint', {
        value: this.openSearchDomain.domainEndpoint,
        description: 'OpenSearch Domain Endpoint',
        exportName: 'OpenSearchDomainEndpoint',
      });
    }
  }

  private extractDomainEndpoint(domainArn: string): string {
    // 从 ARN 中提取域名
    const domainName = domainArn.split('/').pop() || '';
    const region = domainArn.split(':')[3];
    // 构造域端点
    return `https://${domainName}.${region}.es.amazonaws.com`;
  }
}
主要变更：

添加了对 existingResources 的检查，从 context 中获取现有的 OpenSearch 域 ARN。

如果存在现有域：

使用 Domain.fromDomainAttributes() 导入现有域
从 ARN 中提取并构造域端点
如果不存在现有域：

保持原有的创建新域的逻辑不变
添加了 extractDomainEndpoint 辅助方法来从 ARN 构造域端点

将 openSearchDomain 的类型改为 IDomain，这样可以同时支持新建和导入的域

使用这个修改后的脚本，如果在 cdk.json 中提供了现有的 OpenSearch 域 ARN，它将使用该现有域；如果没有提供，则会创建新的域。
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import {ALBCDeploymentStack} from './aws-load-balancer-controller';
import * as lambdaLayerKubectl from '@aws-cdk/lambda-layer-kubectl-v30'; // 引入 kubectl v30
import { Construct } from 'constructs';
import { getAvailableInstanceType } from './instance-type-checker';

interface EKSClusterStackProps extends cdk.StackProps {
vpc: ec2.Vpc;
subnets: ec2.SelectedSubnets;
}

export class EKSStack extends cdk.Stack {
public readonly cluster: eks.Cluster;

constructor(scope: Construct, id: string, props: EKSClusterStackProps) {
super(scope, id, props);

// EKS 控制平面安全组
const eksControlPlaneSecurityGroup = new ec2.SecurityGroup(this, 'EKSControlPlaneSG', {
  vpc: props.vpc,
  description: 'Cluster communication with worker nodes',
  allowAllOutbound: true,
});

eksControlPlaneSecurityGroup.addIngressRule(
  ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
  ec2.Port.allTraffic(),
  'Allow all traffic from within the VPC'
);

// EKS 集群角色
const eksClusterRole = new iam.Role(this, 'EKSClusterRole', {
  assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
  managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')],
});

// 创建 EKS 集群
this.cluster = new eks.Cluster(this, 'EKSCluster', {
  version: eks.KubernetesVersion.of(this.node.tryGetContext('EKSClusterVersion') || '1.31'),
  clusterName: 'dify-eks', 
  vpc: props.vpc,
  vpcSubnets: [props.subnets],
  securityGroup: eksControlPlaneSecurityGroup,
  role: eksClusterRole,
  endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
  defaultCapacity: 0, // 禁用默认节点组
  kubectlLayer: new lambdaLayerKubectl.KubectlV30Layer(this, 'KubectlLayer'), 
  authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
});

// 创建节点组 IAM 角色
const nodeGroupRole = new iam.Role(this, 'NodeGroupRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
  ],
});

const invokeSagemakerPolicy = new iam.PolicyStatement({
  actions: ['sagemaker:InvokeEndpoint'],
  resources: ['*'], 
});

nodeGroupRole.addToPolicy(invokeSagemakerPolicy);

// 异步获取可用的实例类型
(async () => {
  const nodeInstanceType = await getAvailableInstanceType();
  console.log(`EKS Using instance type: ${nodeInstanceType}`);

  this.cluster.addNodegroupCapacity('NodeGroup', {
    instanceTypes: [new ec2.InstanceType(nodeInstanceType)],
    minSize: this.node.tryGetContext('NodeGroupMinSize') || 3,
    desiredSize: this.node.tryGetContext('NodeGroupDesiredSize') || 3,
    maxSize: this.node.tryGetContext('NodeGroupMaxSize') || 10,
    nodeRole: nodeGroupRole,
  });
})();

// Deploy ALBC if it doesn't exist
const _ALBC = new ALBCDeploymentStack(this, 'ALBCDeploymentStack', {
  cluster: this.cluster,})

// 输出 EKS 集群相关信息
new cdk.CfnOutput(this, 'ClusterName', {
  value: this.cluster.clusterName,
  exportName: 'EKSClusterName',
});
}
}
同样的修改，如果刚才的cdk.json里面已经提供了exsiting的eks的集群配置，则在该集群基础上进行操作
以下是修改后的脚本，它会检查是否存在现有的 EKS 集群，如果存在则使用它，否则创建新的：

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import {ALBCDeploymentStack} from './aws-load-balancer-controller';
import * as lambdaLayerKubectl from '@aws-cdk/lambda-layer-kubectl-v30';
import { Construct } from 'constructs';
import { getAvailableInstanceType } from './instance-type-checker';

interface EKSClusterStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  subnets: ec2.SelectedSubnets;
}

export class EKSStack extends cdk.Stack {
  public readonly cluster: eks.ICluster;

  constructor(scope: Construct, id: string, props: EKSClusterStackProps) {
    super(scope, id, props);

    // 检查是否存在现有的 EKS 集群
    const existingResources = this.node.tryGetContext('existingResources');
    const existingClusterName = existingResources?.eksCluster;

    if (existingClusterName) {
      // 如果存在现有集群，则导入它
      this.cluster = eks.Cluster.fromClusterAttributes(this, 'ExistingCluster', {
        clusterName: existingClusterName,
        vpc: props.vpc,
        kubectlRoleArn: existingResources.kubectlRoleArn, // 如果需要，从context中获取
        openIdConnectProvider: eks.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'OIDCProvider',
          existingResources.oidcProviderArn // 如果需要，从context中获取
        ),
      });

      // 为现有集群添加新的节点组（如果需要）
      if (this.node.tryGetContext('addNewNodeGroup')) {
        this.addNodeGroup();
      }
    } else {
      // 如果不存在现有集群，则创建新的
      // EKS 控制平面安全组
      const eksControlPlaneSecurityGroup = new ec2.SecurityGroup(this, 'EKSControlPlaneSG', {
        vpc: props.vpc,
        description: 'Cluster communication with worker nodes',
        allowAllOutbound: true,
      });

      eksControlPlaneSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
        ec2.Port.allTraffic(),
        'Allow all traffic from within the VPC'
      );

      // EKS 集群角色
      const eksClusterRole = new iam.Role(this, 'EKSClusterRole', {
        assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy')],
      });

      // 创建新的 EKS 集群
      this.cluster = new eks.Cluster(this, 'EKSCluster', {
        version: eks.KubernetesVersion.of(this.node.tryGetContext('EKSClusterVersion') || '1.31'),
        clusterName: 'dify-eks',
        vpc: props.vpc,
        vpcSubnets: [props.subnets],
        securityGroup: eksControlPlaneSecurityGroup,
        role: eksClusterRole,
        endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
        defaultCapacity: 0,
        kubectlLayer: new lambdaLayerKubectl.KubectlV30Layer(this, 'KubectlLayer'),
        authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
      });

      // 为新集群添加节点组
      this.addNodeGroup();
    }

    // Deploy ALBC if needed
    if (this.node.tryGetContext('deployALBC') !== false) {
      const _ALBC = new ALBCDeploymentStack(this, 'ALBCDeploymentStack', {
        cluster: this.cluster,
      });
    }

    // 输出 EKS 集群相关信息
    new cdk.CfnOutput(this, 'ClusterName', {
      value: this.cluster.clusterName,
      exportName: 'EKSClusterName',
    });
  }

  private addNodeGroup() {
    // 创建节点组 IAM 角色
    const nodeGroupRole = new iam.Role(this, 'NodeGroupRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
      ],
    });

    const invokeSagemakerPolicy = new iam.PolicyStatement({
      actions: ['sagemaker:InvokeEndpoint'],
      resources: ['*'],
    });
    
    nodeGroupRole.addToPolicy(invokeSagemakerPolicy);

    // 异步获取可用的实例类型并添加节点组
    (async () => {
      const nodeInstanceType = await getAvailableInstanceType();
      console.log(`EKS Using instance type: ${nodeInstanceType}`);

      (this.cluster as eks.Cluster).addNodegroupCapacity('NodeGroup', {
        instanceTypes: [new ec2.InstanceType(nodeInstanceType)],
        minSize: this.node.tryGetContext('NodeGroupMinSize') || 3,
        desiredSize: this.node.tryGetContext('NodeGroupDesiredSize') || 3,
        maxSize: this.node.tryGetContext('NodeGroupMaxSize') || 10,
        nodeRole: nodeGroupRole,
      });
    })();
  }
}
