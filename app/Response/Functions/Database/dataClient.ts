import * as dbOperations from "./dbOperations";

const dataClient = {
    getCandidate,
    getAssignmentData,
    getEventsByAssignment,
    getCampaignInfo,
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

export default dataClient;
