/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Campaign = {
  __typename: "Campaign",
  assignedInfluencers?: ModelInfluencerAssignmentConnection | null,
  billingAdress?: CampaignBillingAdress | null,
  budget?: number | null,
  campaignManagerId?: string | null,
  createdAt: string,
  customers?: ModelCustomerConnection | null,
  id: string,
  notes?: string | null,
  projectManagers?: ModelProjectManagerCampaignAssignmentConnection | null,
  timelineEvents?: ModelTimelineEventConnection | null,
  updatedAt: string,
};

export type ModelInfluencerAssignmentConnection = {
  __typename: "ModelInfluencerAssignmentConnection",
  items:  Array<InfluencerAssignment | null >,
  nextToken?: string | null,
};

export type InfluencerAssignment = {
  __typename: "InfluencerAssignment",
  budget?: number | null,
  campaign?: Campaign | null,
  campaignId: string,
  candidates?: ModelInfluencerCandidateConnection | null,
  createdAt: string,
  id: string,
  influencer?: Influencer | null,
  influencerId?: string | null,
  isPlaceholder: boolean,
  placeholderName?: string | null,
  timelineEvents?: ModelEventAssignmentConnection | null,
  updatedAt: string,
};

export type ModelInfluencerCandidateConnection = {
  __typename: "ModelInfluencerCandidateConnection",
  items:  Array<InfluencerCandidate | null >,
  nextToken?: string | null,
};

export type InfluencerCandidate = {
  __typename: "InfluencerCandidate",
  assignment?: InfluencerAssignment | null,
  candidateAssignmentId: string,
  createdAt: string,
  feedback?: string | null,
  id: string,
  influencer?: Influencer | null,
  influencerId: string,
  invitationSent?: boolean | null,
  response?: string | null,
  updatedAt: string,
};

export type Influencer = {
  __typename: "Influencer",
  assignments?: ModelInfluencerAssignmentConnection | null,
  candidatures?: ModelInfluencerCandidateConnection | null,
  company?: string | null,
  createdAt: string,
  email: string,
  emailType?: string | null,
  firstName: string,
  followers?: number | null,
  id: string,
  industry?: string | null,
  lastName: string,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
  position?: string | null,
  topic?: Array< string | null > | null,
  updatedAt: string,
};

export type ModelEventAssignmentConnection = {
  __typename: "ModelEventAssignmentConnection",
  items:  Array<EventAssignment | null >,
  nextToken?: string | null,
};

export type EventAssignment = {
  __typename: "EventAssignment",
  assignment?: InfluencerAssignment | null,
  assignmentId: string,
  createdAt: string,
  id: string,
  timelineEvent?: TimelineEvent | null,
  timelineEventId: string,
  updatedAt: string,
};

export type TimelineEvent = {
  __typename: "TimelineEvent",
  assignments?: ModelEventAssignmentConnection | null,
  campaign?: Campaign | null,
  campaignId: string,
  childEvents?: ModelTimelineEventConnection | null,
  createdAt: string,
  date: string,
  emailTriggers?: ModelEmailTriggerConnection | null,
  eventAssignmentAmount?: number | null,
  eventResources?: EventResources | null,
  eventTaskAmount?: number | null,
  eventTitle?: string | null,
  id: string,
  info?: EventInfo | null,
  isCompleted?: boolean | null,
  notes?: string | null,
  parentEvent?: TimelineEvent | null,
  parentEventId?: string | null,
  targetAudience?: FilterOptions | null,
  timelineEventType: string,
  updatedAt: string,
};

export type ModelTimelineEventConnection = {
  __typename: "ModelTimelineEventConnection",
  items:  Array<TimelineEvent | null >,
  nextToken?: string | null,
};

export type ModelEmailTriggerConnection = {
  __typename: "ModelEmailTriggerConnection",
  items:  Array<EmailTrigger | null >,
  nextToken?: string | null,
};

export type EmailTrigger = {
  __typename: "EmailTrigger",
  active: boolean,
  createdAt: string,
  date: string,
  emailBodyOverride?: string | null,
  emailLevelOverride?: string | null,
  event?: TimelineEvent | null,
  eventId: string,
  id: string,
  sent: boolean,
  subjectLineOverride?: string | null,
  type: string,
  updatedAt: string,
};

export type EventResources = {
  __typename: "EventResources",
  imageDraft?: string | null,
  textDraft?: string | null,
  videoDraft?: string | null,
};

export type EventInfo = {
  __typename: "EventInfo",
  charLimit?: number | null,
  draftDeadline?: string | null,
  eventLink?: string | null,
  eventPostContent?: string | null,
  instructions?: string | null,
  maxDuration?: number | null,
  topic?: string | null,
};

export type FilterOptions = {
  __typename: "FilterOptions",
  cities?: Array< string | null > | null,
  country?: Array< string | null > | null,
  industry?: Array< string | null > | null,
};

export type CampaignBillingAdress = {
  __typename: "CampaignBillingAdress",
  city: string,
  name: string,
  street: string,
  zip: string,
};

export type ModelCustomerConnection = {
  __typename: "ModelCustomerConnection",
  items:  Array<Customer | null >,
  nextToken?: string | null,
};

export type Customer = {
  __typename: "Customer",
  campaign?: Campaign | null,
  campaignId: string,
  company?: string | null,
  companyPosition?: string | null,
  createdAt: string,
  email?: string | null,
  firstName?: string | null,
  id: string,
  lastName?: string | null,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
  updatedAt: string,
};

export type ModelProjectManagerCampaignAssignmentConnection = {
  __typename: "ModelProjectManagerCampaignAssignmentConnection",
  items:  Array<ProjectManagerCampaignAssignment | null >,
  nextToken?: string | null,
};

export type ProjectManagerCampaignAssignment = {
  __typename: "ProjectManagerCampaignAssignment",
  campaign?: Campaign | null,
  campaignId: string,
  createdAt: string,
  id: string,
  projectManager?: ProjectManager | null,
  projectManagerId: string,
  updatedAt: string,
};

