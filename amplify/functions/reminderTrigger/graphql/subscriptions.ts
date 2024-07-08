/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCampaign = /* GraphQL */ `subscription OnCreateCampaign($filter: ModelSubscriptionCampaignFilterInput) {
  onCreateCampaign(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCampaignSubscriptionVariables,
  APITypes.OnCreateCampaignSubscription
>;
export const onCreateCustomer = /* GraphQL */ `subscription OnCreateCustomer($filter: ModelSubscriptionCustomerFilterInput) {
  onCreateCustomer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCustomerSubscriptionVariables,
  APITypes.OnCreateCustomerSubscription
>;
export const onCreateEmailTrigger = /* GraphQL */ `subscription OnCreateEmailTrigger(
  $filter: ModelSubscriptionEmailTriggerFilterInput
) {
  onCreateEmailTrigger(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEmailTriggerSubscriptionVariables,
  APITypes.OnCreateEmailTriggerSubscription
>;
export const onCreateEventAssignment = /* GraphQL */ `subscription OnCreateEventAssignment(
  $filter: ModelSubscriptionEventAssignmentFilterInput
) {
  onCreateEventAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEventAssignmentSubscriptionVariables,
  APITypes.OnCreateEventAssignmentSubscription
>;
export const onCreateInfluencer = /* GraphQL */ `subscription OnCreateInfluencer(
  $filter: ModelSubscriptionInfluencerFilterInput
) {
  onCreateInfluencer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateInfluencerSubscriptionVariables,
  APITypes.OnCreateInfluencerSubscription
>;
export const onCreateInfluencerAssignment = /* GraphQL */ `subscription OnCreateInfluencerAssignment(
  $filter: ModelSubscriptionInfluencerAssignmentFilterInput
) {
  onCreateInfluencerAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateInfluencerAssignmentSubscriptionVariables,
  APITypes.OnCreateInfluencerAssignmentSubscription
>;
export const onCreateInfluencerCandidate = /* GraphQL */ `subscription OnCreateInfluencerCandidate(
  $filter: ModelSubscriptionInfluencerCandidateFilterInput
) {
  onCreateInfluencerCandidate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateInfluencerCandidateSubscriptionVariables,
  APITypes.OnCreateInfluencerCandidateSubscription
>;
export const onCreateProjectManager = /* GraphQL */ `subscription OnCreateProjectManager(
  $filter: ModelSubscriptionProjectManagerFilterInput
) {
  onCreateProjectManager(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProjectManagerSubscriptionVariables,
  APITypes.OnCreateProjectManagerSubscription
>;
export const onCreateProjectManagerCampaignAssignment = /* GraphQL */ `subscription OnCreateProjectManagerCampaignAssignment(
  $filter: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput
) {
  onCreateProjectManagerCampaignAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProjectManagerCampaignAssignmentSubscriptionVariables,
  APITypes.OnCreateProjectManagerCampaignAssignmentSubscription
>;
export const onCreateTimelineEvent = /* GraphQL */ `subscription OnCreateTimelineEvent(
  $filter: ModelSubscriptionTimelineEventFilterInput
) {
  onCreateTimelineEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTimelineEventSubscriptionVariables,
  APITypes.OnCreateTimelineEventSubscription
>;
export const onDeleteCampaign = /* GraphQL */ `subscription OnDeleteCampaign($filter: ModelSubscriptionCampaignFilterInput) {
  onDeleteCampaign(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCampaignSubscriptionVariables,
  APITypes.OnDeleteCampaignSubscription
>;
export const onDeleteCustomer = /* GraphQL */ `subscription OnDeleteCustomer($filter: ModelSubscriptionCustomerFilterInput) {
  onDeleteCustomer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCustomerSubscriptionVariables,
  APITypes.OnDeleteCustomerSubscription
>;
export const onDeleteEmailTrigger = /* GraphQL */ `subscription OnDeleteEmailTrigger(
  $filter: ModelSubscriptionEmailTriggerFilterInput
) {
  onDeleteEmailTrigger(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEmailTriggerSubscriptionVariables,
  APITypes.OnDeleteEmailTriggerSubscription
>;
export const onDeleteEventAssignment = /* GraphQL */ `subscription OnDeleteEventAssignment(
  $filter: ModelSubscriptionEventAssignmentFilterInput
) {
  onDeleteEventAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEventAssignmentSubscriptionVariables,
  APITypes.OnDeleteEventAssignmentSubscription
>;
export const onDeleteInfluencer = /* GraphQL */ `subscription OnDeleteInfluencer(
  $filter: ModelSubscriptionInfluencerFilterInput
) {
  onDeleteInfluencer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteInfluencerSubscriptionVariables,
  APITypes.OnDeleteInfluencerSubscription
>;
export const onDeleteInfluencerAssignment = /* GraphQL */ `subscription OnDeleteInfluencerAssignment(
  $filter: ModelSubscriptionInfluencerAssignmentFilterInput
) {
  onDeleteInfluencerAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteInfluencerAssignmentSubscriptionVariables,
  APITypes.OnDeleteInfluencerAssignmentSubscription
>;
export const onDeleteInfluencerCandidate = /* GraphQL */ `subscription OnDeleteInfluencerCandidate(
  $filter: ModelSubscriptionInfluencerCandidateFilterInput
) {
  onDeleteInfluencerCandidate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteInfluencerCandidateSubscriptionVariables,
  APITypes.OnDeleteInfluencerCandidateSubscription
>;
export const onDeleteProjectManager = /* GraphQL */ `subscription OnDeleteProjectManager(
  $filter: ModelSubscriptionProjectManagerFilterInput
) {
  onDeleteProjectManager(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProjectManagerSubscriptionVariables,
  APITypes.OnDeleteProjectManagerSubscription
>;
export const onDeleteProjectManagerCampaignAssignment = /* GraphQL */ `subscription OnDeleteProjectManagerCampaignAssignment(
  $filter: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput
) {
  onDeleteProjectManagerCampaignAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProjectManagerCampaignAssignmentSubscriptionVariables,
  APITypes.OnDeleteProjectManagerCampaignAssignmentSubscription
>;
export const onDeleteTimelineEvent = /* GraphQL */ `subscription OnDeleteTimelineEvent(
  $filter: ModelSubscriptionTimelineEventFilterInput
) {
  onDeleteTimelineEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTimelineEventSubscriptionVariables,
  APITypes.OnDeleteTimelineEventSubscription
>;
export const onUpdateCampaign = /* GraphQL */ `subscription OnUpdateCampaign($filter: ModelSubscriptionCampaignFilterInput) {
  onUpdateCampaign(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCampaignSubscriptionVariables,
  APITypes.OnUpdateCampaignSubscription
>;
export const onUpdateCustomer = /* GraphQL */ `subscription OnUpdateCustomer($filter: ModelSubscriptionCustomerFilterInput) {
  onUpdateCustomer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCustomerSubscriptionVariables,
  APITypes.OnUpdateCustomerSubscription
>;
export const onUpdateEmailTrigger = /* GraphQL */ `subscription OnUpdateEmailTrigger(
  $filter: ModelSubscriptionEmailTriggerFilterInput
) {
  onUpdateEmailTrigger(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEmailTriggerSubscriptionVariables,
  APITypes.OnUpdateEmailTriggerSubscription
>;
export const onUpdateEventAssignment = /* GraphQL */ `subscription OnUpdateEventAssignment(
  $filter: ModelSubscriptionEventAssignmentFilterInput
) {
  onUpdateEventAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEventAssignmentSubscriptionVariables,
  APITypes.OnUpdateEventAssignmentSubscription
>;
export const onUpdateInfluencer = /* GraphQL */ `subscription OnUpdateInfluencer(
  $filter: ModelSubscriptionInfluencerFilterInput
) {
  onUpdateInfluencer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateInfluencerSubscriptionVariables,
  APITypes.OnUpdateInfluencerSubscription
>;
export const onUpdateInfluencerAssignment = /* GraphQL */ `subscription OnUpdateInfluencerAssignment(
  $filter: ModelSubscriptionInfluencerAssignmentFilterInput
) {
  onUpdateInfluencerAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateInfluencerAssignmentSubscriptionVariables,
  APITypes.OnUpdateInfluencerAssignmentSubscription
>;
export const onUpdateInfluencerCandidate = /* GraphQL */ `subscription OnUpdateInfluencerCandidate(
  $filter: ModelSubscriptionInfluencerCandidateFilterInput
) {
  onUpdateInfluencerCandidate(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateInfluencerCandidateSubscriptionVariables,
  APITypes.OnUpdateInfluencerCandidateSubscription
>;
export const onUpdateProjectManager = /* GraphQL */ `subscription OnUpdateProjectManager(
  $filter: ModelSubscriptionProjectManagerFilterInput
) {
  onUpdateProjectManager(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProjectManagerSubscriptionVariables,
  APITypes.OnUpdateProjectManagerSubscription
>;
export const onUpdateProjectManagerCampaignAssignment = /* GraphQL */ `subscription OnUpdateProjectManagerCampaignAssignment(
  $filter: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput
) {
  onUpdateProjectManagerCampaignAssignment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProjectManagerCampaignAssignmentSubscriptionVariables,
  APITypes.OnUpdateProjectManagerCampaignAssignmentSubscription
>;
export const onUpdateTimelineEvent = /* GraphQL */ `subscription OnUpdateTimelineEvent(
  $filter: ModelSubscriptionTimelineEventFilterInput
) {
  onUpdateTimelineEvent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTimelineEventSubscriptionVariables,
  APITypes.OnUpdateTimelineEventSubscription
>;
