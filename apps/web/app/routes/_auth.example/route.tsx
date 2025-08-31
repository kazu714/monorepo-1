import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  useLoaderData,
  Form,
  redirect,
  useActionData,
  useNavigation,
  Link,
} from "react-router";
import { graphqlClient } from "~/util/graphql";
import { gql } from "graphql-request";

const GET_EXAMPLES_QUERY = gql`
  query GetExamples {
    examples {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EXAMPLE_MUTATION = gql`
  mutation CreateExample($name: String!, $value: String!) {
    createExample(name: $name, value: $value) {
      id
      name
      value
      createdAt
      updatedAt
    }
  }
`;

interface Example {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Examples - React Router App" },
    { name: "description", content: "Manage examples with GraphQL" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const examples_data = await graphqlClient.request<{ examples: Example[] }>(
      GET_EXAMPLES_QUERY
    );
    return { examples: examples_data.examples };
  } catch (graphql_error) {
    console.error("Error fetching examples:", graphql_error);
    return { examples: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const form_data = await request.formData();
  const example_name = form_data.get("name") as string;
  const example_value = form_data.get("value") as string;

  if (!example_name?.trim() || !example_value?.trim()) {
    return { error: "Name and value are required" };
  }

  try {
    await graphqlClient.request(CREATE_EXAMPLE_MUTATION, {
      name: example_name,
      value: example_value,
    });
    return redirect("/example");
  } catch (graphql_error) {
    console.error("Error creating example:", graphql_error);
    return { error: "Failed to create example" };
  }
}

export default function Examples() {
  const { examples } = useLoaderData<typeof loader>();
  const action_data = useActionData<typeof action>();
  const navigation = useNavigation();
  const is_submitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Examples</h1>

      <div className="mb-8">
        <Link to="/home" className="text-blue-500 hover:underline">
          &#8592; Back to Home
        </Link>
        <h2 className="text-xl font-semibold mb-4">Create New Example</h2>
        <Form method="post" className="space-y-4">
          {action_data?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {action_data.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Value:</label>
            <input
              type="text"
              name="value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={is_submitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {is_submitting ? "Creating..." : "Create Example"}
          </button>
        </Form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Examples List</h2>
        {examples.length === 0 ? (
          <p className="text-gray-500">No examples found.</p>
        ) : (
          <div className="grid gap-4">
            {examples.map((example) => (
              <div
                key={example.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold">{example.name}</h3>
                <p className="text-gray-600">{example.value}</p>
                <div className="text-sm text-gray-400 mt-2">
                  <p>
                    Created: {new Date(example.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Updated: {new Date(example.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
