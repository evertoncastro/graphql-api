import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './api/schema';

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(PORT, HOST, () =>
  console.log(`Running a GraphQL API at http://${HOST}:${PORT}`)
);

export default app;
