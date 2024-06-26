// import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// const adminsAndManagers = a.allow.specificGroups(["admin", "projektmanager"], "userPools");
// const publicRead = a.allow.public().to(["read"]);

// const schema = a.schema({
//     //##############################################
//     //################# Custom Types ###############
//     //##############################################
//     EventInfo: a.customType({
//         topic: a.string(),
//         charLimit: a.integer(),
//         draftDeadline: a.datetime(),
//         instructions: a.string(),
//         maxDuration: a.integer(),
//         eventLink: a.string(),
//         eventPostContent: a.string(),
//     }),
//     FilterOptions: a.customType({
//         industry: a.string().array(),
//         country: a.string().array(),
//         cities: a.string().array(),
//     }),

//     //##############################################
//     //################### Models ###################
//     //##############################################
//     //#region Influencer

//     /**
//      * Influencer model
//      * @property {string} firstName         - First name of the influencer
//      * @property {string} lastName          - Last name of the influencer
//      * @property {string} email             - Email of the influencer
//      * @property {string} phoneNumber       - Phone number of the influencer
//      * @property {string} company           - Company of the influencer
//      * @property {string} position          - Position of the influencer
//      * @property {string} industry          - Industry branch of the influencer
//      * @property {string[]} topic           - Topics of the influencer
//      * @property {number} followers         - Number of followers of the influencer
//      * @property {string} linkedinProfile   - LinkedIn profile of the influencer
//      * @property {string} notes             - Notes about the influencer
//      * @property {string} emailType         - Type of email sent to the influencer
//      */
//     Influencer: a
//         .model({
//             //##########################
//             //### Contact Information ##
//             firstName: a.string().required().authorization([adminsAndManagers, publicRead]),
//             lastName: a.string().required().authorization([adminsAndManagers, publicRead]),
//             phoneNumber: a.string().authorization([adminsAndManagers]),
//             email: a.email().authorization([adminsAndManagers]),
//             emailType: a.string().default("new"),
//             //##########################

//             //##########################
//             //#### Job information #####
//             company: a.string(),
//             position: a.string(),
//             industry: a.string(),
//             //##########################

//             //##########################
//             //#### Social Media ########
//             topic: a.string().array(),
//             followers: a.integer(),
//             linkedinProfile: a.string(),
//             //##########################

//             //##########################
//             //# Additional Information #
//             notes: a.string(),
//             //##########################

//             //##########################
//             //##### Relations ##########
//             assignments: a.hasMany("InfluencerAssignment", "influencerId"),

//             candidatures: a.hasMany("InfluencerCandidate", "influencerId"),
//             //##########################
//         })
//         .authorization([
//             //
//             adminsAndManagers,
//             a.allow.public().to(["read"]),
//         ]),

//     /**
//      * InfluencerAssignment model - Represents the assignment of an influencer to a campaign
//      * @property {Influencer} influencer                - The influencer assigned to the campaign
//      * @property {boolean} isPlaceholder                - Whether the assignment is a placeholder
//      * @property {string} placeholderName               - Name of the placeholder
//      * @property {TimelineEvent[]} timelineEvents       - Timeline events assigned to the influencer
//      * @property {InfluencerCandidate[]} candidates     - Candidates for the assignment
//      * @property {number} budget                        - Budget for the assignment
//      * @property {string} notes                         - Notes about the assignment
//      * @property {string} emailType                     - Type of email sent to the influencer
//      */
//     //#region InfluencerAssignment

// InfluencerAssignment: a
//     .model({
//         budget: a.integer(),
//         isPlaceholder: a.boolean().required(),
//         placeholderName: a.string().authorization([adminsAndManagers]),

//         //##########################
//         //### Relations ############
//         influencerId: a.id().authorization([adminsAndManagers]),
//         influencer: a
//             .belongsTo("Influencer", "influencerId")
//             .authorization([adminsAndManagers]),

//         timelineEvents: a.hasMany("EventAssignment", "assignmentId"),

//         campaignId: a.id().required(),
//         campaign: a.belongsTo("Campaign", "campaignId"),

//         candidates: a
//             .hasMany("InfluencerCandidate", "candidateAssignmentId")
//             .authorization([adminsAndManagers]),
//         //##########################
//     })
//     .authorization([publicRead, adminsAndManagers]),
//     //#endregion InfluencerAssignment

//     //#region InfluencerCandidate
//     /**
//      * InfluencerCandidate model - Represents a candidate for an influencer assignment
//      * @property {InfluencerAssignment} assignment      - The assignment the candidate is for
//      * @property {Influencer} influencer                - The influencer candidate
//      * @property {string} response                      - Response of the influencer
//      */

