import { gql } from 'apollo-server-express';

const enums = gql`
   enum QueryStatus {
    SUCCESS
    NOT_FOUND
    ERROR
  }

`;

export default enums;
