import { gql } from 'apollo-server-express';

const Orders = gql`
  type Order {
    _id: String
    customerId: String
    restaurantId: String
    order: [String]
    orderBy: String!
  }
  type OrdersPopulated {
    _id: String
    customerId: Customer
    restaurant: Restaurant
    order: [String]
  }
  extend type Query {
    orders: [OrdersPopulated]
    order(id: String): OrdersPopulated
  }
  extend type Mutation {
    addOrder(
      customerId: String
      restaurantId: String
      order: [String]
      orderBy: String
    ): Order
  }
`;

export default Orders;
