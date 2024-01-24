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
            const payloadGroups = (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];
            // console.log(typeof payloadGroups);
            // if (!payloadGroups || typeof payloadGroups !== Json[]) return [];
            // console.log(payloadGroups);
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
            // console.log(session);
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
//#region Influencer

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
//#endregion
//#region Customer
interface CustomerNew {
    customerCompany: string;
    customerNameFirst: string;
    customerNameLast: string;
    customerPosition?: string;
    customerEmail: string;
}
interface CustomerUpdate {
    id: string;
    customerCompany?: string;
    customerNameFirst?: string;
    customerNameLast?: string;
    customerPosition?: string;
    customerEmail?: string;
}
export async function parseCustomerFormData(formJson: { [key: string]: any }) {
    console.log(formJson);
    const { id, customerCompany, customerEmail, customerNameFirst, customerNameLast, customerPosition } = formJson;

    if (!(customerNameFirst && customerNameLast && customerCompany && customerEmail)) throw new Error("Missing Data");
    const customer: CustomerUpdate = {
        id,
        customerNameFirst,
        customerNameLast,
        customerCompany,
        customerEmail,
        customerPosition,
    };
    const response = await updateCustomer(customer);
}

export async function createCustomer(props: CustomerNew) {
    const customer = props;
    const { data, errors } = await client.models.Customer.create(customer);
    if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
    return data;
}

export async function updateCustomer(props: CustomerUpdate) {
    const customer = props;
    const { data, errors } = await client.models.Customer.update(customer);
    if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
    return data;
}

//#endregion

//#region Webinar
interface WebinarNew {
    title: string;
    date: string;
}
interface WebinarUpdate {
    id: string;
    title?: string;
    date?: string;
}
export async function parseWebinarFormData(formJson: { [key: string]: any }) {
    console.log(formJson);
    const { id, title, date: dateRaw } = formJson;

    if (!(id && title && dateRaw)) {
        throw new Error("Missing Data");
    }
    const date = dayjs(dateRaw, "DD.MM.YYYY HH:MM").toISOString();
    const webinar: WebinarUpdate = {
        id,
        title,
        date,
    };
    const response = await updateWebinar(webinar);
}
export async function createWebinar(props: WebinarNew) {
    const customer = props;
    const { data, errors } = await client.models.Webinar.create(customer);
    if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
    return data;
}

export async function updateWebinar(props: WebinarUpdate) {
    const customer = props;
    const { data, errors } = await client.models.Webinar.update(customer);
    if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
    return data;
}

//#endregion
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
        customerNameFirst,
        customerNameLast,
        customerPosition,
    } = formJson;
    if (!campaignTypes.includes(campaignType)) throw new Error("InvalidCampaignType");

    const date = dayjs(webinarDate, "DD.MM.YYYY HH:MM");
    console.log({ date });
    if (!(webinarTitle && date)) throw new Error("Missing Data");
    const webinar: WebinarNew = { title: webinarTitle, date: date.toISOString() };

    if (!(customerNameFirst && customerNameLast && customerCompany && customerEmail)) throw new Error("Missing Data");
    const customer: CustomerNew = {
        customerCompany,
        customerEmail,
        customerNameFirst,
        customerNameLast,
        customerPosition,
    };
    const campaign: CampaignDataNew = { campaignType, customer, webinarDetails: webinar };
    const response = await createNewCampaign(campaign);
}

export async function createNewCampaign(props: CampaignDataNew) {
    const { customer, webinarDetails, campaignType } = props;
    const customerData = await createCustomer(customer);

    const webinarData = webinarDetails ? await createWebinar(webinarDetails) : undefined;
    const campaignNew = await client.models.Campaign.create({
        campaignType,
        customer: customerData,
        webinarDetails: webinarData,
        campaignStep: campaignSteps[0],
    });
    console.log(campaignNew);
}
//#region InfluencerAssignments
export interface InfluencerAssignment {}
// export async function createInfluencerAssignment(params: type) {}
//#endregion
