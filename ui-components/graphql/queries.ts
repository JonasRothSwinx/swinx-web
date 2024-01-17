/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInfluencerPrivate = /* GraphQL */ `
  query GetInfluencerPrivate($id: ID!) {
    getInfluencerPrivate(id: $id) {
      Influencer {
        createdAt
        firstName
        id
        influencerPublicDetailsId
        lastName
        updatedAt
        __typename
      }
      createdAt
      email
      id
      influencerPrivateInfluencerId
      updatedAt
      __typename
    }
  }
`;
export const getInfluencerPublic = /* GraphQL */ `
  query GetInfluencerPublic($id: ID!) {
    getInfluencerPublic(id: $id) {
      createdAt
      details {
        createdAt
        email
        id
        influencerPrivateInfluencerId
        updatedAt
        __typename
      }
      firstName
      id
      influencerPublicDetailsId
      lastName
      updatedAt
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const listInfluencerPrivates = /* GraphQL */ `
  query ListInfluencerPrivates(
    $filter: ModelInfluencerPrivateFilterInput
    $id: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInfluencerPrivates(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        email
        id
        influencerPrivateInfluencerId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listInfluencerPublics = /* GraphQL */ `
  query ListInfluencerPublics(
    $filter: ModelInfluencerPublicFilterInput
    $id: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInfluencerPublics(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        firstName
        id
        influencerPublicDetailsId
        lastName
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $id: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTodos(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        content
        createdAt
        id
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
