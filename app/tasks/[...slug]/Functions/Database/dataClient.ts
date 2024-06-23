import { Candidates } from "@/app/ServerFunctions/types/candidates";
import * as dbOperations from "./dbOperations";

const dataClient = {
    getCandidate,
    getAssignmentData,
    getEventsByAssignment,
    getCampaignInfo,
    getEventInfo,
    processResponse,
    getInfluencerDetails,
    getTaskDetails,
    markEventFinished,
};
export default dataClient;

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
    campaignId: string;
    influencerId: string;
}
async function getTaskDetails({ assignmentId, campaignId, influencerId }: GetTaskDetailsParams) {
    return await dbOperations.getTaskDetails({ assignmentId, campaignId, influencerId });
}

interface MarkEventFinishedParams {
    eventId: string;
    isCompleted: boolean;
}
async function markEventFinished({ eventId, isCompleted }: MarkEventFinishedParams) {
    return await dbOperations.markEventFinished({ eventId, isCompleted: isCompleted });
}
