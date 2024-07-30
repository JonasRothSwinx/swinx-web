"use server";
import { Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplify_outputs.json";
import { cookies } from "next/headers";
import { SelectionSet } from "aws-amplify/api";
import { Candidates } from "@/app/ServerFunctions/types";
import { DeepWriteable, Prettify } from "@/app/Definitions/types";

const client = generateServerClientUsingCookies<Schema>({
    config,
    cookies,
    authMode: "apiKey",
});

interface GetCandidateParams {
    id: string;
}
export async function getCandidate({ id }: GetCandidateParams) {
    const candidateResponse = await client.models.InfluencerCandidate.get({ id }, { selectionSet: ["id", "response"] });
    if (candidateResponse.errors) {
        console.error(candidateResponse.errors);
        throw new Error("Error fetching candidate data");
    }
    if (!candidateResponse.data) {
        return null;
    }
    const responseRaw = candidateResponse.data.response ?? "pending";
    const response = Candidates.isValidResponse(responseRaw) ? responseRaw : "pending";
    const dataOut = {
        id: candidateResponse.data.id,
        response,
    };
    // console.log({ data: candidateResponse.data, error: JSON.stringify(candidateResponse.errors) });
    return dataOut;
}
interface GetAssignmentDataParams {
    id: string;
}
export async function getAssignmentData({ id }: GetAssignmentDataParams) {
    const { data, errors } = await client.models.InfluencerAssignment.get(
        { id },
        {
            selectionSet: [
                //
                "id",
                "budget",
                "campaignId",
                "influencerId",
            ],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching assignment data");
    }
    if (!data) {
        return null;
    }
    const writeable: DeepWriteable<typeof data> = data;
    return writeable;
}

interface GetEventsByAssignmentParams {
    id: string;
}
export async function getEventsByAssignment({ id }: GetEventsByAssignmentParams) {
    const { data, errors } = await client.models.EventAssignment.listByAssignmentId(
        {
            assignmentId: id,
        },
        {
            selectionSet: [
                //
                // Information about Event
                "timelineEvent.id",
            ],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching events data");
    }
    // console.log({
    //     data: JSON.stringify(data, null, 2),
    //     error: JSON.stringify(errors, null, 2),
    // });

    const eventIds = data.map((event) => event.timelineEvent.id);
    const selectionSet = [
        //
        "id",
        "timelineEventType",
        "eventTitle",
        "date",
        "isCompleted",
        "status",

        "info.*",
        "eventTaskAmount",
        "parentEventId",
        "postLink",
    ] as const;
    // const tasks = eventIds.map(async (eventId) => {
    //     const { data: event, errors } = await client.models.TimelineEvent.get(
    //         { id: eventId },
    //         {
    //             selectionSet,
    //         }
    //     );
    //     if (errors) {
    //         console.error(errors);
    //         return null;
    //     }
    //     return event;
    // });
    const { data: tasks, errors: taskErrors } = await client.models.TimelineEvent.list({
        filter: {
            or: eventIds.map((id) => ({ id: { eq: id } })),
        },
        selectionSet,
    });
    if (taskErrors) {
        console.error(taskErrors);
        return [];
    }
    const events =
        /* (await Promise.all(tasks)) */
        tasks.filter(
            (
                event
            ): event is DeepWriteable<
                NonNullable<SelectionSet<Schema["TimelineEvent"]["type"], typeof selectionSet>>
            > => !!event
        );

    return events;
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
        }
    );
    if (campaignResponse.errors) {
        console.error(campaignResponse.errors);
        throw new Error("Error fetching campaign data");
    }
    const dataOut = {
        id: campaignResponse.data?.id ?? "<Error>",
        customerCompany: campaignResponse.data?.customers?.[0]?.company ?? "<Error>",
    };
    return dataOut;
}

//MARK: - Get Event Info
interface GetParentEventInfoParams {
    id: string;
}
export async function getParentEventInfo({ id }: GetParentEventInfoParams) {
    const { data, errors } = await client.models.TimelineEvent.get(
        { id },
        {
            selectionSet: [
                //
                "id",
                "eventTitle",
                "date",
                "targetAudience.*",
                "timelineEventType",
            ],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching event data");
    }
    if (!data) {
        throw new Error("Event not found");
    }
    const writeable: DeepWriteable<typeof data> = data;
    return writeable;
}

//MARK: - Process Response
interface ProcessResponseParams {
    candidateId: string;
    response: Candidates.candidateResponse;
    feedback?: string;
}
export async function processResponse({ response, candidateId, feedback }: ProcessResponseParams) {
    const { data, errors } = await client.models.InfluencerCandidate.update({
        id: candidateId,
        response: response,
        feedback: feedback ?? null,
    });
    if (errors) {
        console.error(errors);
        throw new Error("Error processing response");
    }
    if (!data) {
        return null;
    }
    return data.id;
}

//MARK: - Get Project Managers
interface GetProjectManagerEmailsParams {
    campaignId: string;
}
export async function getProjectManagerEmails({ campaignId }: GetProjectManagerEmailsParams) {
    const { data, errors } = await client.models.Campaign.get(
        { id: campaignId },
        {
            selectionSet: [
                //
                "projectManagers.projectManager.email",
            ],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching project managers");
    }
    if (!data) {
        return [];
    }
    const emails = data.projectManagers.map((pm) => pm.projectManager.email);
    return emails;
}

//MARK: - Get Influencer Details
interface GetInfluencerDetailsParams {
    id: string;
}
export async function getInfluencerDetails({ id }: GetInfluencerDetailsParams) {
    const { data, errors } = await client.models.Influencer.get(
        { id },
        {
            selectionSet: [
                //
                "id",
                "firstName",
                "lastName",
            ],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching influencer details");
    }
    if (!data) {
        throw new Error("Influencer not found");
    }
    const writeable: DeepWriteable<typeof data> = data;
    return writeable;
}

interface GetTaskDetailsParams {
    assignmentId: string;
    campaignId: string;
    influencerId: string;
}
export async function getTaskDetails({ assignmentId, campaignId, influencerId }: GetTaskDetailsParams) {
    const assignmentData = await getAssignmentData({ id: assignmentId });
    const events = await getEventsByAssignment({ id: assignmentId });
    const campaignInfo = await getCampaignInfo({ id: campaignId });
    const influencerInfo = await getInfluencerDetails({ id: influencerId });
    switch (true) {
        case assignmentData?.influencerId !== influencerId:
            throw new Error("Influencer ID does not match assignment data");
        case assignmentData?.campaignId !== campaignId:
            throw new Error("Campaign ID does not match assignment data");
    }
    return {
        assignmentData,
        events,
        campaignInfo,
        influencerInfo,
    };
}

interface MarkeEventFinishedParams {
    eventId: string;
    isCompleted: boolean;
}
export async function markEventFinished({ eventId, isCompleted }: MarkeEventFinishedParams) {
    const { data, errors } = await client.models.TimelineEvent.update({
        id: eventId,
        isCompleted: true,
    });
    if (errors) {
        console.error(errors);
        throw new Error("Error marking event as finished");
    }
    return true;
}

interface UpdateEventStatusParams {
    eventId: string;
    status: Schema["TimelineEvent"]["type"]["status"];
}
export async function updateEventStatus({ eventId, status }: UpdateEventStatusParams) {
    const { data, errors } = await client.models.TimelineEvent.update({
        id: eventId,
        status,
    });
    if (errors) {
        console.error(errors);
        throw new Error("Error updating event status");
    }
    return true;
}

interface SubmitPostLinkParams {
    eventId: string;
    postLink: string;
}

export async function submitPostLink({ eventId, postLink }: SubmitPostLinkParams) {
    const { data, errors } = await client.models.TimelineEvent.update({
        id: eventId,
        postLink,
    });
    if (errors) {
        console.error(errors);
        throw new Error("Error submitting post link");
    }
    return true;
}

interface GetCampaignManagers {
    campaignId: string;
}
export async function getCampaignManagers({ campaignId }: GetCampaignManagers) {
    const { data, errors } = await client.models.Campaign.get(
        {
            id: campaignId,
        },
        {
            selectionSet: ["projectManagers.projectManager.email"],
        }
    );
    if (errors) {
        console.error(errors);
        throw new Error("Error fetching campaign managers");
    }
    if (!data) {
        return [];
    }
    const emails = data.projectManagers.map((pm) => pm.projectManager.email);
    return emails;
}
