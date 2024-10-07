import { PartialWith } from "@/app/Definitions/types";
import { randomDesk, randomId } from "@mui/x-data-grid-generator";
import { dataClient } from ".";
import { Assignment, Assignments } from "../../types";
import database from "../dbOperations";

/**
 * Assignment database operations
 * @param create Create a new assignment
 * @param list List all assignments
 */

export const assignment = {
    create: createAssignment,
    list: listAssignments,
    update: updateAssignment,
    delete: deleteAssignment,
    get: getAssignment,
    byCampaign: byCampaign,
    // resolveFull: resolveAssignmentReference,
    // resolveMin: resolveAssignmentReferenceToMin,
};

//Mark: - Create
/**
 * Create a new assignment and update queryClient cache
 * @param assignment The assignment object to create
 * @returns The created assignment object
 */
interface CreateAssignment {
    campaignId: string;
}
async function createAssignment({ campaignId }: CreateAssignment): Promise<Assignment> {
    const tempId = randomId();

    const assignment: Assignment = {
        id: tempId,
        placeholderName: `${randomDesk()}`,
        budget: 0,
        timelineEvents: [],
        isPlaceholder: true,
        influencer: null,
        campaign: { id: campaignId },
    };
    const id = await database.assignment.create(assignment, campaignId);
    if (!id) throw new Error("Failed to create assignment");
    const createdAssignment = { ...assignment, id };
    return createdAssignment;
}

/**
 * List all assignments, resolve Data References and update queryClient cache
 * @returns The list of assignments
 */
async function listAssignments(): Promise<Assignment[]> {
    const queryClient = dataClient.config.getQueryClient();
    //Return cached data if available

    const assignments = await database.assignment.list();
    const resolvedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
            const resolvedAssignment = await resolveAssignmentReferences(assignment);
            queryClient.setQueryData(["assignment", assignment.id], resolvedAssignment);
            queryClient.refetchQueries({ queryKey: ["assignment", assignment.id] });
            return resolvedAssignment;
        }),
    );
    return resolvedAssignments;
}

/**
 * Get an assignment by id
 * @param id The id of the assignment to get
 * @returns The assignment object
 */
async function getAssignment(id: string): Promise<Assignment> {
    const queryClient = dataClient.config.getQueryClient();
    //Return cached data if available
    // const cachedAssignment = queryClient.getQueryData(["assignment", id]) as Assignment.AssignmentFull;
    // if (cachedAssignment) {
    //     return cachedAssignment;
    // }
    const assignment = await database.assignment.get(id);

    const resolvedAssignment = await resolveAssignmentReferences(assignment);
    return resolvedAssignment;
}

/**
 * Update an assignment
 * @param updatedData The updated assignment data
 * @param previousAssignment The assignment object before the update, for updating the cache
 * @returns The updated assignment object
 */

async function updateAssignment(
    updatedData: PartialWith<Assignment, "id">,
    previousAssignment: Assignment,
): Promise<Assignment> {
    const queryClient = dataClient.config.getQueryClient();
    const campaignId = previousAssignment.campaign.id;
    await database.assignment.update(updatedData);
    const updatedAssignment = { ...previousAssignment, ...updatedData };
    queryClient.setQueryData(["assignment", updatedData.id], updatedAssignment);
    queryClient.setQueryData(["assignments", campaignId], (prev: Assignment[]) => {
        if (!prev) {
            return [updatedAssignment];
        }
        return prev.map((assignment) =>
            assignment.id === updatedAssignment.id ? updatedAssignment : assignment,
        );
    });
    queryClient.refetchQueries({ queryKey: ["assignments", campaignId] });
    queryClient.refetchQueries({ queryKey: ["assignment", updatedData.id] });
    return updatedAssignment;
}

/**
 * Delete an assignment
 * @param id The id of the assignment to delete
 * @returns void
 */
async function deleteAssignment(id: string): Promise<void> {
    const queryClient = dataClient.config.getQueryClient();
    await database.assignment.delete({ id });
    queryClient.setQueryData(["assignment", id], undefined);
    queryClient.setQueryData(["assignments"], (prev: Assignment[]) =>
        prev?.filter((assignment) => assignment.id !== id),
    );
    queryClient.refetchQueries({ queryKey: ["assignments"] });
    queryClient.refetchQueries({ queryKey: ["assignment", id] });
}

/**
 *  Get all assignments for a campaign
 * @param campaignId The id of the campaign to get assignments for
 * @returns The list of assignments
 */
async function byCampaign(campaignId: string): Promise<Assignment[]> {
    const queryClient = dataClient.config.getQueryClient();
    //Return cached data if available
    // const cachedAssignments = queryClient.getQueryData(["assignments", campaignId]) as Assignment[];
    // if (cachedAssignments) {
    //     return cachedAssignments;
    // }
    const assignments = await database.assignment.listByCampaign(campaignId);
    const resolvedAssignments = await Promise.all(
        assignments.map(async (assignment) => {
            const resolvedAssignment = await resolveAssignmentReferences(assignment);
            queryClient.setQueryData(["assignment", assignment.id], resolvedAssignment);
            // queryClient.refetchQueries({ queryKey: ["assignment", assignment.id] });
            return resolvedAssignment;
        }),
    );
    return resolvedAssignments;
}

/**
 * Resolve to AssignmentFull
 * @param assignment The assignment to resolve
 * @returns The resolved assignment object
 */

async function resolveAssignmentReferences(assignment: Assignments.Min): Promise<Assignment> {
    const queryClient = dataClient.config.getQueryClient();
    //use cached data if available
    // const cachedAssignment = queryClient.getQueryData(["assignment", assignment.id]) as Assignment.AssignmentFull;
    // if (cachedAssignment) {
    //     return cachedAssignment;
    // }
    const timelineEvents = dataClient.event.list.by.assignment(assignment.id);
    let influencer = null;
    if (assignment.influencer && assignment.influencer.id) {
        influencer = dataClient.influencer.get(assignment.influencer.id);
    }
    const resolvedAssignment: Assignment = {
        ...assignment,
        timelineEvents: await timelineEvents,
        influencer: await influencer,
    };
    return resolvedAssignment;
}

// /**
//  * Resolve all references in an assignement object
//  * @param assignment The assignment object to resolve references in
//  * @param queryClient The query client to use for updating the cache
//  */
// async function resolveAssignmentReferences(
//     assignment: Assignment.AssignmentMin,
//     queryClient: QueryClient,
// ): Promise<Assignment.AssignmentFull> {
//     const tasks: Promise<unknown>[] = [];
//     let influencer = null;
//     if (assignment.influencer && assignment.influencer.id) {
//         influencer = await dataClient.influencer.get(assignment.influencer.id, queryClient);
//     }
//     const timelineEvents = await dataClient.timelineEvent.byAssignment(assignment.id, queryClient);

//     const resolvedAssignment: Assignment.AssignmentFull = {
//         ...assignment,
//         timelineEvents,
//         influencer,
//     };
//     return resolvedAssignment;
// }

// export default assignment;
