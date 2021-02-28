import root from './root';
import customers from './customers';
import orders from './orders';
import restaurants from './restaurants';
import admins from './admin';
import subscription from './subscription';
import upload from './upload';
import enums from './enum';

const schemaArray = [
  root,
  restaurants,
  customers,
  orders,
  admins,
  subscription,
  upload,
  enums
];

export default schemaArray;
