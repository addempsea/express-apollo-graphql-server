import { gql } from 'apollo-server-express';

const subscription = gql`
  extend type Subscription {
    newAdmin: Admin
    newOrder(restaurantId: String): Order
  }
`;

export default subscription;
