import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { createContext } from './context';

const yoga = createYoga({
  schema,
  context: () => createContext(),
  graphqlEndpoint: '/graphql',
});

const port = Number(process.env.API_PORT ?? 4000);
const server = createServer(yoga);

server.listen(port, () => {
  console.log(`GraphQL Yoga running on http://localhost:${port}/graphql`);
});