import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Transfer {
    date: String
    description: String
    brl_value: String
    usd_value: String
    eur_value: String
  }
  type Query {
    getTransferProPlan(sourceUrl: String!): Transfer
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
