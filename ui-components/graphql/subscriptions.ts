/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateInfluencerPrivate = /* GraphQL */ `
  subscription OnCreateInfluencerPrivate(
    $filter: ModelSubscriptionInfluencerPrivateFilterInput
  ) {
    onCreateInfluencerPrivate(filter: $filter) {
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
export const onCreateInfluencerPublic = /* GraphQL */ `
  subscription OnCreateInfluencerPublic(
    $filter: ModelSubscriptionInfluencerPublicFilterInput
  ) {
    onCreateInfluencerPublic(filter: $filter) {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onDeleteInfluencerPrivate = /* GraphQL */ `
  subscription OnDeleteInfluencerPrivate(
    $filter: ModelSubscriptionInfluencerPrivateFilterInput
  ) {
    onDeleteInfluencerPrivate(filter: $filter) {
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
export const onDeleteInfluencerPublic = /* GraphQL */ `
  subscription OnDeleteInfluencerPublic(
    $filter: ModelSubscriptionInfluencerPublicFilterInput
  ) {
    onDeleteInfluencerPublic(filter: $filter) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onUpdateInfluencerPrivate = /* GraphQL */ `
  subscription OnUpdateInfluencerPrivate(
    $filter: ModelSubscriptionInfluencerPrivateFilterInput
  ) {
    onUpdateInfluencerPrivate(filter: $filter) {
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
export const onUpdateInfluencerPublic = /* GraphQL */ `
  subscription OnUpdateInfluencerPublic(
    $filter: ModelSubscriptionInfluencerPublicFilterInput
  ) {
    onUpdateInfluencerPublic(filter: $filter) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
