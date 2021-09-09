import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { EcsTestRepoStack } from '../lib/ecstest-repo-stack';

describe('EcsTestRepoStack', () => {
  const app = new cdk.App();
  const stack = new EcsTestRepoStack(app, 'MyTestStack', {
    imageName: 'foo'
  });

  it('has a repo', () => {
    expectCDK(stack).to(
      haveResource('AWS::ECR::Repository', {
        RepositoryName: 'foo'
      })
    );
  });
});
