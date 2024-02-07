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
import { SelectionSet } from "aws-amplify/api";
import { Campaign, Customer, TimelineEvent, Webinar } from "./databaseTypes";
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
//#region Influencer
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

export async function listInfluencers() {
    const { data } = await client.models.InfluencerPublic.list({
        selectionSet: [
            "id",
            "firstName",
            "lastName",
            "createdAt",
            "updatedAt",
            "details.id",
            "details.email",
        ],
    });
    return data;
}
//#endregion
//#region Customer
// export async function parseCustomerFormData(formJson: { [key: string]: any }) {
//     console.log(formJson);
//     const {
//         id,
//         customerCompany,
//         customerEmail,
//         customerNameFirst,
//         customerNameLast,
//         customerPosition,
//     } = formJson;

//     if (!(customerNameFirst && customerNameLast && customerCompany && customerEmail))
//         throw new Error("Missing Data");
//     const customer: CustomerUpdate = {
//         id,
//         customerNameFirst,
//         customerNameLast,
//         customerCompany,
//         customerEmail,
//         customerPosition,
//     };
//     const response = await updateCustomer(customer);
// }

export async function createCustomer(customer: Customer) {
    const { company, firstName, lastName, email, companyPosition, notes } = customer;
    const { data, errors } = await client.models.Customer.create({
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
    });
    return { data, errors };
}

export async function updateCustomer(customer: Customer) {
    const { id, company, firstName, lastName, email, companyPosition, notes } = customer;
    if (!id) throw new Error("Missing Data");
    const { data, errors } = await client.models.Customer.update({
        id,
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
    });
    return { data, errors };
}

export async function deleteCustomer(customer: Customer) {
    if (!customer.id) throw new Error("Missing Data");

    const { errors } = await client.models.Customer.delete({ id: customer.id });
    console.log(errors);
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
export async function deleteWebinar(webinar: Webinar) {
    if (!webinar.id) throw new Error("Missing Data");

    const { errors } = await client.models.Webinar.delete({ id: webinar.id });
    console.log(errors);
}

//#endregion
//#region Campaign

// export async function parseCampaignFormData(formJson: { [key: string]: any }) {
//     console.log(formJson);
//     const {
//         campaignType,
//         webinarTitle,
//         webinarDate,
//         customerCompany,
//         customerEmail,
//         customerNameFirst,
//         customerNameLast,
//         customerPosition,
//     } = formJson;
//     if (!campaignTypes.includes(campaignType)) throw new Error("InvalidCampaignType");

//     const date = dayjs(webinarDate, "DD.MM.YYYY HH:MM");
//     console.log({ date });
//     if (!(webinarTitle && date)) throw new Error("Missing Data");
//     const webinar: WebinarNew = { title: webinarTitle, date: date.toISOString() };

//     if (!(customerNameFirst && customerNameLast && customerCompany && customerEmail))
//         throw new Error("Missing Data");
//     const customer: CustomerNew = {
//         customerCompany,
//         customerEmail,
//         customerNameFirst,
//         customerNameLast,
//         customerPosition,
//     };
//     const campaign: CampaignDataNew = { campaignType, customer, webinarDetails: webinar };
//     const response = await createNewCampaign(campaign);
// }

export async function createNewCampaign(campaign: Campaign.Campaign) {
    const { campaignType, campaignManagerId, customer, campaignStep, notes } = campaign;
    // if (!customer) throw new Error("Missing Data");

    const customerResponse = createCustomer(customer);

    switch (true) {
        case Campaign.isWebinar(campaign): {
            const webinarData = createWebinar(campaign.webinar);
            const { data, errors } = await client.models.Campaign.create({
                campaignType,
                campaignManagerId,
                customer: (await customerResponse).data,
                webinar: await webinarData,
                campaignStep: campaignSteps[0],
                notes,
            });
            return { errors };
        }

        default:
            break;
    }
    // const campaignNew = await client.models.Campaign.create({
    //     campaignType,
    //     customer: customerData,
    //     webinar: webinarData,
    //     campaignStep: campaignSteps[0],
    // });
    // console.log(campaignNew);
}
export async function listCampaigns() {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: [
            //
            "id",
            "campaignType",
            "campaignManagerId",
            "campaignStep",
            "notes",

            "customer.id",
            "customer.firstName",
            "customer.lastName",
            "customer.email",
            "customer.company",
            "customer.companyPosition",

            "campaignTimelineEvents.influencer.id",
            "campaignTimelineEvents.influencer.firstName",
            "campaignTimelineEvents.influencer.lastName",
            "campaignTimelineEvents.id",
            "campaignTimelineEvents.date",
            "campaignTimelineEvents.campaign.id",
            "campaignTimelineEvents.timelineEventType",
            "campaignTimelineEvents.notes",
            "campaignTimelineEvents.inviteEvent.*",

            "webinar.id",
            "webinar.title",
            "webinar.date",
        ],
    });
    data.map((raw) => {
        return {
            id: raw.id,
            campaignType: raw.campaignType,
            campaignManagerId: raw.campaignManagerId,
            customer: raw.customer,
            campaignTimelineEvents: raw.campaignTimelineEvents,
            campaignStep: raw.campaignStep,
            notes: raw.notes,
        } satisfies Campaign.Campaign;
    });

    return { data, errors };
}

