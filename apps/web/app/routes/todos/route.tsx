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
import { useState } from "react";

const GET_TODOS_QUERY = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TODO_MUTATION = gql`
  mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Todos - React Router App" },
    { name: "description", content: "Manage todos with GraphQL" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const todos_data = await graphqlClient.request<{ todos: Todo[] }>(
      GET_TODOS_QUERY
    );
    return { todos: todos_data.todos };
  } catch (graphql_error) {
    console.error("Error fetching todos:", graphql_error);
    return { todos: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const form_data = await request.formData();
  const action_type = form_data.get("action") as string;

  if (action_type === "create") {
    const todo_title = form_data.get("title") as string;

    if (!todo_title?.trim()) {
      return { error: "Title is required" };
    }

    try {
      await graphqlClient.request(CREATE_TODO_MUTATION, {
        title: todo_title,
      });
      return redirect("/todos");
    } catch (graphql_error) {
      console.error("Error creating todo:", graphql_error);
      return { error: "Failed to create todo" };
    }
  }

  if (action_type === "toggle") {
    const todo_id = parseInt(form_data.get("id") as string);
    const completed = form_data.get("completed") === "true";

    try {
      await graphqlClient.request(UPDATE_TODO_MUTATION, {
        id: todo_id,
        completed: !completed,
      });
      return redirect("/todos");
    } catch (graphql_error) {
      console.error("Error updating todo:", graphql_error);
      return { error: "Failed to update todo" };
    }
  }

  if (action_type === "update") {
    const todo_id = parseInt(form_data.get("id") as string);
    const todo_title = form_data.get("title") as string;

    if (!todo_title?.trim()) {
      return { error: "Title is required" };
    }

    try {
      await graphqlClient.request(UPDATE_TODO_MUTATION, {
        id: todo_id,
        title: todo_title,
      });
      return redirect("/todos");
    } catch (graphql_error) {
      console.error("Error updating todo:", graphql_error);
      return { error: "Failed to update todo" };
    }
  }

  if (action_type === "delete") {
    const todo_id = parseInt(form_data.get("id") as string);

    try {
      await graphqlClient.request(DELETE_TODO_MUTATION, {
        id: todo_id,
      });
      return redirect("/todos");
    } catch (graphql_error) {
      console.error("Error deleting todo:", graphql_error);
      return { error: "Failed to delete todo" };
    }
  }

  return { error: "Unknown action" };
}

export default function Todos() {
  const { todos } = useLoaderData<typeof loader>();
  const action_data = useActionData<typeof action>();
  const navigation = useNavigation();
  const is_submitting = navigation.state === "submitting";
  const [editing_todo_id, setEditingTodoId] = useState<string | null>(null);
  const [edit_title, setEditTitle] = useState<string>("");

  const start_editing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const cancel_editing = () => {
    setEditingTodoId(null);
    setEditTitle("");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Todos</h1>

      <div className="mb-8">
        <Link to="/home" className="text-blue-500 hover:underline">
          &#8592; Back to Home
        </Link>
        <h2 className="text-xl font-semibold mb-4">Create New Todo</h2>
        <Form method="post" className="space-y-4">
          {action_data?.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {action_data.error}
            </div>
          )}
          <input type="hidden" name="action" value="create" />
          <div>
            <label className="block text-sm font-medium mb-2">Title:</label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={is_submitting}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {is_submitting ? "Creating..." : "Create Todo"}
          </button>
        </Form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Todos List</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos found.</p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Form method="post" className="inline">
                    <input type="hidden" name="action" value="toggle" />
                    <input type="hidden" name="id" value={todo.id} />
                    <input
                      type="hidden"
                      name="completed"
                      value={todo.completed.toString()}
                    />
                    <button
                      type="submit"
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {todo.completed && "✓"}
                    </button>
                  </Form>

                  {editing_todo_id === todo.id ? (
                    <Form
                      method="post"
                      className="flex items-center space-x-2 flex-1"
                    >
                      <input type="hidden" name="action" value="update" />
                      <input type="hidden" name="id" value={todo.id} />
                      <input
                        type="text"
                        name="title"
                        value={edit_title}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancel_editing}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </Form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <div className="text-sm text-gray-400 mt-1">
                          <span>
                            Created:{" "}
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                          {todo.updatedAt !== todo.createdAt && (
                            <span className="ml-4">
                              Updated:{" "}
                              {new Date(todo.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => start_editing(todo)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <Form method="post" className="inline">
                          <input type="hidden" name="action" value="delete" />
                          <input type="hidden" name="id" value={todo.id} />
                          <button
                            type="submit"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this todo?"
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </Form>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
