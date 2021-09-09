import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export interface EcsTestRepoStackProps extends cdk.StackProps {
  readonly imageName: string;
}

export class EcsTestRepoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EcsTestRepoStackProps) {
    super(scope, id, props);

    new ecr.Repository(this, 'Repo', {
      repositoryName: props.imageName
    });
  }
}
