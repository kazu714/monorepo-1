import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} from "graphql";
import { exampleResolvers } from "./resolvers/example";
import { taskResolvers } from "./resolvers/task";

const ExampleType = new GraphQLObjectType({
  name: "Example",
  description: "Example row",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The unique identifier for the example",
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The name of the example",
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The value of the example",
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The creation date of the example",
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The last update date of the example",
    },
  },
});

const TaskType = new GraphQLObjectType({
  name: "Task",
  description: "Task item",
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The unique identifier for the task",
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The text content of the task",
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    examples: {
      type: new GraphQLList(ExampleType),
      description: "Get all examples",
      resolve: exampleResolvers.examples,
    },
    tasks: {
      type: new GraphQLList(TaskType),
      description: "Get all tasks",
      resolve: taskResolvers.tasks,
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createExample: {
      type: ExampleType,
      description: "Create a new example",
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The name of the example to create",
        },
        value: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The value of the example to create",
        },
      },
      resolve: exampleResolvers.createExample,
    },
    createTask: {
      type: TaskType,
      description: "Create a new task",
      args: {
        text: {
          type: new GraphQLNonNull(GraphQLString),
          description: "The text content of the task to create",
        },
      },
      resolve: taskResolvers.createTask,
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
