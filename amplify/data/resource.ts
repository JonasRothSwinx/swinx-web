import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { campaignTypes, campaignSteps, timelineEventTypes } from "./types.js";
import { sesHandler } from "../functions/sesHandler/resource.js";

const adminsAndManagers = a.allow.specificGroups(["admin", "projektmanager"], "userPools");
const publicRead = a.allow.public().to(["read"]);
const allowSESLambda = a.allow.resource(sesHandler);

const schema = a.schema({
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

    InfluencerCandidate: a
        .model({
            assignment: a.belongsTo("InfluencerAssignment"),
            influencer: a.hasOne("Influencer"),
            response: a.string().authorization([adminsAndManagers, a.allow.public().to(["read", "update"])]),
        })
        .authorization([
            a.allow.public().to(["read"]),
            a.allow.specificGroups(["admin", "projektmanager"], "userPools"),
        ]),

    Campaign: a
        .model({
            campaignManagerId: a.string(),
            // campaignType: a.string().required(),
            customer: a.hasOne("Customer"),
            billingAdress: a.hasOne("BillingAdress"),
            // webinar: a.hasOne("Webinar"),
            campaignTimelineEvents: a.hasMany("TimelineEvent"),
            assignedInfluencers: a.hasMany("InfluencerAssignment"),
            // campaignStep: a.string().required().default(campaignSteps[0]),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

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
            substitutes: a.hasMany("Customer"),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    BillingAdress: a
        .model({
            name: a.string().required(),
            street: a.string().required(),
            city: a.string().required(),
            zip: a.string().required(),
        })
        .authorization([adminsAndManagers]),

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
            details: a.string(),
        })
        .secondaryIndexes((index) => [index("campaignCampaignTimelineEventsId")])
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    ReminderDate: a
        .model({
            date: a.datetime().required(),
            influencerAssignmentId: a.id().required(),
            timelineEventId: a.id().required(),
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
