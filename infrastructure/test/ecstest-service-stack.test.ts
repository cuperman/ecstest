import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { EcsTestServiceStack } from '../lib/ecstest-service-stack';

describe('EcsTestRepoStack', () => {
  describe('with default props', () => {
    const app = new cdk.App();
    const stack = new EcsTestServiceStack(app, 'MyTestStack', {
      imageName: 'foo',
      imageTag: 'latest',
      exposePort: 3000
    });

    it('has a fargate ecs service without a public ip', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ECS::Service', {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              AssignPublicIp: 'DISABLED'
            }
          }
        })
      );
    });

    it('has a task definition listening on port 3000', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            {
              PortMappings: [
                {
                  ContainerPort: 3000,
                  Protocol: 'tcp'
                }
              ]
            }
          ]
        })
      );
    });

    it('has a security group allowing only port 3000 ingress', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::EC2::SecurityGroup', {
          GroupDescription: 'Service Security Group',
          SecurityGroupIngress: [
            {
              IpProtocol: 'tcp',
              FromPort: 3000,
              ToPort: 3000
            }
          ]
        })
      );
    });
  });

  describe('with allowAllIngress enabled', () => {
    const app = new cdk.App();
    const stack = new EcsTestServiceStack(app, 'MyTestStack', {
      imageName: 'foo',
      imageTag: 'latest',
      exposePort: 3000,
      allowAllIngress: true
    });

    it('has a security group allowing all ports', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::EC2::SecurityGroup', {
          GroupDescription: 'Service Security Group',
          SecurityGroupIngress: [
            {
              IpProtocol: 'tcp',
              FromPort: 0,
              ToPort: 65535
            }
          ]
        })
      );
    });
  });

  describe('with assignPublicIp enabled', () => {
    const app = new cdk.App();
    const stack = new EcsTestServiceStack(app, 'MyTestStack', {
      imageName: 'foo',
      imageTag: 'latest',
      exposePort: 3000,
      assignPublicIp: true
    });

    it('has a fargate ecs service with public ip enabled', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ECS::Service', {
          LaunchType: 'FARGATE',
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              AssignPublicIp: 'ENABLED'
            }
          }
        })
      );
    });
  });
});
