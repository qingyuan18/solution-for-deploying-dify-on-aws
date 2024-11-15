import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface VPCStackProps extends cdk.StackProps {
  vpcName: string;
}

export class VPCStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VPCStackProps) {
    super(scope, id, props);

      // Create a VPC
      const vpc = new ec2.Vpc(this, props.vpcName, {
          //vpcName: props.vpcName,
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
    
        // Output the VPC ID
        new cdk.CfnOutput(this, 'VpcId', {
          value: vpc.vpcId,
        });
    
        // Output the Subnet IDs
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