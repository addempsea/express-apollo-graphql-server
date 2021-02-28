import { S3 as _S3 } from 'aws-sdk';
const S3 = new _S3({
  accessKeyId: process.env.ACL,
  secretAccessKey: process.env.secretAccessKey,
  ACL: 'public-read'
});

export { S3 };