//     InfluencerCandidate: a
//         .model({
//             candidateAssignmentId: a.id().required(),
//             assignment: a.belongsTo("InfluencerAssignment", "candidateAssignmentId"),
//             influencerId: a.id().required(),
//             influencer: a.belongsTo("Influencer", "influencerId"),
//             response: a
//                 .string()
//                 .authorization([adminsAndManagers, a.allow.public().to(["read", "update"])]),
//         })
//         .authorization([
//             a.allow.public().to(["read"]),
//             a.allow.specificGroups(["admin", "projektmanager"], "userPools"),
//         ]),
//     //#endregion InfluencerCandidate

//     //#region EventAssignment
//     /**
//      * EventAssignment model - Join Table for InfluencerAssignment and TimelineEvent many-to-many relation
//      */
//     EventAssignment: a
//         .model({
//             assignmentId: a.id().required(),
//             assignment: a.belongsTo("InfluencerAssignment", "assignmentId"),
//             timelineEventId: a.id().required(),
//             timelineEvent: a.belongsTo("TimelineEvent", "timelineEventId"),
//         })
//         .secondaryIndexes((index) => [index("assignmentId"), index("timelineEventId")])
//         .authorization([
//             publicRead,
//             a.allow.specificGroups(["admin", "projektmanager"], "userPools"),
//         ]),
//     //#endregion EventAssignment
//     //#endregion Influencer
//     //##############################################

//     //#region Campaign
//     /**
//      * Campaign model - Represents a campaign
//      * @property {string} campaignManagerId                   - ID of the campaign manager
//      * @property {Customer[]} customers                       - Customers of the campaign
//      * @property {BillingAdress} billingAdress                - Billing address of the campaign
//      * @property {TimelineEvent[]} campaignTimelineEvents     - Timeline events of the campaign
//      * @property {InfluencerAssignment[]} assignedInfluencers - Influencers assigned to the campaign
//      * @property {number} budget                              - Budget of the campaign in €
//      * @property {string} notes                               - Notes about the campaign
//      */
//     Campaign: a
//         .model({
//             budget: a.integer(),
//             notes: a.string(),

//             billingAdress: a.customType({
//                 name: a.string().required(),
//                 street: a.string().required(),
//                 city: a.string().required(),
//                 zip: a.string().required(),
//             }),

//             customers: a
//                 .hasMany("Customer", "campaignId")
//                 .authorization([publicRead, adminsAndManagers]),
//             timelineEvents: a.hasMany("TimelineEvent", "campaignId"),
//             assignedInfluencers: a.hasMany("InfluencerAssignment", "campaignId"),

//             //##########################
//             //### Relations ############

//             projectManagers: a.hasMany("ProjectManagerCampaignAssignment", "campaignId"),
//         })
//         .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),
//     //#endregion Campaign

//     //#region ProjectManager
//     /**
//      * ProjectManager model - Represents a project manager
//      * @property {string} firstName       - First name of the project manager
//      * @property {string} lastName        - Last name of the project manager
//      * @property {string} email           - Email of the project manager
//      * @property {string} phoneNumber     - Phone number of the project manager
//      * @property {string} notes           - Notes about the project manager
//      */

//     ProjectManager: a
//         .model({
//             firstName: a.string().required(),
//             lastName: a.string().required(),
//             email: a.email().required(),
//             phoneNumber: a.string(),
//             notes: a.string(),

//             campaigns: a.hasMany("ProjectManagerCampaignAssignment", "projectManagerId"),
//         })
//         .authorization([publicRead, adminsAndManagers]),
//     //#endregion ProjectManager

//     //#region ProjectManagerCampaignAssignment

//     /**
//      * ProjectManagerCampaignAssignment model - Represents the assignment of a project manager to a campaign
//      * @property {string} campaignId               - ID of the campaign the project manager is assigned to
//      * @property {string} projectManagerId         - ID of the project manager assigned to the campaign
//      */
//     ProjectManagerCampaignAssignment: a
//         .model({
//             campaignId: a.id().required(),
//             campaign: a.belongsTo("Campaign", "campaignId"),
//             projectManagerId: a.id().required(),
//             projectManager: a.belongsTo("ProjectManager", "projectManagerId"),
//         })
//         .authorization([publicRead, adminsAndManagers]),
//     //#region Customer
//     /**
//      * Customer model - Represents a contact person for a campaign
//      * @property {Campaign} campaign      - Campaign the customer is assigned to
//      * @property {string} campaignId      - ID of the campaign the customer is assigned to
//      * @property {string} company         - Company of the customer
//      * @property {string} firstName       - First name of the customer
//      * @property {string} lastName        - Last name of the customer
//      * @property {string} companyPosition - Position in the company
//      * @property {string} email           - Email of the customer
//      * @property {string} phoneNumber     - Phone number of the customer
//      * @property {string} notes           - Notes about the customer
//      * @property {string} profileLink     - Link to the customer's LinkedIn profile
//      */
//     Customer: a
//         .model({
//             company: a.string().authorization([publicRead, adminsAndManagers]),
//             firstName: a.string(),
//             lastName: a.string(),
//             companyPosition: a.string(),
//             email: a.email(),
//             phoneNumber: a.string(),
//             notes: a.string(),
//             linkedinProfile: a.string().authorization([publicRead, adminsAndManagers]),

