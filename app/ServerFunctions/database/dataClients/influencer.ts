import { database } from "../dbOperations";
import { Influencers } from "../../types";
import { PartialWith } from "@/app/Definitions/types";
import { dataClient } from ".";
import { queryKeys } from "@/app/(main)/queryClient/keys";

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

export const influencer = {
    create: createInfluencer,
    list: listInfluencers,
    update: updateInfluencer,
    delete: deleteInfluencer,
    get: getInfluencer,
    resolveReference: resolveInfluencerReference,
};

/**
 * Create a new influencer
 * @param params The parameters for the create operation
 * @returns The created influencer object
 */
async function createInfluencer(
    influencer: Omit<Influencers.Full, "id">,
): Promise<Influencers.Full> {
    const queryClient = dataClient.config.getQueryClient();
    const id = await database.influencer.create(influencer);
    if (!id) throw new Error("Failed to create influencer");
    const createdInfluencer: Influencers.Full = {
        ...influencer,
        id,
        createdAt: new Date().toISOString(),
    };
    queryClient.setQueryData(queryKeys.influencer.one(id), { createdInfluencer });
    queryClient.setQueryData(queryKeys.influencer.all, (prev: Influencers.Full[]) => {
        if (!prev) {
            return [createdInfluencer];
        }
        return [createdInfluencer, ...prev];
    });
    return createdInfluencer;
}

/**
 * List all influencers
 * @returns The list of influencers
 */
async function listInfluencers(): Promise<Influencers.Full[]> {
    const queryClient = dataClient.config.getQueryClient();
    const influencers = await database.influencer.list();
    influencers.forEach((influencer) => {
        queryClient.setQueryData(queryKeys.influencer.one(influencer.id), influencer);
        // queryClient.refetchQueries({ queryKey: ["influencer", influencer.id] });
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
    updatedData: PartialWith<Influencers.Full, "id">,
    previousInfluencer: Influencers.Full,
): Promise<Influencers.Full> {
    const queryClient = dataClient.config.getQueryClient();
    await database.influencer.update(updatedData);
    const updatedInfluencer = { ...previousInfluencer, ...updatedData };
    queryClient.setQueryData(queryKeys.influencer.one(updatedInfluencer.id), updatedInfluencer);
    queryClient.setQueryData(queryKeys.influencer.all, (prev: Influencers.Full[]) => {
        if (!prev) {
            return [updatedInfluencer];
        }
        return prev.map((influencer) =>
            influencer.id === updatedInfluencer.id ? updatedInfluencer : influencer,
        );
    });
    return updatedInfluencer;
}

/**
 * Delete an influencer
 * @param id The parameters for the delete operation
 */
async function deleteInfluencer(id: string): Promise<void> {
    const queryClient = dataClient.config.getQueryClient();
    if (!id) {
        throw new Error("No ID provided for influencer deletion");
    }
    try {
        await database.influencer.delete({ id });
    } catch (error) {
        console.error(error);
        throw error;
    }
    queryClient.setQueryData(queryKeys.influencer.one(id), undefined);
    queryClient.setQueryData(queryKeys.influencer.all, (prev: Influencers.Full[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((influencer) => influencer.id !== id);
    });
}

/**
 * Get an influencer
 * @param id The parameters for the get operation
 * @returns The influencer object
 */
async function getInfluencer(id: string): Promise<Influencers.Full> {
    const queryClient = dataClient.config.getQueryClient();
    const influencer = await database.influencer.get(id);
    if (!influencer) {
        throw new Error("Influencer not found");
    }
    queryClient.setQueryData(queryKeys.influencer.one(id), influencer);
    return influencer;
}

/**
 * Resolve Influencer Refereence to full object
 * @param influencer The influencer reference
 * @returns The full influencer object
 */
export async function resolveInfluencerReference(
    influencer: Influencers.Reference,
): Promise<Influencers.Full> {
    const queryClient = dataClient.config.getQueryClient();
    const { id } = influencer;
    if (!id) {
        throw new Error("No ID provided for influencer reference");
    }
    // const cachedInfluencer = queryClient.getQueryData(["influencer", id]);
    // if (cachedInfluencer) {
    //     return cachedInfluencer as Influencer.Full;
    // }
    const fullInfluencer = await getInfluencer(id);
    return fullInfluencer;
}
