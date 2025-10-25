import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { graphqlClient } from "../../util/graphql";
import { ensureSession } from "~/util/auth.server";
import { gql } from "graphql-request";

const CREATE_CLIENT_MUTATION = gql`
  mutation CreateClient($name: String!) {
    createClient(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const GET_CLIENTS_QUERY = gql`
  query Clients {
    clients {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await ensureSession(request);

  const clients = await graphqlClient.request(GET_CLIENTS_QUERY);


  return clients;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await ensureSession(request);

  const form_data = await request.formData();
  const name = form_data.get("name") as string;

  const response = await graphqlClient.request(CREATE_CLIENT_MUTATION, {
    name,
  });
  return redirect("/clients");
}

export default function Clients() {
  // @ts-ignore
  const { clients } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Clients</h1>
      <p>List of clients will go here.</p>
      <div>
        <form method ="post">
          <label>
            Client Name:
            <input type="text" name="name" required />
          </label>
          <button type="submit">Add Client</button>
        </form>
      </div>
      <ul>
        {clients.map((client: { id: string; name: string }) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </>
  );
}
