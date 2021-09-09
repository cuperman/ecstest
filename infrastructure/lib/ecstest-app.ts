import * as cdk from '@aws-cdk/core';
import { EcsTestRepoStack } from '../lib/ecstest-repo-stack';
import { EcsTestServiceStack } from '../lib/ecstest-service-stack';

export interface EcsTestAppProps extends cdk.AppProps {
  readonly imageName: string;
  readonly imageTag: string;
  readonly exposePort: number;
  readonly allowAllIngress?: boolean;
  readonly assignPublicIp?: boolean;
}

export class EcsTestApp extends cdk.App {
  constructor(props: EcsTestAppProps) {
    super(props);

    new EcsTestRepoStack(this, 'EcsTestRepo', {
      imageName: props.imageName
    });

    new EcsTestServiceStack(this, 'EcsTestServiceV2', {
      imageName: props.imageName,
      imageTag: props.imageTag,
      exposePort: props.exposePort,
      allowAllIngress: props.allowAllIngress,
      assignPublicIp: props.assignPublicIp
    });
  }
}
