import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { campaignTypes, campaignSteps, timelineEventTypes } from "./types.js";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/
const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
        })
        .authorization([
            //
            a.allow.owner(),
            a.allow.specificGroup("admin", "userPools"),
            // a.allow.public(),
        ]),

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
            influencer: a.hasOne("InfluencerPublic"),
            isPlaceholder: a.boolean().required(),
            placeholderName: a.string(),
            timelineEvents: a.hasMany("TimelineEvent"),
            candidates: a.hasMany("InfluencerPublic"),
            budget: a.integer(),
        })
        .authorization([a.allow.specificGroups(["admin", "projektmanager"], "userPools")]),

    Campaign: a
        .model({
            campaignManagerId: a.string(),
            // campaignType: a.string().required(),
            customer: a.hasOne("Customer"),
            // webinar: a.hasOne("Webinar"),
            campaignTimelineEvents: a.hasMany("TimelineEvent"),
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

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
