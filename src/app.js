import 'dotenv/config';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './api/schema';

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log('Running a GraphQL API at http://localhost:4000/graphql')
);

export default app;
