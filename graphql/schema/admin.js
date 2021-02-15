import { gql } from 'apollo-server-express';

const Admins = gql`
  type Admin {
    _id: String
    name: String!
    username: String!
    password: String!
  }
  extend type Query {
    admins: [Admin]
    admin(id: String): Admin
  }
  extend type Mutation {
    addAdmin(
      name: String
      username: String
      password: String
    ): Admin
  }
`;

export default Admins;
