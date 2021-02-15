import { gql } from 'apollo-server-express';

const Customers = gql`
  type Customer {
    _id: String
    name: String
    email: String
    location: String
  }
  extend type Query {
    customers: [Customer]
    customer(id: String): Customer
  }
  extend type Mutation {
    addCustomer(name: String, email: String, location: String): Customer
  }
`;

export default Customers;
