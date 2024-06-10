import { Candidates } from "@/app/ServerFunctions/types/candidates";
import * as dbOperations from "./dbOperations";

const dataClient = {
    getCandidate,
    getAssignmentData,
    getEventsByAssignment,
    getCampaignInfo,
    getEventInfo,
    processResponse,
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

export default dataClient;
