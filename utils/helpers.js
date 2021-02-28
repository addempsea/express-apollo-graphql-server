import jwt from 'jsonwebtoken';
import { extname } from 'path';
import { Admin } from '../models';
import { S3 } from '../aws';

const SIGN_OPTIONS = {
  issuer: 'Demola',
  subject: 'Authentication Bearer',
  expiresIn: '2hrs'
};

export const createToken = (payload) => {
  const token = jwt.sign(payload, 'JWT_SECRET', SIGN_OPTIONS);
  return token;
};

export const verifyToken = (token) => {
  const jwtToken = jwt.verify(token, 'JWT_SECRET', SIGN_OPTIONS);
  return jwtToken;
};

export const loginUser = async (username, password) => {
  const user = await Admin.findOne({ username }).lean();
  if (user.username && password === user.password) {
    const token = createToken(user);
    return token;
  }
  throw Error('Invalid login details');
};

export const auth = (req, res, next) => {
  try {
    const user = verifyToken(req.headers.authorization.split(' ')[1]);
    req.user = user;
    return next();
  } catch (error) {
    res
      .status(401)
      .json({ message: 'A valid token is required', statusCode: '401' });
  }
};

export const errorHandler = (error) => {
  console.log(error);
  const errObj = error.message.split(':');
  const statusCode = errObj[1];
  const message = errObj[0];

  return { message, statusCode };
};

export const upload = (file, name) => {
  try {
    const ext = extname(name);
    const date = new Date();
    const fileName = `${date.valueOf()}${Math.random()
      .toString(32)
      .substring(2)}${ext}`;
    const params = {
      Bucket: '-ven-',
      Key: fileName,
      Body: file,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };
    return S3.upload(params).promise();
  } catch (error) {
    console.log(error);
  }
};

export const errorLogger = (error, status, message) => {
  logger.error(`${error.name} - ${status} - ${error.message} `);
  return { status: 500, message };
};
