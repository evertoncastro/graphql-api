import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Transfer {
    date: String
    description: String
    BRL: String
    EUR: String
    USD: String
  }
  type Query {
    getTransferProPlan(sourceUrl: String!): Transfer
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
