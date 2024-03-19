"use server";
import client from "./.dbclient";
import { StaticEvent } from "../types/staticEvents";

export async function createNewStaticEvent(event: StaticEvent.StaticEvent) {
    const { type, assignments, date, notes, campaign, eventTitle, eventAssignmentAmount } = event;
    if (!campaign.id) throw new Error("Missing Campaign ID");
    const { data, errors } = await client.models.StaticEvent.create({
        type,
        date,
        notes,
        campaignStaticEventsId: campaign.id,
        eventTitle,
        eventAssignmentAmount,
    });
    console.log({ data, errors });
    return { data: data.id };
}

export async function getStaticEvent(id: string) {
    const { data, errors } = await client.models.StaticEvent.get({ id });
    return { data, errors };
}

export async function listStaticEvents() {
    const { data, errors } = await client.models.StaticEvent.list({
        selectionSet: ["id", "type", "date", "notes", "campaignStaticEventsId", "eventAssignmentAmount", "eventTitle"],
    });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log({ data, errors });

    return data;
}

export async function updateStaticEvent(event: StaticEvent.StaticEvent) {
    const { id, type, assignments, date, notes, campaign } = event;
    if (!id) throw new Error("Missing ID");
    const { data, errors } = await client.models.StaticEvent.update({
        id,
        type,
        date,
        notes,
        campaignStaticEventsId: campaign.id,
    });
    return { data, errors };
}

export async function deleteStaticEvent(event: StaticEvent.StaticEvent) {
    if (!event.id) throw new Error("Missing ID");
    const { data, errors } = await client.models.StaticEvent.delete({ id: event.id });
    return { data, errors };
}

export async function listStaticEventsByCampaign(campaignId: string) {
    const { data, errors } = await client.models.Campaign.get({ id: campaignId });
    if (errors) throw new Error(JSON.stringify(errors));
    if (!data) throw new Error("Missing Data");
    const staticEvents = data.staticEvents;
    return { data: staticEvents, errors };
}
