/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInfluencerPrivate = /* GraphQL */ `
  mutation CreateInfluencerPrivate(
    $condition: ModelInfluencerPrivateConditionInput
    $input: CreateInfluencerPrivateInput!
  ) {
    createInfluencerPrivate(condition: $condition, input: $input) {
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
export const createInfluencerPublic = /* GraphQL */ `
  mutation CreateInfluencerPublic(
    $condition: ModelInfluencerPublicConditionInput
    $input: CreateInfluencerPublicInput!
  ) {
    createInfluencerPublic(condition: $condition, input: $input) {
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
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const deleteInfluencerPrivate = /* GraphQL */ `
  mutation DeleteInfluencerPrivate(
    $condition: ModelInfluencerPrivateConditionInput
    $input: DeleteInfluencerPrivateInput!
  ) {
    deleteInfluencerPrivate(condition: $condition, input: $input) {
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
export const deleteInfluencerPublic = /* GraphQL */ `
  mutation DeleteInfluencerPublic(
    $condition: ModelInfluencerPublicConditionInput
    $input: DeleteInfluencerPublicInput!
  ) {
    deleteInfluencerPublic(condition: $condition, input: $input) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const updateInfluencerPrivate = /* GraphQL */ `
  mutation UpdateInfluencerPrivate(
    $condition: ModelInfluencerPrivateConditionInput
    $input: UpdateInfluencerPrivateInput!
  ) {
    updateInfluencerPrivate(condition: $condition, input: $input) {
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
export const updateInfluencerPublic = /* GraphQL */ `
  mutation UpdateInfluencerPublic(
    $condition: ModelInfluencerPublicConditionInput
    $input: UpdateInfluencerPublicInput!
  ) {
    updateInfluencerPublic(condition: $condition, input: $input) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
