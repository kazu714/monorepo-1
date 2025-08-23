import { gql } from 'graphql-request';

export const GET_EXAMPLES = gql`
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

export const CREATE_EXAMPLE = gql`
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