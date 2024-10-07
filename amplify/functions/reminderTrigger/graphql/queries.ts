/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCampaign = /* GraphQL */ `query GetCampaign($id: ID!) {
  getCampaign(id: $id) {
    assignedInfluencers {
      nextToken
      __typename
    }
    billingAdress {
      city
      name
      street
      zip
      __typename
    }
    budget
    campaignManagerId
    createdAt
    customers {
      nextToken
      __typename
    }
    id
    notes
    projectManagers {
      nextToken
      __typename
    }
    timelineEvents {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCampaignQueryVariables,
  APITypes.GetCampaignQuery
>;
export const getCustomer = /* GraphQL */ `query GetCustomer($id: ID!) {
  getCustomer(id: $id) {
    campaign {
      budget
      campaignManagerId
      createdAt
      id
      notes
      updatedAt
      __typename
    }
    campaignId
    company
    companyPosition
    createdAt
    email
    firstName
    id
    lastName
    linkedinProfile
    notes
    phoneNumber
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCustomerQueryVariables,
  APITypes.GetCustomerQuery
>;
export const getEmailTrigger = /* GraphQL */ `query GetEmailTrigger($id: ID!) {
  getEmailTrigger(id: $id) {
    active
    createdAt
    date
    emailBodyOverride
    emailLevelOverride
    event {
      campaignId
      createdAt
      date
      eventAssignmentAmount
      eventTaskAmount
      eventTitle
      id
      isCompleted
      notes
      parentEventId
      status
      timelineEventType
      updatedAt
      __typename
    }
    eventId
    id
    sent
    subjectLineOverride
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEmailTriggerQueryVariables,
  APITypes.GetEmailTriggerQuery
>;
export const getEventAssignment = /* GraphQL */ `query GetEventAssignment($id: ID!) {
  getEventAssignment(id: $id) {
    assignment {
      budget
      campaignId
      createdAt
      id
      influencerId
      isPlaceholder
      placeholderName
      updatedAt
      __typename
    }
    assignmentId
    createdAt
    id
    timelineEvent {
      campaignId
      createdAt
      date
      eventAssignmentAmount
      eventTaskAmount
      eventTitle
      id
      isCompleted
      notes
      parentEventId
      status
      timelineEventType
      updatedAt
      __typename
    }
    timelineEventId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEventAssignmentQueryVariables,
  APITypes.GetEventAssignmentQuery
>;
export const getInfluencer = /* GraphQL */ `query GetInfluencer($id: ID!) {
  getInfluencer(id: $id) {
    assignments {
      nextToken
      __typename
    }
    candidatures {
      nextToken
      __typename
    }
    company
    createdAt
    email
    emailType
    firstName
    followers
    id
    industry
    lastName
    linkedinProfile
    notes
    phoneNumber
    position
    topic
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInfluencerQueryVariables,
  APITypes.GetInfluencerQuery
>;
export const getInfluencerAssignment = /* GraphQL */ `query GetInfluencerAssignment($id: ID!) {
  getInfluencerAssignment(id: $id) {
    budget
    campaign {
      budget
      campaignManagerId
      createdAt
      id
      notes
      updatedAt
      __typename
    }
    campaignId
    candidates {
      nextToken
      __typename
    }
    createdAt
    id
    influencer {
      company
      createdAt
      email
      emailType
      firstName
      followers
      id
      industry
      lastName
      linkedinProfile
      notes
      phoneNumber
      position
      topic
      updatedAt
      __typename
    }
    influencerId
    isPlaceholder
    placeholderName
    timelineEvents {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInfluencerAssignmentQueryVariables,
  APITypes.GetInfluencerAssignmentQuery
>;
export const getInfluencerCandidate = /* GraphQL */ `query GetInfluencerCandidate($id: ID!) {
  getInfluencerCandidate(id: $id) {
    assignment {
      budget
      campaignId
      createdAt
      id
      influencerId
      isPlaceholder
      placeholderName
      updatedAt
      __typename
    }
    candidateAssignmentId
    createdAt
    feedback
    id
    influencer {
      company
      createdAt
      email
      emailType
      firstName
      followers
      id
      industry
      lastName
      linkedinProfile
      notes
      phoneNumber
      position
      topic
      updatedAt
      __typename
    }
    influencerId
    invitationSent
    response
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInfluencerCandidateQueryVariables,
  APITypes.GetInfluencerCandidateQuery
>;
export const getProjectManager = /* GraphQL */ `query GetProjectManager($id: ID!) {
  getProjectManager(id: $id) {
    campaigns {
      nextToken
      __typename
    }
    cognitoId
    createdAt
    email
    firstName
    id
    jobTitle
    lastName
    notes
    phoneNumber
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProjectManagerQueryVariables,
  APITypes.GetProjectManagerQuery
>;
export const getProjectManagerCampaignAssignment = /* GraphQL */ `query GetProjectManagerCampaignAssignment($id: ID!) {
  getProjectManagerCampaignAssignment(id: $id) {
    campaign {
      budget
      campaignManagerId
      createdAt
      id
      notes
      updatedAt
      __typename
    }
    campaignId
    createdAt
    id
    projectManager {
      cognitoId
      createdAt
      email
      firstName
      id
      jobTitle
      lastName
      notes
      phoneNumber
      updatedAt
      __typename
    }
    projectManagerId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProjectManagerCampaignAssignmentQueryVariables,
  APITypes.GetProjectManagerCampaignAssignmentQuery
>;
export const getTimelineEvent = /* GraphQL */ `query GetTimelineEvent($id: ID!) {
  getTimelineEvent(id: $id) {
    assignments {
      nextToken
      __typename
    }
    campaign {
      budget
      campaignManagerId
      createdAt
      id
      notes
      updatedAt
      __typename
    }
    campaignId
    childEvents {
      nextToken
      __typename
    }
    createdAt
    date
    emailTriggers {
      nextToken
      __typename
    }
    eventAssignmentAmount
    eventResources {
      imageDraft
      textDraft
      videoDraft
      __typename
    }
    eventTaskAmount
    eventTitle
    id
    info {
      charLimit
      draftDeadline
      eventLink
      eventPostContent
      instructions
      maxDuration
      topic
      __typename
    }
    isCompleted
    notes
    parentEvent {
      campaignId
      createdAt
      date
      eventAssignmentAmount
      eventTaskAmount
      eventTitle
      id
      isCompleted
      notes
      parentEventId
      status
      timelineEventType
      updatedAt
      __typename
    }
    parentEventId
    status
    targetAudience {
      cities
      country
      industry
      __typename
    }
    timelineEventType
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTimelineEventQueryVariables,
  APITypes.GetTimelineEventQuery
>;
export const listByAssignmentId = /* GraphQL */ `query ListByAssignmentId(
  $assignmentId: ID!
  $filter: ModelEventAssignmentFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listByAssignmentId(
    assignmentId: $assignmentId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      assignmentId
      createdAt
      id
      timelineEventId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByAssignmentIdQueryVariables,
  APITypes.ListByAssignmentIdQuery
>;
export const listByCampaign = /* GraphQL */ `query ListByCampaign(
  $campaignId: ID!
  $filter: ModelTimelineEventFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listByCampaign(
    campaignId: $campaignId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      campaignId
      createdAt
      date
      eventAssignmentAmount
      eventTaskAmount
      eventTitle
      id
      isCompleted
      notes
      parentEventId
      status
      timelineEventType
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByCampaignQueryVariables,
  APITypes.ListByCampaignQuery
>;
export const listByCognitoId = /* GraphQL */ `query ListByCognitoId(
  $cognitoId: String!
  $filter: ModelProjectManagerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listByCognitoId(
    cognitoId: $cognitoId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      cognitoId
      createdAt
      email
      firstName
      id
      jobTitle
      lastName
      notes
      phoneNumber
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByCognitoIdQueryVariables,
  APITypes.ListByCognitoIdQuery
>;
export const listByEvent = /* GraphQL */ `query ListByEvent(
  $eventId: ID!
  $filter: ModelEmailTriggerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listByEvent(
    eventId: $eventId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      active
      createdAt
      date
      emailBodyOverride
      emailLevelOverride
      eventId
      id
      sent
      subjectLineOverride
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByEventQueryVariables,
  APITypes.ListByEventQuery
>;
export const listByTimelineEventId = /* GraphQL */ `query ListByTimelineEventId(
  $filter: ModelEventAssignmentFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $timelineEventId: ID!
) {
  listByTimelineEventId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    timelineEventId: $timelineEventId
  ) {
    items {
      assignmentId
      createdAt
      id
      timelineEventId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListByTimelineEventIdQueryVariables,
  APITypes.ListByTimelineEventIdQuery
>;
export const listCampaigns = /* GraphQL */ `query ListCampaigns(
  $filter: ModelCampaignFilterInput
  $limit: Int
  $nextToken: String
) {
  listCampaigns(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      budget
      campaignManagerId
      createdAt
      id
      notes
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCampaignsQueryVariables,
  APITypes.ListCampaignsQuery
>;
export const listCustomers = /* GraphQL */ `query ListCustomers(
  $filter: ModelCustomerFilterInput
  $limit: Int
  $nextToken: String
) {
  listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      campaignId
      company
      companyPosition
      createdAt
      email
      firstName
      id
      lastName
      linkedinProfile
      notes
      phoneNumber
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCustomersQueryVariables,
  APITypes.ListCustomersQuery
>;
export const listCustomersByCampaign = /* GraphQL */ `query ListCustomersByCampaign(
  $campaignId: ID!
  $filter: ModelCustomerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCustomersByCampaign(
    campaignId: $campaignId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      campaignId
      company
      companyPosition
      createdAt
      email
      firstName
      id
      lastName
      linkedinProfile
      notes
      phoneNumber
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCustomersByCampaignQueryVariables,
  APITypes.ListCustomersByCampaignQuery
>;
export const listEmailTriggers = /* GraphQL */ `query ListEmailTriggers(
  $filter: ModelEmailTriggerFilterInput
  $limit: Int
  $nextToken: String
) {
  listEmailTriggers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      active
      createdAt
      date
      emailBodyOverride
      emailLevelOverride
      eventId
      id
      sent
      subjectLineOverride
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmailTriggersQueryVariables,
  APITypes.ListEmailTriggersQuery
>;
export const listEventAssignments = /* GraphQL */ `query ListEventAssignments(
  $filter: ModelEventAssignmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listEventAssignments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      assignmentId
      createdAt
      id
      timelineEventId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEventAssignmentsQueryVariables,
  APITypes.ListEventAssignmentsQuery
>;
export const listInfluencerAssignments = /* GraphQL */ `query ListInfluencerAssignments(
  $filter: ModelInfluencerAssignmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listInfluencerAssignments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      budget
      campaignId
      createdAt
      id
      influencerId
      isPlaceholder
      placeholderName
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInfluencerAssignmentsQueryVariables,
  APITypes.ListInfluencerAssignmentsQuery
>;
export const listInfluencerCandidates = /* GraphQL */ `query ListInfluencerCandidates(
  $filter: ModelInfluencerCandidateFilterInput
  $limit: Int
  $nextToken: String
) {
  listInfluencerCandidates(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      candidateAssignmentId
      createdAt
      feedback
      id
      influencerId
      invitationSent
      response
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInfluencerCandidatesQueryVariables,
  APITypes.ListInfluencerCandidatesQuery
>;
export const listInfluencers = /* GraphQL */ `query ListInfluencers(
  $filter: ModelInfluencerFilterInput
  $limit: Int
  $nextToken: String
) {
  listInfluencers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      company
      createdAt
      email
      emailType
      firstName
      followers
      id
      industry
      lastName
      linkedinProfile
      notes
      phoneNumber
      position
      topic
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInfluencersQueryVariables,
  APITypes.ListInfluencersQuery
>;
export const listProjectManagerCampaignAssignments = /* GraphQL */ `query ListProjectManagerCampaignAssignments(
  $filter: ModelProjectManagerCampaignAssignmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjectManagerCampaignAssignments(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      campaignId
      createdAt
      id
      projectManagerId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectManagerCampaignAssignmentsQueryVariables,
  APITypes.ListProjectManagerCampaignAssignmentsQuery
>;
export const listProjectManagers = /* GraphQL */ `query ListProjectManagers(
  $filter: ModelProjectManagerFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjectManagers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      cognitoId
      createdAt
      email
      firstName
      id
      jobTitle
      lastName
      notes
      phoneNumber
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectManagersQueryVariables,
  APITypes.ListProjectManagersQuery
>;
export const listTimelineEvents = /* GraphQL */ `query ListTimelineEvents(
  $filter: ModelTimelineEventFilterInput
  $limit: Int
  $nextToken: String
) {
  listTimelineEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      campaignId
      createdAt
      date
      eventAssignmentAmount
      eventTaskAmount
      eventTitle
      id
      isCompleted
      notes
      parentEventId
      status
      timelineEventType
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTimelineEventsQueryVariables,
  APITypes.ListTimelineEventsQuery
>;