//             //##### Relations #####
//             campaignId: a.id(),
//             campaign: a.belongsTo("Campaign", "campaignId"),
//             //#####################
//         })
//         .secondaryIndexes((index) => [index("campaignId").queryField("listCustomersByCampaign")])
//         .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),
//     //#endregion Customer

//     //#region TimelineEvent
//     /**
//      * TimelineEvent model - Represents an event in the timeline of a campaign
//      * @property {Campaign} campaign                          - Campaign the event is assigned to
//      * @property {string} campaignCampaignTimelineEventsId    - ID of the campaign the event is assigned to
//      * @property {string} timelineEventType                   - Type of the event
//      * @property {InfluencerAssignment[]} assignments         - Influencer assignments for the event
//      * @property {number} eventAssignmentAmount               - Number of assignments for the event
//      * @property {string} eventTitle                          - Title of the event
//      * @property {number} eventTaskAmount                     - Number of tasks for the event
//      * @property {Date} date                                  - Date of the event, formatted as ISO string
//      * @property {string} notes                               - Notes about the event
//      * @property {TimelineEvent[]} relatedEvents              - Related events
//      * @property {EmailTrigger[]} emailTriggers               - Email trigger dates for the event
//      *
//      * @property {object} info                             - Details of the event
//      * @property {string} info.topic                       - Topic of the event
//      * @property {number} info.charLimit                   - Character limit for text content involved in the event
//      * @property {Date} info.draftDeadline                 - Deadline for drafts
//      * @property {string} info.instructions                - Instructions for the event
//      * @property {number} info.maxDuration                 - Maximum duration of content involved in the event
//      * @property {string} info.eventLink                   - Link to the event
//      */
//     TimelineEvent: a
//         .model({
//             timelineEventType: a.string().required(),
//             eventAssignmentAmount: a.integer(),
//             eventTitle: a.string(),
//             eventTaskAmount: a.integer(),
//             date: a.datetime().required(),
//             notes: a.string(),
//             info: a.ref("EventInfo"),

//             targetAudience: a.ref("FilterOptions"),

//             //####################
//             //###  Relations  ####
//             //####################

//             campaignId: a.id().required(),
//             campaign: a.belongsTo("Campaign", "campaignId"),

//             //####################

//             assignments: a.hasMany("EventAssignment", "timelineEventId"),

//             //####################

//             parentEventId: a.id(),
//             parentEvent: a.belongsTo("TimelineEvent", "parentEventId"),
//             relatedEvents: a.hasMany("TimelineEvent", "parentEventId"),

//             //####################

//             emailTriggers: a.hasMany("EmailTrigger", "eventId"),
//         })
//         .secondaryIndexes((index) => [index("campaignId").queryField("listByCampaign")])
//         .authorization([publicRead, adminsAndManagers]),
//     //#endregion TimelineEvent

//     //#region EmailTrigger
//     /**
//      * EmailTrigger model - Represents a trigger for sending an email
//      *
//      * @property {Date} date           - Date when the email is triggered
//      * @property {string} type         - Type of the email
//      *
//      * State
//      * @property {boolean} active      - Whether the email trigger is active
//      * @property {boolean} sent        - Whether the email has been sent
//      *
//      * Overrides
//      * @property {string} emailLevelOverride    - Override for the email level
//      * @property {string} subjectLineOverride   - Override for the email subject line
//      * @property {string} emailBodyOverride     - Override for the email body
//      *
//      * Relations
//      * @property {string} eventId       - ID of the event the email is triggered for
//      * @property {TimelineEvent} event  - Event the email is triggered for
//      */
//     EmailTrigger: a
//         .model({
//             date: a.datetime().required(),
//             type: a.string().required(),

//             //####################
//             //##### State ########
//             //####################
//             active: a.boolean().required(),
//             sent: a.boolean().required(),
//             //####################

//             //####################
//             //##### Overrides ####
//             //####################
//             emailLevelOverride: a.string(),
//             subjectLineOverride: a.string(),
//             emailBodyOverride: a.string(),
//             //####################

//             //####################
//             //##### Relations ####
//             //####################
//             eventId: a.id().required(),
//             event: a.belongsTo("TimelineEvent", "eventId"),
//             //####################
//         })
//         .secondaryIndexes((index) => [index("eventId").queryField("listByEvent")])
//         .authorization([adminsAndManagers]),
//     //#endregion EmailTrigger
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//     schema,
//     authorizationModes: {
//         defaultAuthorizationMode: "userPool",
//         // defaultAuthorizationMode: 'apiKey',
//         // // API Key is used for a.allow.public() rules
//         apiKeyAuthorizationMode: {
//             expiresInDays: 30,
//         },
//     },
// });
