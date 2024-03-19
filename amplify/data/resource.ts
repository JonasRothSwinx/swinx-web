import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { campaignTypes, campaignSteps, timelineEventTypes } from "./types.js";

const adminsAndManagers = a.allow.specificGroups(["admin", "projektmanager"], "userPools");
const publicRead = a.allow.public().to(["read"]);
const schema = a.schema({
    InfluencerPublic: a
        .model({
            firstName: a.string().required(),
            lastName: a.string().required(),
            topic: a.string().array(),
            details: a.hasOne("InfluencerPrivate").required(),
        })
        .authorization([
            //
            a.allow.public().to(["read"]),
            a.allow.specificGroup("admin", "userPools"),
            a.allow.specificGroup("projektmanager", "userPools").to(["create", "update", "read"]),
        ]),

    InfluencerPrivate: a
        .model({
            email: a.email().required(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    InfluencerAssignment: a
        .model({
            influencer: a.hasOne("InfluencerPublic").authorization([adminsAndManagers]),
            isPlaceholder: a.boolean().required(),
            placeholderName: a.string().authorization([adminsAndManagers]),
            timelineEvents: a.hasMany("TimelineEvent"),
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
            influencer: a.hasOne("InfluencerPublic"),
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
            // webinar: a.hasOne("Webinar"),
            campaignTimelineEvents: a.hasMany("TimelineEvent"),
            staticEvents: a.hasMany("StaticEvent"),
            assignedInfluencers: a.hasMany("InfluencerAssignment"),
            // campaignStep: a.string().required().default(campaignSteps[0]),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    Webinar: a
        .model({
            title: a.string(),
            speaker: a.hasMany("WebinarSpeaker"),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    WebinarSpeaker: a
        .model({
            topic: a.string(),
            influencer: a.hasOne("InfluencerPublic"),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    Customer: a
        .model({
            company: a.string().required(),
            firstName: a.string().required(),
            lastName: a.string().required(),
            companyPosition: a.string(),
            email: a.email().required(),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    TimelineEvent: a
        .model({
            campaign: a.belongsTo("Campaign"),
            timelineEventType: a.string().required(),
            assignment: a.belongsTo("InfluencerAssignment"),
            inviteEvent: a.hasOne("InvitesEvent"),
            webinarEvent: a.hasOne("Webinar"),
            date: a.datetime().required(),
            notes: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    InvitesEvent: a
        .model({
            invites: a.integer().required(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    StaticEvent: a
        .model({
            type: a.string().required(),
            assignments: a.hasMany("InfluencerAssignment"),
            date: a.datetime(),
            notes: a.string(),
            campaign: a.belongsTo("Campaign"),
            // test: a.string(),
            eventAssignmentAmount: a.integer(),
            eventTitle: a.string(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),
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
