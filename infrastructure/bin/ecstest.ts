#!/usr/bin/env node
import 'source-map-support/register';
import { EcsTestApp } from '../lib/ecstest-app';

new EcsTestApp({
  imageName: 'ecstest',
  imageTag: 'latest',
  exposePort: 8080,
  allowAllIngress: true,
  assignPublicIp: true
});