export type ProjectManager = {
  __typename: "ProjectManager",
  campaigns?: ModelProjectManagerCampaignAssignmentConnection | null,
  cognitoId: string,
  createdAt: string,
  email: string,
  firstName: string,
  id: string,
  jobTitle: string,
  lastName: string,
  notes?: string | null,
  phoneNumber?: string | null,
  updatedAt: string,
};

export type ModelEventAssignmentFilterInput = {
  and?: Array< ModelEventAssignmentFilterInput | null > | null,
  assignmentId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelEventAssignmentFilterInput | null,
  or?: Array< ModelEventAssignmentFilterInput | null > | null,
  timelineEventId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelTimelineEventFilterInput = {
  and?: Array< ModelTimelineEventFilterInput | null > | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  eventAssignmentAmount?: ModelIntInput | null,
  eventTaskAmount?: ModelIntInput | null,
  eventTitle?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isCompleted?: ModelBooleanInput | null,
  not?: ModelTimelineEventFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelTimelineEventFilterInput | null > | null,
  parentEventId?: ModelIDInput | null,
  timelineEventType?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelProjectManagerFilterInput = {
  and?: Array< ModelProjectManagerFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  id?: ModelIDInput | null,
  jobTitle?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  not?: ModelProjectManagerFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelProjectManagerFilterInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelProjectManagerConnection = {
  __typename: "ModelProjectManagerConnection",
  items:  Array<ProjectManager | null >,
  nextToken?: string | null,
};

export type ModelEmailTriggerFilterInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelEmailTriggerFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  emailBodyOverride?: ModelStringInput | null,
  emailLevelOverride?: ModelStringInput | null,
  eventId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  not?: ModelEmailTriggerFilterInput | null,
  or?: Array< ModelEmailTriggerFilterInput | null > | null,
  sent?: ModelBooleanInput | null,
  subjectLineOverride?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCampaignFilterInput = {
  and?: Array< ModelCampaignFilterInput | null > | null,
  budget?: ModelIntInput | null,
  campaignManagerId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelCampaignFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelCampaignFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCampaignConnection = {
  __typename: "ModelCampaignConnection",
  items:  Array<Campaign | null >,
  nextToken?: string | null,
};

export type ModelCustomerFilterInput = {
  and?: Array< ModelCustomerFilterInput | null > | null,
  campaignId?: ModelIDInput | null,
  company?: ModelStringInput | null,
  companyPosition?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  id?: ModelIDInput | null,
  lastName?: ModelStringInput | null,
  linkedinProfile?: ModelStringInput | null,
  not?: ModelCustomerFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelCustomerFilterInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInfluencerAssignmentFilterInput = {
  and?: Array< ModelInfluencerAssignmentFilterInput | null > | null,
  budget?: ModelIntInput | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  influencerId?: ModelIDInput | null,
  isPlaceholder?: ModelBooleanInput | null,
  not?: ModelInfluencerAssignmentFilterInput | null,
  or?: Array< ModelInfluencerAssignmentFilterInput | null > | null,
  placeholderName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInfluencerCandidateFilterInput = {
  and?: Array< ModelInfluencerCandidateFilterInput | null > | null,
  candidateAssignmentId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  id?: ModelIDInput | null,
  influencerId?: ModelIDInput | null,
  invitationSent?: ModelBooleanInput | null,
  not?: ModelInfluencerCandidateFilterInput | null,
  or?: Array< ModelInfluencerCandidateFilterInput | null > | null,
  response?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInfluencerFilterInput = {
  and?: Array< ModelInfluencerFilterInput | null > | null,
  company?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailType?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  followers?: ModelIntInput | null,
  id?: ModelIDInput | null,
  industry?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  linkedinProfile?: ModelStringInput | null,
  not?: ModelInfluencerFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelInfluencerFilterInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  position?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelInfluencerConnection = {
  __typename: "ModelInfluencerConnection",
  items:  Array<Influencer | null >,
  nextToken?: string | null,
};

export type ModelProjectManagerCampaignAssignmentFilterInput = {
  and?: Array< ModelProjectManagerCampaignAssignmentFilterInput | null > | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelProjectManagerCampaignAssignmentFilterInput | null,
  or?: Array< ModelProjectManagerCampaignAssignmentFilterInput | null > | null,
  projectManagerId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCampaignConditionInput = {
  and?: Array< ModelCampaignConditionInput | null > | null,
  budget?: ModelIntInput | null,
  campaignManagerId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelCampaignConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelCampaignConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCampaignInput = {
  billingAdress?: CampaignBillingAdressInput | null,
  budget?: number | null,
  campaignManagerId?: string | null,
  id?: string | null,
  notes?: string | null,
};

export type CampaignBillingAdressInput = {
  city: string,
  name: string,
  street: string,
  zip: string,
};

export type ModelCustomerConditionInput = {
  and?: Array< ModelCustomerConditionInput | null > | null,
  campaignId?: ModelIDInput | null,
  company?: ModelStringInput | null,
  companyPosition?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  linkedinProfile?: ModelStringInput | null,
  not?: ModelCustomerConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelCustomerConditionInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateCustomerInput = {
  campaignId: string,
  company?: string | null,
  companyPosition?: string | null,
  email?: string | null,
  firstName?: string | null,
  id?: string | null,
  lastName?: string | null,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
};

export type ModelEmailTriggerConditionInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelEmailTriggerConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  emailBodyOverride?: ModelStringInput | null,
  emailLevelOverride?: ModelStringInput | null,
  eventId?: ModelIDInput | null,
  not?: ModelEmailTriggerConditionInput | null,
  or?: Array< ModelEmailTriggerConditionInput | null > | null,
  sent?: ModelBooleanInput | null,
  subjectLineOverride?: ModelStringInput | null,
  type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateEmailTriggerInput = {
  active: boolean,
  date: string,
  emailBodyOverride?: string | null,
  emailLevelOverride?: string | null,
  eventId: string,
  id?: string | null,
  sent: boolean,
  subjectLineOverride?: string | null,
  type: string,
};

export type ModelEventAssignmentConditionInput = {
  and?: Array< ModelEventAssignmentConditionInput | null > | null,
  assignmentId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelEventAssignmentConditionInput | null,
  or?: Array< ModelEventAssignmentConditionInput | null > | null,
  timelineEventId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateEventAssignmentInput = {
  assignmentId: string,
  id?: string | null,
  timelineEventId: string,
};

export type ModelInfluencerConditionInput = {
  and?: Array< ModelInfluencerConditionInput | null > | null,
  company?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  emailType?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  followers?: ModelIntInput | null,
  industry?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  linkedinProfile?: ModelStringInput | null,
  not?: ModelInfluencerConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelInfluencerConditionInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  position?: ModelStringInput | null,
  topic?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateInfluencerInput = {
  company?: string | null,
  email: string,
  emailType?: string | null,
  firstName: string,
  followers?: number | null,
  id?: string | null,
  industry?: string | null,
  lastName: string,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
  position?: string | null,
  topic?: Array< string | null > | null,
};

export type ModelInfluencerAssignmentConditionInput = {
  and?: Array< ModelInfluencerAssignmentConditionInput | null > | null,
  budget?: ModelIntInput | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  influencerId?: ModelIDInput | null,
  isPlaceholder?: ModelBooleanInput | null,
  not?: ModelInfluencerAssignmentConditionInput | null,
  or?: Array< ModelInfluencerAssignmentConditionInput | null > | null,
  placeholderName?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateInfluencerAssignmentInput = {
  budget?: number | null,
  campaignId: string,
  id?: string | null,
  influencerId?: string | null,
  isPlaceholder: boolean,
  placeholderName?: string | null,
};

export type ModelInfluencerCandidateConditionInput = {
  and?: Array< ModelInfluencerCandidateConditionInput | null > | null,
  candidateAssignmentId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  feedback?: ModelStringInput | null,
  influencerId?: ModelIDInput | null,
  invitationSent?: ModelBooleanInput | null,
  not?: ModelInfluencerCandidateConditionInput | null,
  or?: Array< ModelInfluencerCandidateConditionInput | null > | null,
  response?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateInfluencerCandidateInput = {
  candidateAssignmentId: string,
  feedback?: string | null,
  id?: string | null,
  influencerId: string,
  invitationSent?: boolean | null,
  response?: string | null,
};

export type ModelProjectManagerConditionInput = {
  and?: Array< ModelProjectManagerConditionInput | null > | null,
  cognitoId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  jobTitle?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  not?: ModelProjectManagerConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelProjectManagerConditionInput | null > | null,
  phoneNumber?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProjectManagerInput = {
  cognitoId: string,
  email: string,
  firstName: string,
  id?: string | null,
  jobTitle: string,
  lastName: string,
  notes?: string | null,
  phoneNumber?: string | null,
};

export type ModelProjectManagerCampaignAssignmentConditionInput = {
  and?: Array< ModelProjectManagerCampaignAssignmentConditionInput | null > | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  not?: ModelProjectManagerCampaignAssignmentConditionInput | null,
  or?: Array< ModelProjectManagerCampaignAssignmentConditionInput | null > | null,
  projectManagerId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateProjectManagerCampaignAssignmentInput = {
  campaignId: string,
  id?: string | null,
  projectManagerId: string,
};

export type ModelTimelineEventConditionInput = {
  and?: Array< ModelTimelineEventConditionInput | null > | null,
  campaignId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  date?: ModelStringInput | null,
  eventAssignmentAmount?: ModelIntInput | null,
  eventTaskAmount?: ModelIntInput | null,
  eventTitle?: ModelStringInput | null,
  isCompleted?: ModelBooleanInput | null,
  not?: ModelTimelineEventConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelTimelineEventConditionInput | null > | null,
  parentEventId?: ModelIDInput | null,
  timelineEventType?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTimelineEventInput = {
  campaignId: string,
  date: string,
  eventAssignmentAmount?: number | null,
  eventResources?: EventResourcesInput | null,
  eventTaskAmount?: number | null,
  eventTitle?: string | null,
  id?: string | null,
  info?: EventInfoInput | null,
  isCompleted?: boolean | null,
  notes?: string | null,
  parentEventId?: string | null,
  targetAudience?: FilterOptionsInput | null,
  timelineEventType: string,
};

export type EventResourcesInput = {
  imageDraft?: string | null,
  textDraft?: string | null,
  videoDraft?: string | null,
};

export type EventInfoInput = {
  charLimit?: number | null,
  draftDeadline?: string | null,
  eventLink?: string | null,
  eventPostContent?: string | null,
  instructions?: string | null,
  maxDuration?: number | null,
  topic?: string | null,
};

export type FilterOptionsInput = {
  cities?: Array< string | null > | null,
  country?: Array< string | null > | null,
  industry?: Array< string | null > | null,
};

export type DeleteCampaignInput = {
  id: string,
};

export type DeleteCustomerInput = {
  id: string,
};

export type DeleteEmailTriggerInput = {
  id: string,
};

export type DeleteEventAssignmentInput = {
  id: string,
};

export type DeleteInfluencerInput = {
  id: string,
};

export type DeleteInfluencerAssignmentInput = {
  id: string,
};

export type DeleteInfluencerCandidateInput = {
  id: string,
};

export type DeleteProjectManagerInput = {
  id: string,
};

export type DeleteProjectManagerCampaignAssignmentInput = {
  id: string,
};

export type DeleteTimelineEventInput = {
  id: string,
};

export type UpdateCampaignInput = {
  billingAdress?: CampaignBillingAdressInput | null,
  budget?: number | null,
  campaignManagerId?: string | null,
  id: string,
  notes?: string | null,
};

export type UpdateCustomerInput = {
  campaignId?: string | null,
  company?: string | null,
  companyPosition?: string | null,
  email?: string | null,
  firstName?: string | null,
  id: string,
  lastName?: string | null,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
};

export type UpdateEmailTriggerInput = {
  active?: boolean | null,
  date?: string | null,
  emailBodyOverride?: string | null,
  emailLevelOverride?: string | null,
  eventId?: string | null,
  id: string,
  sent?: boolean | null,
  subjectLineOverride?: string | null,
  type?: string | null,
};

export type UpdateEventAssignmentInput = {
  assignmentId?: string | null,
  id: string,
  timelineEventId?: string | null,
};

export type UpdateInfluencerInput = {
  company?: string | null,
  email?: string | null,
  emailType?: string | null,
  firstName?: string | null,
  followers?: number | null,
  id: string,
  industry?: string | null,
  lastName?: string | null,
  linkedinProfile?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
  position?: string | null,
  topic?: Array< string | null > | null,
};

export type UpdateInfluencerAssignmentInput = {
  budget?: number | null,
  campaignId?: string | null,
  id: string,
  influencerId?: string | null,
  isPlaceholder?: boolean | null,
  placeholderName?: string | null,
};

export type UpdateInfluencerCandidateInput = {
  candidateAssignmentId?: string | null,
  feedback?: string | null,
  id: string,
  influencerId?: string | null,
  invitationSent?: boolean | null,
  response?: string | null,
};

export type UpdateProjectManagerInput = {
  cognitoId?: string | null,
  email?: string | null,
  firstName?: string | null,
  id: string,
  jobTitle?: string | null,
  lastName?: string | null,
  notes?: string | null,
  phoneNumber?: string | null,
};

export type UpdateProjectManagerCampaignAssignmentInput = {
  campaignId?: string | null,
  id: string,
  projectManagerId?: string | null,
};

export type UpdateTimelineEventInput = {
  campaignId?: string | null,
  date?: string | null,
  eventAssignmentAmount?: number | null,
  eventResources?: EventResourcesInput | null,
  eventTaskAmount?: number | null,
  eventTitle?: string | null,
  id: string,
  info?: EventInfoInput | null,
  isCompleted?: boolean | null,
  notes?: string | null,
  parentEventId?: string | null,
  targetAudience?: FilterOptionsInput | null,
  timelineEventType?: string | null,
};

export type ModelSubscriptionCampaignFilterInput = {
  and?: Array< ModelSubscriptionCampaignFilterInput | null > | null,
  budget?: ModelSubscriptionIntInput | null,
  campaignManagerId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCampaignFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionCustomerFilterInput = {
  and?: Array< ModelSubscriptionCustomerFilterInput | null > | null,
  campaignId?: ModelSubscriptionIDInput | null,
  company?: ModelSubscriptionStringInput | null,
  companyPosition?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  linkedinProfile?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionCustomerFilterInput | null > | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionEmailTriggerFilterInput = {
  active?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionEmailTriggerFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  emailBodyOverride?: ModelSubscriptionStringInput | null,
  emailLevelOverride?: ModelSubscriptionStringInput | null,
  eventId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionEmailTriggerFilterInput | null > | null,
  sent?: ModelSubscriptionBooleanInput | null,
  subjectLineOverride?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionEventAssignmentFilterInput = {
  and?: Array< ModelSubscriptionEventAssignmentFilterInput | null > | null,
  assignmentId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionEventAssignmentFilterInput | null > | null,
  timelineEventId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionInfluencerFilterInput = {
  and?: Array< ModelSubscriptionInfluencerFilterInput | null > | null,
  company?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  emailType?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  followers?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  industry?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  linkedinProfile?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionInfluencerFilterInput | null > | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  position?: ModelSubscriptionStringInput | null,
  topic?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionInfluencerAssignmentFilterInput = {
  and?: Array< ModelSubscriptionInfluencerAssignmentFilterInput | null > | null,
  budget?: ModelSubscriptionIntInput | null,
  campaignId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  influencerId?: ModelSubscriptionIDInput | null,
  isPlaceholder?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionInfluencerAssignmentFilterInput | null > | null,
  placeholderName?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionInfluencerCandidateFilterInput = {
  and?: Array< ModelSubscriptionInfluencerCandidateFilterInput | null > | null,
  candidateAssignmentId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  feedback?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  influencerId?: ModelSubscriptionIDInput | null,
  invitationSent?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionInfluencerCandidateFilterInput | null > | null,
  response?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionProjectManagerFilterInput = {
  and?: Array< ModelSubscriptionProjectManagerFilterInput | null > | null,
  cognitoId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  jobTitle?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionProjectManagerFilterInput | null > | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionProjectManagerCampaignAssignmentFilterInput = {
  and?: Array< ModelSubscriptionProjectManagerCampaignAssignmentFilterInput | null > | null,
  campaignId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionProjectManagerCampaignAssignmentFilterInput | null > | null,
  projectManagerId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTimelineEventFilterInput = {
  and?: Array< ModelSubscriptionTimelineEventFilterInput | null > | null,
  campaignId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  eventAssignmentAmount?: ModelSubscriptionIntInput | null,
  eventTaskAmount?: ModelSubscriptionIntInput | null,
  eventTitle?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isCompleted?: ModelSubscriptionBooleanInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionTimelineEventFilterInput | null > | null,
  parentEventId?: ModelSubscriptionIDInput | null,
  timelineEventType?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetCampaignQueryVariables = {
  id: string,
};

export type GetCampaignQuery = {
  getCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetCustomerQueryVariables = {
  id: string,
};

export type GetCustomerQuery = {
  getCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type GetEmailTriggerQueryVariables = {
  id: string,
};

export type GetEmailTriggerQuery = {
  getEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type GetEventAssignmentQueryVariables = {
  id: string,
};

export type GetEventAssignmentQuery = {
  getEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type GetInfluencerQueryVariables = {
  id: string,
};

export type GetInfluencerQuery = {
  getInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type GetInfluencerAssignmentQueryVariables = {
  id: string,
};

export type GetInfluencerAssignmentQuery = {
  getInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetInfluencerCandidateQueryVariables = {
  id: string,
};

export type GetInfluencerCandidateQuery = {
  getInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type GetProjectManagerQueryVariables = {
  id: string,
};

export type GetProjectManagerQuery = {
  getProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type GetProjectManagerCampaignAssignmentQueryVariables = {
  id: string,
};

export type GetProjectManagerCampaignAssignmentQuery = {
  getProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type GetTimelineEventQueryVariables = {
  id: string,
};

export type GetTimelineEventQuery = {
  getTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type ListByAssignmentIdQueryVariables = {
  assignmentId: string,
  filter?: ModelEventAssignmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListByAssignmentIdQuery = {
  listByAssignmentId?:  {
    __typename: "ModelEventAssignmentConnection",
    items:  Array< {
      __typename: "EventAssignment",
      assignmentId: string,
      createdAt: string,
      id: string,
      timelineEventId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByCampaignQueryVariables = {
  campaignId: string,
  filter?: ModelTimelineEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListByCampaignQuery = {
  listByCampaign?:  {
    __typename: "ModelTimelineEventConnection",
    items:  Array< {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByCognitoIdQueryVariables = {
  cognitoId: string,
  filter?: ModelProjectManagerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListByCognitoIdQuery = {
  listByCognitoId?:  {
    __typename: "ModelProjectManagerConnection",
    items:  Array< {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByEventQueryVariables = {
  eventId: string,
  filter?: ModelEmailTriggerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListByEventQuery = {
  listByEvent?:  {
    __typename: "ModelEmailTriggerConnection",
    items:  Array< {
      __typename: "EmailTrigger",
      active: boolean,
      createdAt: string,
      date: string,
      emailBodyOverride?: string | null,
      emailLevelOverride?: string | null,
      eventId: string,
      id: string,
      sent: boolean,
      subjectLineOverride?: string | null,
      type: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListByTimelineEventIdQueryVariables = {
  filter?: ModelEventAssignmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  timelineEventId: string,
};

export type ListByTimelineEventIdQuery = {
  listByTimelineEventId?:  {
    __typename: "ModelEventAssignmentConnection",
    items:  Array< {
      __typename: "EventAssignment",
      assignmentId: string,
      createdAt: string,
      id: string,
      timelineEventId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCampaignsQueryVariables = {
  filter?: ModelCampaignFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCampaignsQuery = {
  listCampaigns?:  {
    __typename: "ModelCampaignConnection",
    items:  Array< {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCustomersQueryVariables = {
  filter?: ModelCustomerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCustomersQuery = {
  listCustomers?:  {
    __typename: "ModelCustomerConnection",
    items:  Array< {
      __typename: "Customer",
      campaignId: string,
      company?: string | null,
      companyPosition?: string | null,
      createdAt: string,
      email?: string | null,
      firstName?: string | null,
      id: string,
      lastName?: string | null,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCustomersByCampaignQueryVariables = {
  campaignId: string,
  filter?: ModelCustomerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCustomersByCampaignQuery = {
  listCustomersByCampaign?:  {
    __typename: "ModelCustomerConnection",
    items:  Array< {
      __typename: "Customer",
      campaignId: string,
      company?: string | null,
      companyPosition?: string | null,
      createdAt: string,
      email?: string | null,
      firstName?: string | null,
      id: string,
      lastName?: string | null,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListEmailTriggersQueryVariables = {
  filter?: ModelEmailTriggerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEmailTriggersQuery = {
  listEmailTriggers?:  {
    __typename: "ModelEmailTriggerConnection",
    items:  Array< {
      __typename: "EmailTrigger",
      active: boolean,
      createdAt: string,
      date: string,
      emailBodyOverride?: string | null,
      emailLevelOverride?: string | null,
      eventId: string,
      id: string,
      sent: boolean,
      subjectLineOverride?: string | null,
      type: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListEventAssignmentsQueryVariables = {
  filter?: ModelEventAssignmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEventAssignmentsQuery = {
  listEventAssignments?:  {
    __typename: "ModelEventAssignmentConnection",
    items:  Array< {
      __typename: "EventAssignment",
      assignmentId: string,
      createdAt: string,
      id: string,
      timelineEventId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListInfluencerAssignmentsQueryVariables = {
  filter?: ModelInfluencerAssignmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInfluencerAssignmentsQuery = {
  listInfluencerAssignments?:  {
    __typename: "ModelInfluencerAssignmentConnection",
    items:  Array< {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListInfluencerCandidatesQueryVariables = {
  filter?: ModelInfluencerCandidateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInfluencerCandidatesQuery = {
  listInfluencerCandidates?:  {
    __typename: "ModelInfluencerCandidateConnection",
    items:  Array< {
      __typename: "InfluencerCandidate",
      candidateAssignmentId: string,
      createdAt: string,
      feedback?: string | null,
      id: string,
      influencerId: string,
      invitationSent?: boolean | null,
      response?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListInfluencersQueryVariables = {
  filter?: ModelInfluencerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInfluencersQuery = {
  listInfluencers?:  {
    __typename: "ModelInfluencerConnection",
    items:  Array< {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProjectManagerCampaignAssignmentsQueryVariables = {
  filter?: ModelProjectManagerCampaignAssignmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectManagerCampaignAssignmentsQuery = {
  listProjectManagerCampaignAssignments?:  {
    __typename: "ModelProjectManagerCampaignAssignmentConnection",
    items:  Array< {
      __typename: "ProjectManagerCampaignAssignment",
      campaignId: string,
      createdAt: string,
      id: string,
      projectManagerId: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListProjectManagersQueryVariables = {
  filter?: ModelProjectManagerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectManagersQuery = {
  listProjectManagers?:  {
    __typename: "ModelProjectManagerConnection",
    items:  Array< {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTimelineEventsQueryVariables = {
  filter?: ModelTimelineEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTimelineEventsQuery = {
  listTimelineEvents?:  {
    __typename: "ModelTimelineEventConnection",
    items:  Array< {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateCampaignMutationVariables = {
  condition?: ModelCampaignConditionInput | null,
  input: CreateCampaignInput,
};

export type CreateCampaignMutation = {
  createCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateCustomerMutationVariables = {
  condition?: ModelCustomerConditionInput | null,
  input: CreateCustomerInput,
};

export type CreateCustomerMutation = {
  createCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateEmailTriggerMutationVariables = {
  condition?: ModelEmailTriggerConditionInput | null,
  input: CreateEmailTriggerInput,
};

export type CreateEmailTriggerMutation = {
  createEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type CreateEventAssignmentMutationVariables = {
  condition?: ModelEventAssignmentConditionInput | null,
  input: CreateEventAssignmentInput,
};

export type CreateEventAssignmentMutation = {
  createEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type CreateInfluencerMutationVariables = {
  condition?: ModelInfluencerConditionInput | null,
  input: CreateInfluencerInput,
};

export type CreateInfluencerMutation = {
  createInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type CreateInfluencerAssignmentMutationVariables = {
  condition?: ModelInfluencerAssignmentConditionInput | null,
  input: CreateInfluencerAssignmentInput,
};

export type CreateInfluencerAssignmentMutation = {
  createInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateInfluencerCandidateMutationVariables = {
  condition?: ModelInfluencerCandidateConditionInput | null,
  input: CreateInfluencerCandidateInput,
};

export type CreateInfluencerCandidateMutation = {
  createInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateProjectManagerMutationVariables = {
  condition?: ModelProjectManagerConditionInput | null,
  input: CreateProjectManagerInput,
};

export type CreateProjectManagerMutation = {
  createProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateProjectManagerCampaignAssignmentMutationVariables = {
  condition?: ModelProjectManagerCampaignAssignmentConditionInput | null,
  input: CreateProjectManagerCampaignAssignmentInput,
};

export type CreateProjectManagerCampaignAssignmentMutation = {
  createProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type CreateTimelineEventMutationVariables = {
  condition?: ModelTimelineEventConditionInput | null,
  input: CreateTimelineEventInput,
};

export type CreateTimelineEventMutation = {
  createTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type DeleteCampaignMutationVariables = {
  condition?: ModelCampaignConditionInput | null,
  input: DeleteCampaignInput,
};

export type DeleteCampaignMutation = {
  deleteCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteCustomerMutationVariables = {
  condition?: ModelCustomerConditionInput | null,
  input: DeleteCustomerInput,
};

export type DeleteCustomerMutation = {
  deleteCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteEmailTriggerMutationVariables = {
  condition?: ModelEmailTriggerConditionInput | null,
  input: DeleteEmailTriggerInput,
};

export type DeleteEmailTriggerMutation = {
  deleteEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type DeleteEventAssignmentMutationVariables = {
  condition?: ModelEventAssignmentConditionInput | null,
  input: DeleteEventAssignmentInput,
};

export type DeleteEventAssignmentMutation = {
  deleteEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type DeleteInfluencerMutationVariables = {
  condition?: ModelInfluencerConditionInput | null,
  input: DeleteInfluencerInput,
};

export type DeleteInfluencerMutation = {
  deleteInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type DeleteInfluencerAssignmentMutationVariables = {
  condition?: ModelInfluencerAssignmentConditionInput | null,
  input: DeleteInfluencerAssignmentInput,
};

export type DeleteInfluencerAssignmentMutation = {
  deleteInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteInfluencerCandidateMutationVariables = {
  condition?: ModelInfluencerCandidateConditionInput | null,
  input: DeleteInfluencerCandidateInput,
};

export type DeleteInfluencerCandidateMutation = {
  deleteInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteProjectManagerMutationVariables = {
  condition?: ModelProjectManagerConditionInput | null,
  input: DeleteProjectManagerInput,
};

export type DeleteProjectManagerMutation = {
  deleteProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteProjectManagerCampaignAssignmentMutationVariables = {
  condition?: ModelProjectManagerCampaignAssignmentConditionInput | null,
  input: DeleteProjectManagerCampaignAssignmentInput,
};

export type DeleteProjectManagerCampaignAssignmentMutation = {
  deleteProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type DeleteTimelineEventMutationVariables = {
  condition?: ModelTimelineEventConditionInput | null,
  input: DeleteTimelineEventInput,
};

export type DeleteTimelineEventMutation = {
  deleteTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type UpdateCampaignMutationVariables = {
  condition?: ModelCampaignConditionInput | null,
  input: UpdateCampaignInput,
};

export type UpdateCampaignMutation = {
  updateCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateCustomerMutationVariables = {
  condition?: ModelCustomerConditionInput | null,
  input: UpdateCustomerInput,
};

export type UpdateCustomerMutation = {
  updateCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateEmailTriggerMutationVariables = {
  condition?: ModelEmailTriggerConditionInput | null,
  input: UpdateEmailTriggerInput,
};

export type UpdateEmailTriggerMutation = {
  updateEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type UpdateEventAssignmentMutationVariables = {
  condition?: ModelEventAssignmentConditionInput | null,
  input: UpdateEventAssignmentInput,
};

export type UpdateEventAssignmentMutation = {
  updateEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type UpdateInfluencerMutationVariables = {
  condition?: ModelInfluencerConditionInput | null,
  input: UpdateInfluencerInput,
};

export type UpdateInfluencerMutation = {
  updateInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type UpdateInfluencerAssignmentMutationVariables = {
  condition?: ModelInfluencerAssignmentConditionInput | null,
  input: UpdateInfluencerAssignmentInput,
};

export type UpdateInfluencerAssignmentMutation = {
  updateInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateInfluencerCandidateMutationVariables = {
  condition?: ModelInfluencerCandidateConditionInput | null,
  input: UpdateInfluencerCandidateInput,
};

export type UpdateInfluencerCandidateMutation = {
  updateInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateProjectManagerMutationVariables = {
  condition?: ModelProjectManagerConditionInput | null,
  input: UpdateProjectManagerInput,
};

export type UpdateProjectManagerMutation = {
  updateProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateProjectManagerCampaignAssignmentMutationVariables = {
  condition?: ModelProjectManagerCampaignAssignmentConditionInput | null,
  input: UpdateProjectManagerCampaignAssignmentInput,
};

export type UpdateProjectManagerCampaignAssignmentMutation = {
  updateProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type UpdateTimelineEventMutationVariables = {
  condition?: ModelTimelineEventConditionInput | null,
  input: UpdateTimelineEventInput,
};

export type UpdateTimelineEventMutation = {
  updateTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCampaignSubscriptionVariables = {
  filter?: ModelSubscriptionCampaignFilterInput | null,
};

export type OnCreateCampaignSubscription = {
  onCreateCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateCustomerSubscriptionVariables = {
  filter?: ModelSubscriptionCustomerFilterInput | null,
};

export type OnCreateCustomerSubscription = {
  onCreateCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateEmailTriggerSubscriptionVariables = {
  filter?: ModelSubscriptionEmailTriggerFilterInput | null,
};

export type OnCreateEmailTriggerSubscription = {
  onCreateEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEventAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionEventAssignmentFilterInput | null,
};

export type OnCreateEventAssignmentSubscription = {
  onCreateEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInfluencerSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerFilterInput | null,
};

export type OnCreateInfluencerSubscription = {
  onCreateInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreateInfluencerAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerAssignmentFilterInput | null,
};

export type OnCreateInfluencerAssignmentSubscription = {
  onCreateInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateInfluencerCandidateSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerCandidateFilterInput | null,
};

export type OnCreateInfluencerCandidateSubscription = {
  onCreateInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectManagerSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerFilterInput | null,
};

export type OnCreateProjectManagerSubscription = {
  onCreateProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectManagerCampaignAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput | null,
};

export type OnCreateProjectManagerCampaignAssignmentSubscription = {
  onCreateProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTimelineEventSubscriptionVariables = {
  filter?: ModelSubscriptionTimelineEventFilterInput | null,
};

export type OnCreateTimelineEventSubscription = {
  onCreateTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCampaignSubscriptionVariables = {
  filter?: ModelSubscriptionCampaignFilterInput | null,
};

export type OnDeleteCampaignSubscription = {
  onDeleteCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteCustomerSubscriptionVariables = {
  filter?: ModelSubscriptionCustomerFilterInput | null,
};

export type OnDeleteCustomerSubscription = {
  onDeleteCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteEmailTriggerSubscriptionVariables = {
  filter?: ModelSubscriptionEmailTriggerFilterInput | null,
};

export type OnDeleteEmailTriggerSubscription = {
  onDeleteEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEventAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionEventAssignmentFilterInput | null,
};

export type OnDeleteEventAssignmentSubscription = {
  onDeleteEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInfluencerSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerFilterInput | null,
};

export type OnDeleteInfluencerSubscription = {
  onDeleteInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteInfluencerAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerAssignmentFilterInput | null,
};

export type OnDeleteInfluencerAssignmentSubscription = {
  onDeleteInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteInfluencerCandidateSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerCandidateFilterInput | null,
};

export type OnDeleteInfluencerCandidateSubscription = {
  onDeleteInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectManagerSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerFilterInput | null,
};

export type OnDeleteProjectManagerSubscription = {
  onDeleteProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectManagerCampaignAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput | null,
};

export type OnDeleteProjectManagerCampaignAssignmentSubscription = {
  onDeleteProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTimelineEventSubscriptionVariables = {
  filter?: ModelSubscriptionTimelineEventFilterInput | null,
};

export type OnDeleteTimelineEventSubscription = {
  onDeleteTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCampaignSubscriptionVariables = {
  filter?: ModelSubscriptionCampaignFilterInput | null,
};

export type OnUpdateCampaignSubscription = {
  onUpdateCampaign?:  {
    __typename: "Campaign",
    assignedInfluencers?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    billingAdress?:  {
      __typename: "CampaignBillingAdress",
      city: string,
      name: string,
      street: string,
      zip: string,
    } | null,
    budget?: number | null,
    campaignManagerId?: string | null,
    createdAt: string,
    customers?:  {
      __typename: "ModelCustomerConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    notes?: string | null,
    projectManagers?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    timelineEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateCustomerSubscriptionVariables = {
  filter?: ModelSubscriptionCustomerFilterInput | null,
};

export type OnUpdateCustomerSubscription = {
  onUpdateCustomer?:  {
    __typename: "Customer",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    company?: string | null,
    companyPosition?: string | null,
    createdAt: string,
    email?: string | null,
    firstName?: string | null,
    id: string,
    lastName?: string | null,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateEmailTriggerSubscriptionVariables = {
  filter?: ModelSubscriptionEmailTriggerFilterInput | null,
};

export type OnUpdateEmailTriggerSubscription = {
  onUpdateEmailTrigger?:  {
    __typename: "EmailTrigger",
    active: boolean,
    createdAt: string,
    date: string,
    emailBodyOverride?: string | null,
    emailLevelOverride?: string | null,
    event?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    eventId: string,
    id: string,
    sent: boolean,
    subjectLineOverride?: string | null,
    type: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEventAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionEventAssignmentFilterInput | null,
};

export type OnUpdateEventAssignmentSubscription = {
  onUpdateEventAssignment?:  {
    __typename: "EventAssignment",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    assignmentId: string,
    createdAt: string,
    id: string,
    timelineEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    timelineEventId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInfluencerSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerFilterInput | null,
};

export type OnUpdateInfluencerSubscription = {
  onUpdateInfluencer?:  {
    __typename: "Influencer",
    assignments?:  {
      __typename: "ModelInfluencerAssignmentConnection",
      nextToken?: string | null,
    } | null,
    candidatures?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    company?: string | null,
    createdAt: string,
    email: string,
    emailType?: string | null,
    firstName: string,
    followers?: number | null,
    id: string,
    industry?: string | null,
    lastName: string,
    linkedinProfile?: string | null,
    notes?: string | null,
    phoneNumber?: string | null,
    position?: string | null,
    topic?: Array< string | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateInfluencerAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerAssignmentFilterInput | null,
};

export type OnUpdateInfluencerAssignmentSubscription = {
  onUpdateInfluencerAssignment?:  {
    __typename: "InfluencerAssignment",
    budget?: number | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    candidates?:  {
      __typename: "ModelInfluencerCandidateConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId?: string | null,
    isPlaceholder: boolean,
    placeholderName?: string | null,
    timelineEvents?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateInfluencerCandidateSubscriptionVariables = {
  filter?: ModelSubscriptionInfluencerCandidateFilterInput | null,
};

export type OnUpdateInfluencerCandidateSubscription = {
  onUpdateInfluencerCandidate?:  {
    __typename: "InfluencerCandidate",
    assignment?:  {
      __typename: "InfluencerAssignment",
      budget?: number | null,
      campaignId: string,
      createdAt: string,
      id: string,
      influencerId?: string | null,
      isPlaceholder: boolean,
      placeholderName?: string | null,
      updatedAt: string,
    } | null,
    candidateAssignmentId: string,
    createdAt: string,
    feedback?: string | null,
    id: string,
    influencer?:  {
      __typename: "Influencer",
      company?: string | null,
      createdAt: string,
      email: string,
      emailType?: string | null,
      firstName: string,
      followers?: number | null,
      id: string,
      industry?: string | null,
      lastName: string,
      linkedinProfile?: string | null,
      notes?: string | null,
      phoneNumber?: string | null,
      position?: string | null,
      topic?: Array< string | null > | null,
      updatedAt: string,
    } | null,
    influencerId: string,
    invitationSent?: boolean | null,
    response?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectManagerSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerFilterInput | null,
};

export type OnUpdateProjectManagerSubscription = {
  onUpdateProjectManager?:  {
    __typename: "ProjectManager",
    campaigns?:  {
      __typename: "ModelProjectManagerCampaignAssignmentConnection",
      nextToken?: string | null,
    } | null,
    cognitoId: string,
    createdAt: string,
    email: string,
    firstName: string,
    id: string,
    jobTitle: string,
    lastName: string,
    notes?: string | null,
    phoneNumber?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectManagerCampaignAssignmentSubscriptionVariables = {
  filter?: ModelSubscriptionProjectManagerCampaignAssignmentFilterInput | null,
};

export type OnUpdateProjectManagerCampaignAssignmentSubscription = {
  onUpdateProjectManagerCampaignAssignment?:  {
    __typename: "ProjectManagerCampaignAssignment",
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    createdAt: string,
    id: string,
    projectManager?:  {
      __typename: "ProjectManager",
      cognitoId: string,
      createdAt: string,
      email: string,
      firstName: string,
      id: string,
      jobTitle: string,
      lastName: string,
      notes?: string | null,
      phoneNumber?: string | null,
      updatedAt: string,
    } | null,
    projectManagerId: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTimelineEventSubscriptionVariables = {
  filter?: ModelSubscriptionTimelineEventFilterInput | null,
};

export type OnUpdateTimelineEventSubscription = {
  onUpdateTimelineEvent?:  {
    __typename: "TimelineEvent",
    assignments?:  {
      __typename: "ModelEventAssignmentConnection",
      nextToken?: string | null,
    } | null,
    campaign?:  {
      __typename: "Campaign",
      budget?: number | null,
      campaignManagerId?: string | null,
      createdAt: string,
      id: string,
      notes?: string | null,
      updatedAt: string,
    } | null,
    campaignId: string,
    childEvents?:  {
      __typename: "ModelTimelineEventConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    date: string,
    emailTriggers?:  {
      __typename: "ModelEmailTriggerConnection",
      nextToken?: string | null,
    } | null,
    eventAssignmentAmount?: number | null,
    eventResources?:  {
      __typename: "EventResources",
      imageDraft?: string | null,
      textDraft?: string | null,
      videoDraft?: string | null,
    } | null,
    eventTaskAmount?: number | null,
    eventTitle?: string | null,
    id: string,
    info?:  {
      __typename: "EventInfo",
      charLimit?: number | null,
      draftDeadline?: string | null,
      eventLink?: string | null,
      eventPostContent?: string | null,
      instructions?: string | null,
      maxDuration?: number | null,
      topic?: string | null,
    } | null,
    isCompleted?: boolean | null,
    notes?: string | null,
    parentEvent?:  {
      __typename: "TimelineEvent",
      campaignId: string,
      createdAt: string,
      date: string,
      eventAssignmentAmount?: number | null,
      eventTaskAmount?: number | null,
      eventTitle?: string | null,
      id: string,
      isCompleted?: boolean | null,
      notes?: string | null,
      parentEventId?: string | null,
      timelineEventType: string,
      updatedAt: string,
    } | null,
    parentEventId?: string | null,
    targetAudience?:  {
      __typename: "FilterOptions",
      cities?: Array< string | null > | null,
      country?: Array< string | null > | null,
      industry?: Array< string | null > | null,
    } | null,
    timelineEventType: string,
    updatedAt: string,
  } | null,
};
