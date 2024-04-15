import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { campaignTypes, campaignSteps, timelineEventTypes } from "./types.js";
import { sesHandler } from "../functions/sesHandler/resource.js";

const adminsAndManagers = a.allow.specificGroups(["admin", "projektmanager"], "userPools");
const publicRead = a.allow.public().to(["read"]);
const allowSESLambda = a.allow.resource(sesHandler);

const schema = a.schema({
    //##############################################
    //################### Models ###################
    //##############################################
    //#region Influencer

    /**
     * Influencer model
     * @property {string} firstName         - First name of the influencer
     * @property {string} lastName          - Last name of the influencer
     * @property {string} email             - Email of the influencer
     * @property {string} phoneNumber       - Phone number of the influencer
     * @property {string} company           - Company of the influencer
     * @property {string} position          - Position of the influencer
     * @property {string} industry          - Industry branch of the influencer
     * @property {string[]} topic           - Topics of the influencer
     * @property {number} followers         - Number of followers of the influencer
     * @property {string} linkedinProfile   - LinkedIn profile of the influencer
     * @property {string} notes             - Notes about the influencer
     * @property {string} emailType         - Type of email sent to the influencer
     */
    Influencer: a
        .model({
            //#region Contact Information
            firstName: a.string().required().authorization([adminsAndManagers, publicRead]),
            lastName: a.string().required().authorization([adminsAndManagers, publicRead]),
            email: a.email().authorization([adminsAndManagers]),
            phoneNumber: a.string().authorization([adminsAndManagers]),
            //#endregion
            //#region Job information
            company: a.string(),
            position: a.string(),
            industry: a.string(),
            //#endregion
            //#region Social Media
            topic: a.string().array(),
            followers: a.integer(),
            linkedinProfile: a.string(),
            //#endregion
            //#region Notes
            notes: a.string(),
            emailType: a.string().default("new"),
            //#endregion
        })
        .authorization([
            //
            adminsAndManagers,
            a.allow.public().to(["read"]),
        ]),

    /**
     * InfluencerAssignment model - Represents the assignment of an influencer to a campaign
     * @property {Influencer} influencer                - The influencer assigned to the campaign
     * @property {boolean} isPlaceholder                - Whether the assignment is a placeholder
     * @property {string} placeholderName               - Name of the placeholder
     * @property {TimelineEvent[]} timelineEvents       - Timeline events assigned to the influencer
     * @property {InfluencerCandidate[]} candidates     - Candidates for the assignment
     * @property {number} budget                        - Budget for the assignment
     * @property {string} notes                         - Notes about the assignment
     * @property {string} emailType                     - Type of email sent to the influencer
     */
    InfluencerAssignment: a
        .model({
            influencer: a.hasOne("Influencer").authorization([adminsAndManagers]),
            isPlaceholder: a.boolean().required(),
            placeholderName: a.string().authorization([adminsAndManagers]),
            timelineEvents: a.manyToMany("TimelineEvent", { relationName: "EventAssignments" }),
            candidates: a.hasMany("InfluencerCandidate").authorization([adminsAndManagers]),
            budget: a.integer(),
        })
        .authorization([
            a.allow.public().to(["read"]),
            a.allow.specificGroups(["admin", "projektmanager"], "userPools"),
        ]),

    /**
     * InfluencerCandidate model - Represents a candidate for an influencer assignment
     * @property {InfluencerAssignment} assignment      - The assignment the candidate is for
     * @property {Influencer} influencer                - The influencer candidate
     * @property {string} response                      - Response of the influencer
     */
    InfluencerCandidate: a
        .model({
            assignment: a.belongsTo("InfluencerAssignment"),
            influencer: a.hasOne("Influencer"),
            response: a
                .string()
                .authorization([adminsAndManagers, a.allow.public().to(["read", "update"])]),
        })
        .authorization([
            a.allow.public().to(["read"]),
            a.allow.specificGroups(["admin", "projektmanager"], "userPools"),
        ]),
    //#endregion Influencer
    //##############################################

    /**
     * Campaign model - Represents a campaign
     * @property {string} campaignManagerId                   - ID of the campaign manager
     * @property {Customer[]} customers                       - Customers of the campaign
     * @property {BillingAdress} billingAdress                - Billing address of the campaign
     * @property {TimelineEvent[]} campaignTimelineEvents     - Timeline events of the campaign
     * @property {InfluencerAssignment[]} assignedInfluencers - Influencers assigned to the campaign
     * @property {number} budget                              - Budget of the campaign in €
     * @property {string} notes                               - Notes about the campaign
     */
    Campaign: a
        .model({
            campaignManagerId: a.string(),

            customers: a.hasMany("Customer"),
            billingAdress: a.customType({
                name: a.string().required(),
                street: a.string().required(),
                city: a.string().required(),
                zip: a.string().required(),
            }),

            campaignTimelineEvents: a.hasMany("TimelineEvent"),
            assignedInfluencers: a.hasMany("InfluencerAssignment"),
            budget: a.integer(),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    /**
     * Customer model - Represents a contact person for a campaign
     * @property {Campaign} campaign      - Campaign the customer is assigned to
     * @property {string} company         - Company of the customer
     * @property {string} firstName       - First name of the customer
     * @property {string} lastName        - Last name of the customer
     * @property {string} companyPosition - Position in the company
     * @property {string} email           - Email of the customer
     * @property {string} phoneNumber     - Phone number of the customer
     */
    Customer: a
        .model({
            campaign: a.belongsTo("Campaign"),
            company: a.string().required(),
            firstName: a.string().required(),
            lastName: a.string().required(),
            companyPosition: a.string(),
            email: a.email().required(),
            phoneNumber: a.string(),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    // BillingAdress: a
    //     .model({
    //         name: a.string().required(),
    //         street: a.string().required(),
    //         city: a.string().required(),
    //         zip: a.string().required(),
    //     })
    //     .authorization([adminsAndManagers]),

    /**
     * TimelineEvent model - Represents an event in the timeline of a campaign
     * @property {Campaign} campaign                          - Campaign the event is assigned to
     * @property {string} campaignCampaignTimelineEventsId    - ID of the campaign the event is assigned to
     * @property {string} timelineEventType                   - Type of the event
     * @property {InfluencerAssignment[]} assignments         - Influencer assignments for the event
     * @property {number} eventAssignmentAmount               - Number of assignments for the event
     * @property {string} eventTitle                          - Title of the event
     * @property {number} eventTaskAmount                     - Number of tasks for the event
     * @property {Date} date                                  - Date of the event, formatted as ISO string
     * @property {string} notes                               - Notes about the event
     * @property {TimelineEvent[]} relatedEvents              - Related events
     * @property {EmailTrigger[]} emailTriggers               - Email trigger dates for the event
     *
     * @property {object} details                             - Details of the event
     * @property {string} details.topic                       - Topic of the event
     * @property {number} details.charLimit                   - Character limit for text content involved in the event
     * @property {Date} details.draftDeadline                 - Deadline for drafts
     * @property {string} details.instructions                - Instructions for the event
     * @property {number} details.maxDuration                 - Maximum duration of content involved in the event
     */
    TimelineEvent: a
        .model({
            campaign: a.belongsTo("Campaign"),
            campaignCampaignTimelineEventsId: a.id().required(),
            timelineEventType: a.string().required(),
            assignments: a.manyToMany("InfluencerAssignment", { relationName: "EventAssignments" }),
            eventAssignmentAmount: a.integer(),
            eventTitle: a.string(),
            eventTaskAmount: a.integer(),
            date: a.datetime().required(),
            notes: a.string(),
            relatedEvents: a.hasMany("TimelineEvent"),
            emailTriggers: a.hasMany("EmailTrigger"),
            details: a.customType({
                topic: a.string(),
                charLimit: a.integer(),
                draftDeadline: a.datetime(),
                instructions: a.string(),
                maxDuration: a.integer(),
            }),
        })
        .secondaryIndexes((index) => [index("campaignCampaignTimelineEventsId")])
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    /**
     * EmailTrigger model - Represents a trigger for sending an email
     *
     * @property {Date} date           - Date when the email is triggered
     * @property {TimelineEvent} event - Event the email is triggered for
     */
    EmailTrigger: a
        .model({
            date: a.datetime().required(),
            type: a.string().required(),
            event: a.belongsTo("TimelineEvent"),
        })
        .authorization([adminsAndManagers]),
    // EventAssignments: a
    //     .model({
    //         influencerAssignmentId: a.id().required(),
    //         timelineEventId: a.id().required(),
    //     })
    //     .secondaryIndexes((index) => [index("influencerAssignmentId"), index("timelineEventId")])
    //     .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
        // defaultAuthorizationMode: 'apiKey',
        // // API Key is used for a.allow.public() rules
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
