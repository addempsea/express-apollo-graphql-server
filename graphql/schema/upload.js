import { gql } from 'apollo-server-express';

const upload = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    uri: String!
    type: String
  }
  extend type Query {
    uploads: [File]
  }
  extend type Mutation {
    singleUpload(file: Upload!, type: String): File!
  }
`;

export default upload;
