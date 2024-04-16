"use server";

import client from "./.dbclient";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { PartialWith } from "@/app/Definitions/types";
import { Schema } from "@/amplify/data/resource";
import { EmailTriggers } from "../../types/emailTriggers";

/**
 * Create a new influencer
 * @param influencer The influencer object to create
 * @returns The ID of the created influencer
 */
export async function createNewInfluencer(
    influencer: Omit<Influencer.Full, "id">,
): Promise<string> {
    //unpacked all properties from influencer
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        companyPosition: position,
        industry,
        topic,
        followers,
        linkedinProfile,
    } = influencer;
    if (!(firstName && lastName && email)) {
        throw new Error("First name, last name, and email are required for influencer creation");
    }
    const { data, errors } = await client.models.Influencer.create({
        //Contact Information
        firstName,
        lastName,
        email,
        phoneNumber,

        //Job Information
        company,
        position,
        industry,

        //Social Media
        topic,
        followers,
        linkedinProfile,
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    return data.id;
}

export async function getInfluencer(id: string) {
    const { data, errors } = await client.models.Influencer.get({ id });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    if (!data) {
        throw new Error("Influencer not found");
    }
    const influencer = await validateInfluencer(data);
    return influencer;
}

export async function updateInfluencer(updatedData: PartialWith<Influencer.Full, "id">) {
    const {
        id,
        firstName,
        lastName,
        email,
        emailLevel,
        phoneNumber,
        company,
        companyPosition: position,
        industry,
        topic,
        followers,
        linkedinProfile,
    } = updatedData;
    if (!id) {
        throw new Error("No ID provided for influencer update");
    }
    const newInfluencer = {
        id,
        firstName,
        lastName,
        email,
        emailType: emailLevel,
        phoneNumber,
        company,
        position,
        industry,
        topic,
        followers,
        linkedinProfile,
    };
    const { data, errors } = await client.models.Influencer.update({
        ...newInfluencer,
    });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    // const updatedInfluencer = validateInfluencer(data);
    // return updatedInfluencer;
}

export async function deleteInfluencer(
    influencer: PartialWith<Influencer.Influencer, "id">,
): Promise<void> {
    const { id } = influencer;

    if (!id) {
        throw new Error("No ID provided for influencer deletion");
    }
    const { data, errors } = await client.models.Influencer.delete({ id });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    return;
}

export async function listInfluencers() {
    const { data } = await client.models.Influencer.list({});
    const dataOut = await Promise.all(data.map((influencer) => validateInfluencer(influencer)));
    return dataOut;
}

async function validateInfluencer(influencerRaw: Schema["Influencer"]) {
    if (!influencerRaw) {
        throw new Error("Influencer not found");
    }
    if (!influencerRaw.email) {
        throw new Error("Email is required for influencer");
    }
    let emailType: EmailTriggers.emailLevel = "new";
    if (influencerRaw.emailType && EmailTriggers.isValidEmailType(influencerRaw.emailType)) {
        emailType = influencerRaw.emailType;
    }
    const influencerOut: Influencer.Full = {
        id: influencerRaw.id,
        firstName: influencerRaw.firstName,
        lastName: influencerRaw.lastName,
        email: influencerRaw.email,
        phoneNumber: influencerRaw.phoneNumber,
        emailLevel: emailType,
        company: influencerRaw.company,
        companyPosition: influencerRaw.position ?? null,
        industry: influencerRaw.industry,
        topic: influencerRaw.topic ?? [],
        followers: influencerRaw.followers,
        linkedinProfile: influencerRaw.linkedinProfile,
    };

    return influencerOut;
}
