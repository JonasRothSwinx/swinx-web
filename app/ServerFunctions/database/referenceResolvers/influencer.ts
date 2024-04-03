import database from "../dbOperations/.database";
import Influencer from "../../types/influencer";
import { QueryClient } from "@tanstack/react-query";
import { resolve } from "path";
import { PartialWith } from "@/app/Definitions/types";

/**
 * Create a new influencer
 * @param params The parameters for the create operation
 * @returns The created influencer object
 */
async function createInfluencer(
    influencer: Omit<Influencer.Full, "id">,
    queryClient: QueryClient,
): Promise<Influencer.Full> {
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
 * @param queryClient The query client to use for updating the cache
 * @returns The list of influencers
 */
async function listInfluencers(queryClient: QueryClient): Promise<Influencer.Full[]> {
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
 * @param queryClient The query client to use for updating the cache
 * @param previousInfluencer The previous influencer data
 * @returns The updated influencer object
 */
async function updateInfluencer(
    updatedData: PartialWith<Influencer.Full, "id">,
    queryClient: QueryClient,
    previousInfluencer: Influencer.Full,
): Promise<Influencer.Full> {
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
 * @param queryClient The query client to use for updating the cache
 */
async function deleteInfluencer(id: string, queryClient: QueryClient): Promise<void> {
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
 * @param queryClient The query client to use for updating the cache
 * @returns The influencer object
 */
async function getInfluencer(id: string, queryClient: QueryClient): Promise<Influencer.Full> {
    const influencer = await database.influencer.get(id);
    queryClient.setQueryData(["influencer", id], influencer);
    return influencer;
}

/**
 * Resolve Influencer Refereence to full object
 * @param influencer The influencer reference
 * @param queryClient The query client to use for updating the cache
 * @returns The full influencer object
 */
export async function resolveInfluencerReference(
    influencer: Influencer.Reference,
    queryClient: QueryClient,
): Promise<Influencer.Full> {
    const { id } = influencer;
    if (!id) {
        throw new Error("No ID provided for influencer reference");
    }
    const cachedInfluencer = queryClient.getQueryData(["influencer", id]);
    if (cachedInfluencer) {
        return cachedInfluencer as Influencer.Full;
    }
    const fullInfluencer = await getInfluencer(id, queryClient);
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
