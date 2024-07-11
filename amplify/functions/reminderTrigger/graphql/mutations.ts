/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCampaign = /* GraphQL */ `mutation CreateCampaign(
  $condition: ModelCampaignConditionInput
  $input: CreateCampaignInput!
) {
  createCampaign(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCampaignMutationVariables,
  APITypes.CreateCampaignMutation
>;
export const createCustomer = /* GraphQL */ `mutation CreateCustomer(
  $condition: ModelCustomerConditionInput
  $input: CreateCustomerInput!
) {
  createCustomer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCustomerMutationVariables,
  APITypes.CreateCustomerMutation
>;
export const createEmailTrigger = /* GraphQL */ `mutation CreateEmailTrigger(
  $condition: ModelEmailTriggerConditionInput
  $input: CreateEmailTriggerInput!
) {
  createEmailTrigger(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateEmailTriggerMutationVariables,
  APITypes.CreateEmailTriggerMutation
>;
export const createEventAssignment = /* GraphQL */ `mutation CreateEventAssignment(
  $condition: ModelEventAssignmentConditionInput
  $input: CreateEventAssignmentInput!
) {
  createEventAssignment(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    timelineEventId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateEventAssignmentMutationVariables,
  APITypes.CreateEventAssignmentMutation
>;
export const createInfluencer = /* GraphQL */ `mutation CreateInfluencer(
  $condition: ModelInfluencerConditionInput
  $input: CreateInfluencerInput!
) {
  createInfluencer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateInfluencerMutationVariables,
  APITypes.CreateInfluencerMutation
>;
export const createInfluencerAssignment = /* GraphQL */ `mutation CreateInfluencerAssignment(
  $condition: ModelInfluencerAssignmentConditionInput
  $input: CreateInfluencerAssignmentInput!
) {
  createInfluencerAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateInfluencerAssignmentMutationVariables,
  APITypes.CreateInfluencerAssignmentMutation
>;
export const createInfluencerCandidate = /* GraphQL */ `mutation CreateInfluencerCandidate(
  $condition: ModelInfluencerCandidateConditionInput
  $input: CreateInfluencerCandidateInput!
) {
  createInfluencerCandidate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateInfluencerCandidateMutationVariables,
  APITypes.CreateInfluencerCandidateMutation
>;
export const createProjectManager = /* GraphQL */ `mutation CreateProjectManager(
  $condition: ModelProjectManagerConditionInput
  $input: CreateProjectManagerInput!
) {
  createProjectManager(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProjectManagerMutationVariables,
  APITypes.CreateProjectManagerMutation
>;
export const createProjectManagerCampaignAssignment = /* GraphQL */ `mutation CreateProjectManagerCampaignAssignment(
  $condition: ModelProjectManagerCampaignAssignmentConditionInput
  $input: CreateProjectManagerCampaignAssignmentInput!
) {
  createProjectManagerCampaignAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateProjectManagerCampaignAssignmentMutationVariables,
  APITypes.CreateProjectManagerCampaignAssignmentMutation
>;
export const createTimelineEvent = /* GraphQL */ `mutation CreateTimelineEvent(
  $condition: ModelTimelineEventConditionInput
  $input: CreateTimelineEventInput!
) {
  createTimelineEvent(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    parentEventId
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
` as GeneratedMutation<
  APITypes.CreateTimelineEventMutationVariables,
  APITypes.CreateTimelineEventMutation
>;
export const deleteCampaign = /* GraphQL */ `mutation DeleteCampaign(
  $condition: ModelCampaignConditionInput
  $input: DeleteCampaignInput!
) {
  deleteCampaign(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCampaignMutationVariables,
  APITypes.DeleteCampaignMutation
>;
export const deleteCustomer = /* GraphQL */ `mutation DeleteCustomer(
  $condition: ModelCustomerConditionInput
  $input: DeleteCustomerInput!
) {
  deleteCustomer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCustomerMutationVariables,
  APITypes.DeleteCustomerMutation
>;
export const deleteEmailTrigger = /* GraphQL */ `mutation DeleteEmailTrigger(
  $condition: ModelEmailTriggerConditionInput
  $input: DeleteEmailTriggerInput!
) {
  deleteEmailTrigger(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteEmailTriggerMutationVariables,
  APITypes.DeleteEmailTriggerMutation
>;
export const deleteEventAssignment = /* GraphQL */ `mutation DeleteEventAssignment(
  $condition: ModelEventAssignmentConditionInput
  $input: DeleteEventAssignmentInput!
) {
  deleteEventAssignment(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    timelineEventId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteEventAssignmentMutationVariables,
  APITypes.DeleteEventAssignmentMutation
>;
export const deleteInfluencer = /* GraphQL */ `mutation DeleteInfluencer(
  $condition: ModelInfluencerConditionInput
  $input: DeleteInfluencerInput!
) {
  deleteInfluencer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteInfluencerMutationVariables,
  APITypes.DeleteInfluencerMutation
>;
export const deleteInfluencerAssignment = /* GraphQL */ `mutation DeleteInfluencerAssignment(
  $condition: ModelInfluencerAssignmentConditionInput
  $input: DeleteInfluencerAssignmentInput!
) {
  deleteInfluencerAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteInfluencerAssignmentMutationVariables,
  APITypes.DeleteInfluencerAssignmentMutation
>;
export const deleteInfluencerCandidate = /* GraphQL */ `mutation DeleteInfluencerCandidate(
  $condition: ModelInfluencerCandidateConditionInput
  $input: DeleteInfluencerCandidateInput!
) {
  deleteInfluencerCandidate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteInfluencerCandidateMutationVariables,
  APITypes.DeleteInfluencerCandidateMutation
>;
export const deleteProjectManager = /* GraphQL */ `mutation DeleteProjectManager(
  $condition: ModelProjectManagerConditionInput
  $input: DeleteProjectManagerInput!
) {
  deleteProjectManager(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProjectManagerMutationVariables,
  APITypes.DeleteProjectManagerMutation
>;
export const deleteProjectManagerCampaignAssignment = /* GraphQL */ `mutation DeleteProjectManagerCampaignAssignment(
  $condition: ModelProjectManagerCampaignAssignmentConditionInput
  $input: DeleteProjectManagerCampaignAssignmentInput!
) {
  deleteProjectManagerCampaignAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteProjectManagerCampaignAssignmentMutationVariables,
  APITypes.DeleteProjectManagerCampaignAssignmentMutation
>;
export const deleteTimelineEvent = /* GraphQL */ `mutation DeleteTimelineEvent(
  $condition: ModelTimelineEventConditionInput
  $input: DeleteTimelineEventInput!
) {
  deleteTimelineEvent(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    parentEventId
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
` as GeneratedMutation<
  APITypes.DeleteTimelineEventMutationVariables,
  APITypes.DeleteTimelineEventMutation
>;
export const updateCampaign = /* GraphQL */ `mutation UpdateCampaign(
  $condition: ModelCampaignConditionInput
  $input: UpdateCampaignInput!
) {
  updateCampaign(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCampaignMutationVariables,
  APITypes.UpdateCampaignMutation
>;
export const updateCustomer = /* GraphQL */ `mutation UpdateCustomer(
  $condition: ModelCustomerConditionInput
  $input: UpdateCustomerInput!
) {
  updateCustomer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCustomerMutationVariables,
  APITypes.UpdateCustomerMutation
>;
export const updateEmailTrigger = /* GraphQL */ `mutation UpdateEmailTrigger(
  $condition: ModelEmailTriggerConditionInput
  $input: UpdateEmailTriggerInput!
) {
  updateEmailTrigger(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateEmailTriggerMutationVariables,
  APITypes.UpdateEmailTriggerMutation
>;
export const updateEventAssignment = /* GraphQL */ `mutation UpdateEventAssignment(
  $condition: ModelEventAssignmentConditionInput
  $input: UpdateEventAssignmentInput!
) {
  updateEventAssignment(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    timelineEventId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateEventAssignmentMutationVariables,
  APITypes.UpdateEventAssignmentMutation
>;
export const updateInfluencer = /* GraphQL */ `mutation UpdateInfluencer(
  $condition: ModelInfluencerConditionInput
  $input: UpdateInfluencerInput!
) {
  updateInfluencer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateInfluencerMutationVariables,
  APITypes.UpdateInfluencerMutation
>;
export const updateInfluencerAssignment = /* GraphQL */ `mutation UpdateInfluencerAssignment(
  $condition: ModelInfluencerAssignmentConditionInput
  $input: UpdateInfluencerAssignmentInput!
) {
  updateInfluencerAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateInfluencerAssignmentMutationVariables,
  APITypes.UpdateInfluencerAssignmentMutation
>;
export const updateInfluencerCandidate = /* GraphQL */ `mutation UpdateInfluencerCandidate(
  $condition: ModelInfluencerCandidateConditionInput
  $input: UpdateInfluencerCandidateInput!
) {
  updateInfluencerCandidate(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateInfluencerCandidateMutationVariables,
  APITypes.UpdateInfluencerCandidateMutation
>;
export const updateProjectManager = /* GraphQL */ `mutation UpdateProjectManager(
  $condition: ModelProjectManagerConditionInput
  $input: UpdateProjectManagerInput!
) {
  updateProjectManager(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProjectManagerMutationVariables,
  APITypes.UpdateProjectManagerMutation
>;
export const updateProjectManagerCampaignAssignment = /* GraphQL */ `mutation UpdateProjectManagerCampaignAssignment(
  $condition: ModelProjectManagerCampaignAssignmentConditionInput
  $input: UpdateProjectManagerCampaignAssignmentInput!
) {
  updateProjectManagerCampaignAssignment(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateProjectManagerCampaignAssignmentMutationVariables,
  APITypes.UpdateProjectManagerCampaignAssignmentMutation
>;
export const updateTimelineEvent = /* GraphQL */ `mutation UpdateTimelineEvent(
  $condition: ModelTimelineEventConditionInput
  $input: UpdateTimelineEventInput!
) {
  updateTimelineEvent(condition: $condition, input: $input) {
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
      timelineEventType
      updatedAt
      __typename
    }
    parentEventId
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
` as GeneratedMutation<
  APITypes.UpdateTimelineEventMutationVariables,
  APITypes.UpdateTimelineEventMutation
>;
