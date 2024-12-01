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
