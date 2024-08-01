import { Candidates } from "@/app/ServerFunctions/types";
import * as dbOperations from "./dbOperations";
import { Schema } from "@/amplify/data/resource";
import { config } from ".";
import { Task, TimelineEvent } from "./types";
import { sharePostLink } from "./notifyManagers";

export const dataClient = {
    getCandidate,
    getAssignmentData,
    getEventsByAssignment,
    getCampaignInfo,
    getEventInfo,
    processResponse,
    getInfluencerDetails,
    getTaskDetails,
    markEventFinished,
    updateEventStatus,
    submitPostLink,
    getCampaignManagers,
};

interface GetCandidateParams {
    id: string;
}
async function getCandidate({ id }: GetCandidateParams) {
    return await dbOperations.getCandidate({ id });
}

interface GetAssignmentDataParams {
    id: string;
}
async function getAssignmentData({ id }: GetAssignmentDataParams) {
    const asignmentData = await dbOperations.getAssignmentData({ id });
    return asignmentData;
}

interface GetEventsByAssignmentParams {
    id: string;
}
async function getEventsByAssignment({ id }: GetEventsByAssignmentParams) {
    return await dbOperations.getEventsByAssignment({ id });
}

interface GetCampaignInfoParams {
    id: string;
}
async function getCampaignInfo({ id }: GetCampaignInfoParams) {
    return await dbOperations.getCampaignInfo({ id });
}

interface GetEventInfoParams {
    id: string;
}
async function getEventInfo({ id }: GetEventInfoParams) {
    return await dbOperations.getParentEventInfo({ id });
}

interface ProcessResponseParams {
    candidateId: string;
    response: Candidates.candidateResponse;
    feedback?: string;
}
async function processResponse({ response, candidateId, feedback }: ProcessResponseParams) {
    const dbResponse = await dbOperations.processResponse({ response, candidateId, feedback });
}

interface GetInfluencerDetailsParams {
    id: string;
}
async function getInfluencerDetails({ id }: GetInfluencerDetailsParams) {
    return await dbOperations.getInfluencerDetails({ id });
}

interface GetTaskDetailsParams {
    assignmentId: string;
    // campaignId: string;
    // influencerId: string;
}
async function getTaskDetails({
    assignmentId /* , campaignId, influencerId */,
}: GetTaskDetailsParams) {
    return await dbOperations.getTaskDetails({ assignmentId /* , campaignId, influencerId */ });
}

interface MarkEventFinishedParams {
    eventId: string;
    isCompleted: boolean;
}
async function markEventFinished({ eventId, isCompleted }: MarkEventFinishedParams) {
    return await dbOperations.markEventFinished({ eventId, isCompleted: isCompleted });
}

interface UpdateEventStatusParams {
    eventId: string;
    status: Schema["TimelineEvent"]["type"]["status"];
}

async function updateEventStatus({ eventId, status }: UpdateEventStatusParams) {
    const queryClient = config.getQueryClient();
    const dbResponse = dbOperations.updateEventStatus({ eventId, status });
    console.log("updateEventStatus", { eventId, status });
    queryClient.setQueryData<Task>(["task"], (oldData) => {
        if (!oldData) return;
        const newData: Task = {
            ...oldData,
            events: oldData.events.map((event) => {
                if (event.id === eventId) {
                    return {
                        ...event,
                        status,
                    };
                }
                return event;
            }),
        };
        return newData;
    });
    await Promise.all([dbResponse, queryClient.invalidateQueries({ queryKey: ["task"] })]);
}

interface SubmitPostLinkParams {
    eventId: string;
    postLink: string;
    campaignId: string;
}

async function submitPostLink({ eventId, postLink, campaignId }: SubmitPostLinkParams) {
    // console.log("submitPostLink", { eventId, postLink });
    const queryClient = config.getQueryClient();
    // console.log("hi 1!");
    queryClient.setQueryData<Task>(["task"], (oldData) => {
        console.log(oldData);
        if (!oldData) return;
        const newData: Task = {
            ...oldData,
            events: oldData.events.map((event) => {
                if (event.id === eventId) {
                    return {
                        ...event,
                        postLink,
                        status: "COMPLETED",
                    };
                }
                return event;
            }),
        };
        return newData;
    });
    const dbResponse = await dbOperations.submitPostLink({ eventId, postLink });
    // console.log("hi 2!", dbResponse);
    const task = queryClient.getQueryData<Task>(["task"]);
    // console.log("hi 3!");
    if (!task) {
        console.log("task is null", task);
        return;
    }
    const emailResponse = await sharePostLink({
        eventId,
        campaignId,
        postLink,
        task,
    });
    // console.log("submitPostLink", emailResponse);
}

interface GetCampaignManagersParams {
    campaignId: string;
}
async function getCampaignManagers({ campaignId }: GetCampaignManagersParams) {
    return await dbOperations.getCampaignManagers({ campaignId });
}