export async function deleteCampaign(campaign: Campaign.Campaign) {
    if (!campaign.id) throw new Error("Missing Data");

    const tasks: Promise<unknown>[] = [];
    //Remove Customer
    tasks.push(deleteCustomer(campaign.customer));

    //Remove TimelineEvents
    tasks.push(...campaign.campaignTimelineEvents.map((event) => deleteTimelineEvent(event)));

    //Remove Webinar
    if (Campaign.isWebinar(campaign)) {
        tasks.push(deleteWebinar(campaign.webinar));
    }

    tasks.push(client.models.Campaign.delete({ id: campaign.id }));

    await Promise.all(tasks);
}
//#endregion
//#region InfluencerAssignments
// export interface InfluencerAssignment {}
// export async function createInfluencerAssignment(params: type) {}
//#endregion

//#region TimelineEvent

export async function listTimelineEvents() {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet: [
            "id",
            "timelineEventType",
            "timelineEventInfluencerId",

            "campaign.id",

            "inviteEvent.id",
            "inviteEvent.invites",

            "createdAt",
            "updatedAt",
        ],
    });
    return data;
}
export async function createTimelineEvent(props: TimelineEvent.TimelineEvent) {
    const { timelineEventType, date, notes } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;
    const { id: timelineEventInfluencerId } = props.influencer;
    const { inviteEvent = undefined } = props as TimelineEvent.TimeLineEventInvites;

    if (!(timelineEventInfluencerId && date && campaignCampaignTimelineEventsId)) {
        throw new Error("Missing Data");
    }
    const { data: inviteEventData, errors: inviteEventErrors } = await createInviteEvent(
        inviteEvent,
    );

    const { data, errors } = await client.models.TimelineEvent.create({
        timelineEventType,
        date,
        campaignCampaignTimelineEventsId,
        inviteEvent: inviteEventData,
        timelineEventInfluencerId,
        notes,
    });

    return { errors };
}
export async function updateTimelineEvent(props: TimelineEvent.TimelineEvent) {
    const { id, timelineEventType, date, notes } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;
    const { id: timelineEventInfluencerId } = props.influencer;
    const { inviteEvent = undefined } = props as TimelineEvent.TimeLineEventInvites;
    if (!id) {
        throw new Error("Missing Data");
    }
    console.log(inviteEvent);
    if (inviteEvent) {
        await updateInviteEvent(inviteEvent);
    }

    const { errors } = await client.models.TimelineEvent.update({
        id,
        timelineEventType,
        date,
        campaignCampaignTimelineEventsId,
        timelineEventInfluencerId,
        notes,
    });
}
async function deleteTimelineEvent(event: TimelineEvent.TimelineEvent) {
    if (!event.id) throw new Error("Missing Data");

    const { errors } = await client.models.TimelineEvent.delete({ id: event.id });
    console.log(errors);
}

async function createInviteEvent(props: TimelineEvent.InviteEvent | undefined) {
    if (props === undefined) return { data: undefined, errors: undefined };
    const { invites } = props;
    if (!invites) {
        throw new Error("Missing Data");
    }
    const { data, errors } = await client.models.InvitesEvent.create({
        invites,
    });
    return { data, errors };
}
async function updateInviteEvent(props: TimelineEvent.InviteEvent) {
    if (props === undefined) return { data: undefined, errors: undefined };
    const { invites, id } = props;
    if (!(invites && id)) {
        throw new Error("Missing Data");
    }
    const { data, errors } = await client.models.InvitesEvent.update({
        invites,
        id,
    });
    return { data, errors };
}

//#endregion
