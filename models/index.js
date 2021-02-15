import mongoose, { model, Schema as _Schema } from 'mongoose';
const { Schema } = mongoose;

const MenuSchema = _Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const RestaurantSchema = _Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    menu: {
      type: [MenuSchema]
    }
  },
  { timestamps: true }
);

const CustomerSchema = _Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const OrderSchema = _Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    order: {
      type: [Schema.Types.ObjectId],
      ref: 'Order',
      order: true
    },
    orderBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  { timestamps: true }
);

const AdminSchema = _Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Restaurant = model('Restaurant', RestaurantSchema);
const Customer = model('Customer', CustomerSchema);
const Order = model('Order', OrderSchema);
const Admin = model('Admin', AdminSchema);

export { Restaurant, Customer, Order, Admin };
