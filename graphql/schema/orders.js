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
  type OrdersResult {
    status: Int!
    message: String!
    data: [OrdersPopulated]!
  }
  type Errors {
    status: Int!
    message: String!
  }

  union Response = OrdersResult | Errors

  extend type Query {
    orders: OrdersResult
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
