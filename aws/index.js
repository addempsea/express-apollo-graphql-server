import { S3 as _S3 } from 'aws-sdk';
const S3 = new _S3({
  accessKeyId: 'AKIAJGRWVBYNEP73ILGQ',
  secretAccessKey: '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',
  ACL: 'public-read'
});

export { S3 };
