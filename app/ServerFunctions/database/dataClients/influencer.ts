import database from "../dbOperations";
import Influencer from "../../types/influencer";
import { PartialWith } from "@/app/Definitions/types";
import config from "./config";

/**
 * Create a new influencer
 * @param params The parameters for the create operation
 * @returns The created influencer object
 */
async function createInfluencer(influencer: Omit<Influencer.Full, "id">): Promise<Influencer.Full> {
    const queryClient = config.getQueryClient();
    const id = await database.influencer.create(influencer);
    const createdInfluencer = { ...influencer, id };
    queryClient.setQueryData(["influencer", id], { ...influencer, id });
    queryClient.setQueryData(["influencers"], (prev: Influencer.Full[]) => {
        if (!prev) {
            return [createdInfluencer];
        }
        return [...prev, createdInfluencer];
    });
    queryClient.refetchQueries({ queryKey: ["influencers"] });
    queryClient.refetchQueries({ queryKey: ["influencer", id] });
    return createdInfluencer;
}

/**
 * List all influencers
 * @returns The list of influencers
 */
async function listInfluencers(): Promise<Influencer.Full[]> {
    const queryClient = config.getQueryClient();
    const influencers = await database.influencer.list();
    influencers.forEach((influencer) => {
        queryClient.setQueryData(["influencer", influencer.id], influencer);
        queryClient.refetchQueries({ queryKey: ["influencer", influencer.id] });
    });
    return influencers;
}

/**
 * Update an influencer *
 * @parma updatedData The updated influencer data
 * @param previousInfluencer The previous influencer data
 * @returns The updated influencer object
 */
async function updateInfluencer(
    updatedData: PartialWith<Influencer.Full, "id">,
    previousInfluencer: Influencer.Full,
): Promise<Influencer.Full> {
    const queryClient = config.getQueryClient();
    await database.influencer.update(updatedData);
    const updatedInfluencer = { ...previousInfluencer, ...updatedData };
    queryClient.setQueryData(["influencer", updatedData.id], updatedInfluencer);
    queryClient.setQueryData(["influencers"], (prev: Influencer.Full[]) => {
        if (!prev) {
            return [updatedInfluencer];
        }
        return prev.map((influencer) =>
            influencer.id === updatedInfluencer.id ? updatedInfluencer : influencer,
        );
    });
    queryClient.refetchQueries({ queryKey: ["influencers"] });
    queryClient.refetchQueries({ queryKey: ["influencer", updatedData.id] });
    return updatedInfluencer;
}

/**
 * Delete an influencer
 * @param id The parameters for the delete operation
 */
async function deleteInfluencer(id: string): Promise<void> {
    const queryClient = config.getQueryClient();
    if (!id) {
        throw new Error("No ID provided for influencer deletion");
    }
    try {
        await database.influencer.delete({ id });
    } catch (error) {
        console.error(error);
        throw error;
    }
    queryClient.setQueryData(["influencer", id], undefined);
    queryClient.setQueryData(["influencers"], (prev: Influencer.Full[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((influencer) => influencer.id !== id);
    });
    queryClient.refetchQueries({ queryKey: ["influencers"] });
    queryClient.refetchQueries({ queryKey: ["influencer", id] });
}

/**
 * Get an influencer
 * @param id The parameters for the get operation
 * @returns The influencer object
 */
async function getInfluencer(id: string): Promise<Influencer.Full> {
    const queryClient = config.getQueryClient();
    const influencer = await database.influencer.get(id);
    queryClient.setQueryData(["influencer", id], influencer);
    return influencer;
}

/**
 * Resolve Influencer Refereence to full object
 * @param influencer The influencer reference
 * @returns The full influencer object
 */
export async function resolveInfluencerReference(
    influencer: Influencer.Reference,
): Promise<Influencer.Full> {
    const queryClient = config.getQueryClient();
    const { id } = influencer;
    if (!id) {
        throw new Error("No ID provided for influencer reference");
    }
    const cachedInfluencer = queryClient.getQueryData(["influencer", id]);
    if (cachedInfluencer) {
        return cachedInfluencer as Influencer.Full;
    }
    const fullInfluencer = await getInfluencer(id);
    return fullInfluencer;
}

/**
 * The influencer reference resolver
 * Functions for resolving influencer references
 *
 * @property create             Create a new influencer
 * @property list               List all influencers
 * @property update             Update an influencer
 * @property delete             Delete an influencer
 * @property get                Get an influencer
 * @property resolveReference   Resolve an influencer reference
 */

const influencer = {
    create: createInfluencer,
    list: listInfluencers,
    update: updateInfluencer,
    delete: deleteInfluencer,
    get: getInfluencer,
    resolveReference: resolveInfluencerReference,
};

export default influencer;
