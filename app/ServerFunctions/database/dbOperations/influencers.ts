"use server";

import { client } from "./_dbclient";
import { EmailTriggers, Influencer, Influencers } from "@/app/ServerFunctions/types";
import { Nullable, PartialWith } from "@/app/Definitions/types";
import { Schema } from "@/amplify/data/resource";
import { SelectionSet } from "aws-amplify/api";

const selectionSet = [
    "id",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "company",
    "position",
    "industry",
    "topic",
    "followers",
    "linkedinProfile",
    "emailType",
    // "createdAt",
] as const;

type RawData = SelectionSet<Schema["Influencer"]["type"], typeof selectionSet>;
//#region create
/**
 * Create a new influencer
 * @param influencer The influencer object to create
 * @returns The ID of the created influencer
 */
export async function createNewInfluencer(
    influencer: Omit<Influencers.Full, "id">,
): Promise<Nullable<string>> {
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
    return data?.id ?? null;
}
//#endregion

//#region get
export async function getInfluencer(id: string) {
    const { data, errors } = await client.models.Influencer.get({ id }, { selectionSet });
    if (errors) {
        throw new Error(errors.map((error) => error.message).join("\n"));
    }
    if (!data) {
        throw new Error("Influencer not found");
    }
    const influencer = validate(data);
    return influencer;
}
//#endregion

//#region update
export async function updateInfluencer(updatedData: PartialWith<Influencers.Full, "id">) {
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
//#endregion

//#region delete
export async function deleteInfluencer(influencer: PartialWith<Influencer, "id">): Promise<void> {
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
    const storedData = [];
    let storedNextToken: null | string | undefined = null;
    do {
        const { data, errors, nextToken } = await client.models.Influencer.list({
            selectionSet,
            nextToken: storedNextToken,
        });
        // console.log(response.nextToken);
        storedNextToken = nextToken as string;
        if (errors) {
            throw new Error(errors.map((error) => error.message).join("\n"));
        }
        if (data) {
            storedData.push(...data);
        }
    } while (!!storedNextToken);
    const dataOut = validateArray(storedData);
    return dataOut;
}
//#endregion

function validate(influencerRaw: Nullable<RawData>): Nullable<Influencers.Full> {
    if (!influencerRaw) return null;
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
    const influencerOut: Influencers.Full = {
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
        // createdAt: influencerRaw.createdAt,
    };

    return influencerOut;
}

function validateArray(rawData: RawData[]): Influencers.Full[] {
    return rawData.map((data) => validate(data)).filter((data): data is Influencers.Full => !!data);
}
