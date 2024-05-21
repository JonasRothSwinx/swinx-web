import Influencer from "../../types/influencer";
import { Candidates } from "../../types/candidates";
import database from "../dbOperations";
import config from "./config";

/**
 * Create new Candidate and update queryClient cache
 * @param influencer The influencer to assign as candidate
 * @param assignmentId The assignment id to link the candidate to
 * @returns The created candidate object
 */

export async function createCandidate(
    influencer: Influencer.Full,
    assignmentId: string
): Promise<Candidates.Candidate> {
    const queryClient = config.getQueryClient();
    const newCandidate: Omit<Candidates.Candidate, "id"> = {
        influencer: influencer,
        response: "pending",
    };
    const id = await database.candidate.create({ candidate: newCandidate, candidateAssignmentId: assignmentId });
    if (!id) throw new Error("Failed to create candidate");
    const createdCandidate: Candidates.Candidate = { ...newCandidate, id };
    queryClient.setQueryData(["candidate", id], createdCandidate);
    queryClient.setQueryData(["candidates", assignmentId], (prev: Candidates.Candidate[]) => {
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

export async function deleteCandidate(candidateId: string, assignmentId: string): Promise<void> {
    const queryClient = config.getQueryClient();
    const { errors } = await database.candidate.delete({ id: candidateId });
    if (errors) {
        console.error(errors);
        throw new Error(JSON.stringify(errors));
    }
    queryClient.setQueryData(["candidates", assignmentId], (prev: Candidates.Candidate[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((candidate) => candidate.id !== candidateId);
    });
    queryClient.refetchQueries({ queryKey: ["candidates", assignmentId] });
    queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
}

/**
 *
 */
const candidate = {
    create: createCandidate,
    delete: deleteCandidate,
};

export default candidate;
