import { Candidate, Influencer, Influencers } from "../../types";
import database from "../dbOperations";
import { config } from ".";

/**
 *
 */
export const candidate = {
    create: createCandidate,
    delete: deleteCandidate,
    update: updateCandidate,
};

/**
 * Create new Candidate and update queryClient cache
 * @param influencer The influencer to assign as candidate
 * @param assignmentId The assignment id to link the candidate to
 * @returns The created candidate object
 */

async function createCandidate(
    influencer: Influencers.Full,
    assignmentId: string,
): Promise<Candidate> {
    const queryClient = config.getQueryClient();
    const newCandidate: Omit<Candidate, "id"> = {
        influencer: influencer,
        response: "pending",
        feedback: null,
        invitationSent: false,
    };
    const id = await database.candidate.create({
        candidate: newCandidate,
        candidateAssignmentId: assignmentId,
    });
    if (!id) throw new Error("Failed to create candidate");
    const createdCandidate: Candidate = { ...newCandidate, id };
    queryClient.setQueryData(["candidate", id], createdCandidate);
    queryClient.setQueryData(["candidates", assignmentId], (prev: Candidate[]) => {
        if (!prev) {
            return [createdCandidate];
        }
        return [...prev, createdCandidate];
    });
    queryClient.refetchQueries({ queryKey: ["candidates", assignmentId] });
    queryClient.refetchQueries({ queryKey: ["candidate", id] });
    return createdCandidate;
}

/**
 * Delete a candidate and update queryClient cache
 * @param candidateId The candidate id to delete
 * @param assignmentId The assignment id to link the candidate to
 */

async function deleteCandidate(candidateId: string, assignmentId: string): Promise<void> {
    const queryClient = config.getQueryClient();
    const { errors } = await database.candidate.delete({ id: candidateId });
    if (errors) {
        console.error(errors);
        throw new Error(JSON.stringify(errors));
    }
    queryClient.setQueryData(["candidates", assignmentId], (prev: Candidate[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((candidate) => candidate.id !== candidateId);
    });
    queryClient.refetchQueries({ queryKey: ["candidates", assignmentId] });
    queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
}

interface UpdateCandidateParams {
    candidateId: string;
    updatedValues: Partial<Candidate>;
    previousCandidate: Candidate;
}
/**
 * Update a candidate
 * @param candidateId The candidate id to update
 * @param updatedValues The values to update
 * @param previousCandidate The previous candidate object
 * @returns The updated candidate object
 */
async function updateCandidate({
    candidateId,
    updatedValues,
    previousCandidate,
}: UpdateCandidateParams): Promise<Candidate> {
    // const queryClient = config.getQueryClient();
    const updatedCandidate = { ...previousCandidate, ...updatedValues };
    const { errors } = await database.candidate.update({
        candidateId,
        updatedValues,
    });
    if (errors) {
        console.error(errors);
        throw new Error(JSON.stringify(errors));
    }
    // queryClient.setQueryData(["candidate", candidateId], updatedCandidate);
    // queryClient.setQueryData(["candidates", updatedCandidate.assignmentId], (prev: Candidates.Candidate[]) => {
    //     if (!prev) {
    //         return [updatedCandidate];
    //     }
    //     return prev.map((candidate) => (candidate.id === candidateId ? updatedCandidate : candidate));
    // });
    // queryClient.refetchQueries({ queryKey: ["candidates", updatedCandidate.assignmentId] });
    // queryClient.refetchQueries({ queryKey: ["candidate", candidateId] });
    return updatedCandidate;
}
