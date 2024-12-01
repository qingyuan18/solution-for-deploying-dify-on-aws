import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface RDSStackProps extends cdk.StackProps {
  subnets: cdk.aws_ec2.SelectedSubnets;
  vpc: ec2.Vpc;
}

export class RDSStack extends cdk.Stack {
  public readonly cluster: rds.IDatabaseCluster;
  public readonly dbEndpoint: string;
  public readonly dbPort: string;

  constructor(scope: Construct, id: string, props: RDSStackProps) {
    super(scope, id, props);

    // 检查是否存在现有的 RDS 配置
    const existingResources = this.node.tryGetContext('existingResources');
    const existingRDS = existingResources?.rds;

    if (existingRDS) {
      // 如果存在现有RDS,则导入它
      this.cluster = rds.DatabaseCluster.fromDatabaseClusterAttributes(this, 'ExistingRDSCluster', {
        clusterIdentifier: existingRDS.clusterIdentifier,
        port: existingRDS.port || 5432,
      });

      // 设置端点信息
      this.dbEndpoint = existingRDS.endpoint;
      this.dbPort = existingRDS.port?.toString() || '5432';

    } else {
      // 如果不存在现有RDS,则创建新的
      // 获取数据库密码
      const dbPassword = this.node.tryGetContext('dbPassword');
      if (!dbPassword) {
        throw new Error("Context variable 'dbPassword' is missing");
      }

      // 创建安全组
      const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
        vpc: props.vpc,
        description: 'Security group for RDS database',
        allowAllOutbound: true,
      });

      dbSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
        ec2.Port.tcp(5432),
        'Allow database connections from within the VPC'
      );

      // 创建新的 Aurora 集群
      this.cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_15_7,
        }),
        vpc: props.vpc,
        vpcSubnets: props.subnets,
        credentials: rds.Credentials.fromPassword('postgres', cdk.SecretValue.unsafePlainText(dbPassword)),
        clusterIdentifier: 'dify-db',
        defaultDatabaseName: 'dify',
        serverlessV2MaxCapacity: 4,
        serverlessV2MinCapacity: 0,
        securityGroups: [dbSecurityGroup],
        writer: rds.ClusterInstance.serverlessV2('writer', {
          instanceIdentifier: 'dify-db-writer',
        }),
      });

      this.dbEndpoint = this.cluster.clusterEndpoint.hostname;
      this.dbPort = this.cluster.clusterEndpoint.port.toString();
    }

    // 输出数据库信息
    new cdk.CfnOutput(this, 'DBEndpoint', {
      value: this.dbEndpoint,
      description: 'RDS Endpoint',
      exportName: 'RDSInstanceEndpoint',
    });

    new cdk.CfnOutput(this, 'DBPort', {
      value: this.dbPort,
      description: 'RDS Port',
      exportName: 'RDSInstancePort',
    });
  }
}
