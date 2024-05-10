"use server";
import { Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplify_outputs.json";
import { cookies } from "next/headers";

const client = generateServerClientUsingCookies<Schema>({ config, cookies, authMode: "apiKey" });

interface GetCandidateParams {
    id: string;
}
export async function getCandidate({ id }: GetCandidateParams) {
    const candidateResponse = await client.models.InfluencerCandidate.get(
        { id },
        { selectionSet: ["id"] },
    );
    console.log({ data: candidateResponse.data, error: JSON.stringify(candidateResponse.errors) });
    return candidateResponse.data;
}
interface GetAssignmentDataParams {
    id: string;
}
export async function getAssignmentData({ id }: GetAssignmentDataParams) {
    const assignmentResponse = await client.models.InfluencerAssignment.get(
        { id },
        {
            selectionSet: [
                //
                "id",
                "budget",
            ],
        },
    );
    // console.log({
    //     data: JSON.stringify(assignmentResponse.data, null, 2),
    //     error: JSON.stringify(assignmentResponse.errors, null, 2),
    // });
    return { data: assignmentResponse.data, errors: assignmentResponse.errors };
}

interface GetEventsByAssignmentParams {
    id: string;
}
export async function getEventsByAssignment({ id }: GetEventsByAssignmentParams) {
    const { data, errors } = await client.models.EventAssignment.listEventAssignmentByAssignmentId(
        {
            assignmentId: id,
        },
        {
            selectionSet: [
                //
                // Information about Event
                "timelineEvent.id",
                "timelineEvent.eventTaskAmount",
                // "timelineEvent.parentEvent.eventTitle",
                "timelineEvent.info.*",
                "timelineEvent.date",
                "timelineEvent.timelineEventType",
            ],
        },
    );
    if (errors) return { data: [], errors: errors };

    const events = data.map((event) => event.timelineEvent);

    return { data: events, errors };
}

interface GetCampaignInfoParams {
    id: string;
}
export async function getCampaignInfo({ id }: GetCampaignInfoParams) {
    const campaignResponse = await client.models.Campaign.get(
        { id },
        {
            selectionSet: [
                //
                "id",
                "customers.company",
            ],
        },
    );
    const dataOut = {
        customerCompany: campaignResponse.data?.customers?.[0]?.company ?? "<Error>",
    };
    return { data: dataOut, errors: JSON.stringify(campaignResponse.errors) };
}
