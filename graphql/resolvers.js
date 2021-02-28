import { createJob } from '../jobs';
import { Restaurant, Customer, Order, Admin } from '../models';
import { errorLogger, upload } from '../utils/helpers';
import { pubsub, withFilter } from './pubsub';

const resolvers = {
  Response: {
    __resolveType(obj, context, info){
      console.log(obj);
      if(obj.data){
        return 'OrdersResult';
      }
      if(!obj.data){
        return 'Errors';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    async restaurants(parent, args, context, info) {
      // console.log(context);
      try {
        const restaurant = await Restaurant.find();
        return restaurant.map((r) => ({ ...r._doc }));
      } catch (err) {
        console.error(err);
      }
    },
    async restaurant(parent, args, context, info) {
      try {
        const restaurant = await Restaurant.findOne({ _id: args.id });
        return { ...restaurant._doc };
      } catch (err) {
        console.error(err);
      }
    },
    async customers(parent, args, context, info) {
      try {
        const customer = await Customer.find();
        return customer.map((r) => ({ ...customer._doc }));
      } catch (err) {
        console.error(err);
      }
    },
    async customer(parent, args, context, info) {
      try {
        const customer = await Customer.findOne({ _id: args.id });
        return { ...customer._doc };
      } catch (err) {
        console.error(err);
      }
    },
    async orders(parent, args, context, info) {
      try {
        const orderObj = await Order.find().populate('customerId');
        if (orderObj) {
          return {status: 400, message: 'No way', data: [null]}
        }
        return { data: orderObj, status: 200, message: 'SUCCESS' };
        // createJob({ type: 'SEND_PASSWORD_TO_EMAL', data: orderObj })
      } catch (error) {
        return errorLogger(error, 'GET_ALL_ORDERS', 'Error while trying to fetch orders, it\'s not you, it\'s us')
      }
    },
    async order(parent, args, context, info) {
      try {
        const orderObj = await Order.findOne({ _id: args.id });
        return { ...orderObj._doc };
      } catch (err) {
        console.error(err);
      }
    }
  },
  Mutation: {
    async addRestaurant(parent, args, context, info) {
      const { name, email, location, menu } = args;
      const restaurantObj = new Restaurant({
        name,
        email,
        location,
        menu
      });
      try {
        const result = await restaurantObj.save();
        return { ...result._doc };
      } catch (err) {
        console.error(err);
      }
    },
    async addCustomer(parent, args, context, info) {
      const { name, email, location } = args;
      const customerObj = new Customer({
        name,
        email,
        location
      });
      try {
        const result = await customerObj.save();
        return { ...result._doc };
      } catch (err) {
        console.error(err);
      }
    },
    async addOrder(parent, args, context, info) {
      const { customerId, restaurantId, order, orderBy } = args;
      const orderObj = new Order({
        customerId,
        restaurantId,
        order,
        orderBy
      });
      try {
        const result = await orderObj.save();
        const order_1 = { ...result._doc };
        pubsub.publish('NEW_ORDER', { newOrder: order_1 });
        return order_1;
      } catch (err) {
        console.error(err);
      }
    },
    async addAdmin(parent, args, context, info) {
      const { name, username, password } = args;
      const adminObj = new Admin({
        name,
        username,
        password
      });
      try {
        const result = await adminObj.save();
        pubsub.publish('NEW_ADMIN', { newAdmin: result });
        return { ...result._doc };
      } catch (err) {
        console.error(err);
      }
    },
    async singleUpload(parent, { file, type, ...args }) {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const dd = await upload(stream, filename);
      return { filename, mimetype, encoding, uri: dd.Location, type };
    }
  },
  Subscription: {
    newOrder: {
      resolve: (payload) => {
        return payload.newOrder;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator('NEW_ORDER'),
        (payload, variables) => {
          return (
            `${payload.newOrder.restaurantId}` === `${variables.restaurantId}`
          );
        }
      )
    },
    newAdmin: {
      resolve: (payload) => {
        return payload.newAdmin;
      },
      subscribe: () => {
        return pubsub.asyncIterator('NEW_ADMIN');
      }
    }
  }
};

export default resolvers;
