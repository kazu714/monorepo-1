import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { createContext } from "./context";

const yoga = createYoga({
  schema,
  context: (request) => createContext(request),
  graphqlEndpoint: "/graphql",
});

const port = Number(process.env.API_PORT ?? 3001);
const server = createServer(yoga);

server.listen(port, () => {
  console.log(`GraphQL Yoga running on http://localhost:${port}/graphql`);
});
