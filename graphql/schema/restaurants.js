import { gql } from 'apollo-server-express';

const restaurants = gql`
  type Menu {
    _id: String
    name: String
    price: Float
  }
  type Restaurant {
    _id: String
    name: String
    email: String
    location: String
    menu: [Menu]
  }
  extend type Query {
    restaurants: [Restaurant]
    restaurant(id: String): Restaurant
  }
  input MenuItem {
    name: String
    price: Float
  }
  extend type Mutation {
    addRestaurant(
      name: String
      email: String
      location: String
      menu: [MenuItem]
    ): Restaurant
  }
`;

export default restaurants;
