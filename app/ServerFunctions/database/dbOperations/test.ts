"use server";
import { random } from "@mui/x-data-grid-generator";
import client from "./.dbclient";
import database from "./.database";

export async function createTestData() {
    // create Customer
    const { data: customerData, errors: customerErrors } = await client.models.Customer.create({
        firstName: "firstName",
        lastName: "lastName",
        company: "company",
        email: "email@email.email",
        notes: "notes",
    });
    // create Campaign
    const { data: campaignData, errors: campaignErrors } = await client.models.Campaign.create({
        campaignManagerId: "123",
        campaignCustomerId: customerData.id,
        notes: "notes",
    });
    //Create 2 InfluencerAssignment Placeholders
    const influencerAssignmentResponse = await Promise.all(
        Array(2)
            .fill(0)
            .map(async () => {
                return await client.models.InfluencerAssignment.create({
                    isPlaceholder: true,
                    placeholderName: "placeholderName",
                    campaignAssignedInfluencersId: campaignData.id,
                });
            }),
    );
    const influencerAssignmentErrors = influencerAssignmentResponse.map((x) => x.errors);
    const influencerAssignmentData = influencerAssignmentResponse.map((x) => x.data);

    //Create 5 TimelineEvents
    const timelineEventResponse = await Promise.all(
        Array(5)
            .fill(0)
            .map(async () => {
                return await client.models.TimelineEvent.create({
                    timelineEventType: "Invites",
                    date: new Date().toISOString(),
                    notes: "notes",
                    // influencerAssignmentTimelineEventsId: influencerAssignmentData[0].id,
                    campaignCampaignTimelineEventsId: campaignData.id,
                });
            }),
    );
    const timelineEventErrors = timelineEventResponse.map((x) => x.errors);
    const timelineEventData = timelineEventResponse.map((x) => x.data);

    // create connections
    const eventAssignmentsResponse = await Promise.all(
        timelineEventData.map(async (event) => {
            return await client.models.EventAssignments.create({
                influencerAssignmentId: influencerAssignmentData[0].id,
                timelineEventId: event.id,
            });
        }),
    );
    const eventAssignmentsErrors = eventAssignmentsResponse.map((x) => x.errors);
    const eventAssignmentsData = eventAssignmentsResponse.map((x) => x.data);

    return {
        data: JSON.parse(
            JSON.stringify({
                campaignData,
                customerData,
                influencerAssignmentData,
                timelineEventData,
                // eventAssignmentsData,
            }),
        ),
        errors: JSON.parse(
            JSON.stringify({
                campaignErrors: campaignErrors ?? null,
                customerErrors: customerErrors ?? null,
                influencerAssignmentErrors,
                timelineEventErrors,
                // eventAssignmentsErrors,
            }),
        ),
    };
}

export async function wipeTestData() {
    const promises: Promise<unknown>[] = [];
    //find Test Campaigns
    client.models.Campaign.list({
        selectionSet: ["id"],
        filter: { campaignManagerId: { eq: "123" } },
    }).then((campaigns) => {
        for (const campaign of campaigns.data) {
            promises.push(client.models.Campaign.delete({ id: campaign.id }));
        }
    });

    //find Test Customers
    client.models.Customer.list({
        selectionSet: ["id"],
        filter: { firstName: { eq: "firstName" } },
    }).then((customers) => {
        for (const customer of customers.data) {
            promises.push(client.models.Customer.delete({ id: customer.id }));
        }
    });

    //find Test InfluencerAssignments
    client.models.InfluencerAssignment.list({
        selectionSet: ["id"],
        filter: { placeholderName: { eq: "placeholderName" } },
    }).then((influencerAssignments) => {
        for (const influencerAssignment of influencerAssignments.data) {
            promises.push(
                client.models.InfluencerAssignment.delete({ id: influencerAssignment.id }),
            );
        }
    });

    //find and delete test TimelineEvents
    client.models.TimelineEvent.list({
        selectionSet: ["id"],
        filter: { notes: { eq: "notes" } },
    }).then((timelineEvents) => {
        for (const timelineEvent of timelineEvents.data) {
            promises.push(database.timelineEvent.delete({ id: timelineEvent.id }));
        }
    });
    return Promise.all(promises);
}

export async function listCampaignsTest() {
    // const { data, errors } = await client.models.Campaign.list({
    //     // selectionSet: [
    //     //     //
    //     //     "assignedInfluencers.*",
    //     //     "assignedInfluencers.timelineEvents.*",
    //     //     "customer.*",
    //     //     "campaignTimelineEvents.*",
    //     // ],
    //     selectionSet: [
    //         //
    //         "id",
    //         // "campaignType",
    //         "campaignManagerId",
    //         // "campaignStep",
    //         "notes",

    //         "customer.*",

    //         "campaignTimelineEvents.*",
    //         "campaignTimelineEvents.campaign.id",

    //         "campaignTimelineEvents.assignments.*",
    //         // "campaignTimelineEvents.assignments.influencer.id",
    //         // "campaignTimelineEvents.assignments.influencer.firstName",
    //         // "campaignTimelineEvents.assignments.influencer.lastName",

    //         "assignedInfluencers.*",
    //         "assignedInfluencers.candidates.id",
    //         "assignedInfluencers.candidates.response",
    //         "assignedInfluencers.candidates.influencer.id",
    //         "assignedInfluencers.candidates.influencer.firstName",
    //         "assignedInfluencers.candidates.influencer.lastName",
    //         "assignedInfluencers.candidates.influencer.details.id",
    //         "assignedInfluencers.candidates.influencer.details.email",
    //         "assignedInfluencers.influencer.*",
    //         "assignedInfluencers.influencer.details.*",
    //     ],
    //     filter: { campaignManagerId: { eq: "123" } },
    // });
    // return {
    //     data: JSON.parse(JSON.stringify({ data })),
    //     errors: JSON.parse(JSON.stringify({ errors })),
    // };

    const campaigns = await database.campaign.list();
    return campaigns;
}
