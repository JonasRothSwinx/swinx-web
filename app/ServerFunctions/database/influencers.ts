"use server";

import client from "./.dbclient";

export interface InfluencerDataNew {
    firstName: string;
    lastName: string;
    email: string;
}
interface InfluencerDataUpdate extends InfluencerDataNew {
    id: string;
}
export async function createNewInfluencer(props: { data: InfluencerDataNew }): Promise<void> {
    const { firstName, lastName, email } = props.data;
    console.log({ firstName, lastName, email });
    if (!(firstName && lastName && email)) {
        return;
    }
    const { data: privateData, errors: errors2 } = await client.models.InfluencerPrivate.create({
        email,
    });
    const { data: publicData } = await client.models.InfluencerPublic.create({
        firstName,
        lastName,
        influencerPublicDetailsId: privateData.id,
    });
}

export async function updateInfluencer(props: { data: InfluencerDataUpdate }) {
    const { id, firstName, lastName, email } = props.data;
    console.log({ id, firstName, lastName, email });
    if (!(firstName && lastName && email)) {
        return;
    }
    const { data: publicData, errors: publicErrors } = await client.models.InfluencerPublic.update({
        id,
        firstName,
        lastName,
    });
    if (!publicData || !publicData.influencerPublicDetailsId || publicErrors) {
        console.log(publicErrors);
        throw new Error(publicErrors?.map((x) => x.message).join(", "));
    }

    const { data: privateData, errors: privateErrors } = await client.models.InfluencerPrivate.update({
        id: publicData.influencerPublicDetailsId,
        email,
    });
    return { privateErrors, publicErrors };
}

export async function deleteInfluencer(props: { publicId: string; privateId: string }): Promise<void> {
    const { publicId, privateId } = props;
    console.log({ publicId, privateId });
    if (!(publicId && privateId)) {
        return;
    }
    const { data: privateData, errors: errorsPrivate } = await client.models.InfluencerPrivate.delete({
        id: privateId,
    });
    console.log({ privateData, errorsPrivate });
    const { data: publicData, errors: errorsPublic } = await client.models.InfluencerPublic.delete({
        id: publicId,
    });
    console.log({ publicData, errorsPublic });
}

export async function listInfluencers() {
    const { data } = await client.models.InfluencerPublic.list({
        selectionSet: ["id", "firstName", "lastName", "createdAt", "updatedAt", "details.id", "details.email"],
    });
    return data;
}
