import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VPCStack extends cdk.Stack {
  public readonly vpc: ec2.IVpc;
  public readonly publicSubnets: ec2.ISubnet[];

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 检查是否存在现有的 VPC 配置
    const existingResources = this.node.tryGetContext('existingResources');
    const existingVPC = existingResources?.vpc;

    if (existingVPC) {
      // 如果存在现有VPC,则导入它
      this.vpc = ec2.Vpc.fromVpcAttributes(this, 'ExistingVPC', {
        vpcId: existingVPC.vpcId,
        availabilityZones: existingVPC.availabilityZones,
        publicSubnetIds: existingVPC.publicSubnetIds,
        privateSubnetIds: existingVPC.privateSubnetIds,
      });

      // 输出现有 VPC 信息
      new cdk.CfnOutput(this, 'ExistingVpcId', {
        value: existingVPC.vpcId,
      });

      existingVPC.publicSubnetIds.forEach((subnetId, index) => {
        new cdk.CfnOutput(this, `ExistingPublicSubnet${index}Id`, {
          value: subnetId,
        });
      });

      existingVPC.privateSubnetIds.forEach((subnetId, index) => {
        new cdk.CfnOutput(this, `ExistingPrivateSubnet${index}Id`, {
          value: subnetId,
        });
      });

    } else {
      // 如果不存在现有VPC,则创建新的
      const vpc = new ec2.Vpc(this, 'DifyVpc', {
        maxAzs: 2,
        natGateways: 1,
        subnetConfiguration: [
          {
            cidrMask: 24,
            name: 'Public',
            subnetType: ec2.SubnetType.PUBLIC,
          },
          {
            cidrMask: 24,
            name: 'Private',
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          },
        ],
      });

      this.vpc = vpc;

      // 输出新建 VPC 信息
      new cdk.CfnOutput(this, 'VpcId', {
        value: vpc.vpcId,
      });

      vpc.publicSubnets.forEach((subnet, index) => {
        new cdk.CfnOutput(this, `PublicSubnet${index}Id`, {
          value: subnet.subnetId,
        });
      });

      vpc.privateSubnets.forEach((subnet, index) => {
        new cdk.CfnOutput(this, `PrivateSubnet${index}Id`, {
          value: subnet.subnetId,
        });
      });
    }
  }
}
