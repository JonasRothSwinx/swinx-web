"use server";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "./amplifyServerUtils";
import { cookies } from "next/headers";
import config from "@/amplifyconfiguration.json";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { campaignSteps, campaignTypes } from "@/amplify/data/types";
import dayjs from "dayjs";
import "dayjs/locale/de";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// export default { getUserGroups, getUserAttributes };
const client = generateServerClientUsingCookies<Schema>({ config, cookies });

export async function getUserGroups() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            const session = await fetchAuthSession(contextSpec);
            // console.log(session);
            const payloadGroups =
                (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];
            // console.log(typeof payloadGroups);
            // if (!payloadGroups || typeof payloadGroups !== Json[]) return [];
            console.log(payloadGroups);
            return payloadGroups;
            return [];
        },
    });
    return result;
}
export async function getUserAttributes() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            const session = await fetchAuthSession(contextSpec);
            console.log(session);
            const attributes = await fetchUserAttributes(contextSpec);
            return attributes;
        },
    });
    return result;
}
interface InfluencerDataNew {
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
        details: privateData,
    });
}
export async function updateInfluencer(props: { data: InfluencerDataUpdate }) {
    const { id, firstName, lastName, email } = props.data;
    console.log({ firstName, lastName, email });
    if (!(firstName && lastName && email)) {
        return;
    }
    const { data: publicData, errors: publicErrors } = await client.models.InfluencerPublic.update({
        id,
        firstName,
        lastName,
    });
    if (!publicData || !publicData.influencerPublicDetailsId)
        throw new Error(publicErrors?.map((x) => x.message).join(", "));

    const { data: privateData, errors: privateErrors } =
        await client.models.InfluencerPrivate.update({
            id: publicData.influencerPublicDetailsId,
            email,
        });
    return { privateErrors, publicErrors };
}
export async function deleteInfluencer(props: {
    publicId: string;
    privateId: string;
}): Promise<void> {
    const { publicId, privateId } = props;
    console.log({ publicId, privateId });
    if (!(publicId && privateId)) {
        return;
    }
    const { data: privateData, errors: errorsPrivate } =
        await client.models.InfluencerPrivate.delete({
            id: privateId,
        });
    console.log({ privateData, errorsPrivate });
    const { data: publicData, errors: errorsPublic } = await client.models.InfluencerPublic.delete({
        id: publicId,
    });
    console.log({ publicData, errorsPublic });
}
interface WebinarNew {
    title: string;
    date: string;
}
interface CustomerNew {
    company: string;
    contactNameFirst: string;
    contactNameLast: string;
    contactPosition?: string;
    contactEmail: string;
}
interface CampaignDataNew {
    campaignType: string;
    customer: CustomerNew;
    webinarDetails?: WebinarNew;
}
export async function parseCampaignFormData(formJson: { [key: string]: any }) {
    console.log(formJson);
    const {
        campaignType,
        webinarTitle,
        webinarDate,
        customerCompany,
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPosition,
    } = formJson;
    if (!campaignTypes.includes(campaignType)) throw new Error("InvalidCampaignType");

    const date = dayjs(webinarDate, "DD.MM.YYYY HH:MM");
    console.log({ date });
    if (!(webinarTitle && date)) throw new Error("Missing Data");
    const webinar: WebinarNew = { title: webinarTitle, date: date.toISOString() };

    if (!(customerFirstName && customerLastName && customerCompany && customerEmail))
        throw new Error("Missing Data");
    const customer: CustomerNew = {
        contactNameFirst: customerFirstName,
        contactNameLast: customerLastName,
        company: customerCompany,
        contactEmail: customerEmail,
        contactPosition: customerPosition,
    };
    const campaign: CampaignDataNew = { campaignType, customer, webinarDetails: webinar };
    const response = await createNewCampaign(campaign);
}
export async function createNewCampaign(props: CampaignDataNew) {
    const { customer, webinarDetails, campaignType } = props;
    const { data: customerData } = await client.models.Customer.create(customer);

    let webinarData = undefined;
    if (webinarDetails) {
        const { data } = await client.models.Webinar.create(webinarDetails);
        webinarData = data;
    }

    const campaignNew = await client.models.Campaign.create({
        campaignType,
        customer: customerData,
        webinarDetails: webinarData,
        campaignStep: campaignSteps[0],
    });
    console.log(campaignNew);
}
