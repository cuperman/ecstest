import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export interface EcsTestServiceStackProps extends cdk.StackProps {
  readonly imageName: string;
  readonly imageTag: string;
  readonly exposePort: number;
  readonly allowAllIngress?: boolean;
  readonly assignPublicIp?: boolean;
}

export class EcsTestServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EcsTestServiceStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'web',
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: 'app',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
        },
        {
          cidrMask: 28,
          name: 'data',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    });

    const serviceSecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: 'Service Security Group',
      vpc,
      allowAllOutbound: true
    });

    if (props.allowAllIngress) {
      serviceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTcp());
    } else {
      serviceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(props.exposePort));
    }

    const repo = ecr.Repository.fromRepositoryName(this, 'Repo', props.imageName);

    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      vpc,
      securityGroups: [serviceSecurityGroup],
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repo, props.imageTag),
        containerPort: props.exposePort
      },
      listenerPort: props.exposePort,
      assignPublicIp: props.assignPublicIp
    });
  }
}
