// "use server";
// import client from "./.dbclient";
// import StaticEvent from "../types/staticEvents";
// import { SelectionSet } from "aws-amplify/api";
// import { Schema } from "@/amplify/data/resource";
// import Assignment from "../types/assignment";

// const selectionSet = [
//     "id",
//     "type",
//     "date",
//     "notes",
//     "campaignStaticEventsId",
//     "assignments.id",
//     "assignments.isPlaceholder",
//     "assignments.placeholderName",
//     "eventAssignmentAmount",
//     "eventTitle",
// ] as const;

// function validateStaticEvent(
//     rawData: SelectionSet<Schema["StaticEvent"], typeof selectionSet>,
// ): StaticEvent.StaticEvent {
//     const { id, type, date, notes, campaignStaticEventsId, eventAssignmentAmount, eventTitle } =
//         rawData;
//     if (!id) throw new Error("Missing ID");
//     if (!StaticEvent.isStaticEventType(type)) throw new Error("Invalid Type");
//     const dataOut: StaticEvent.StaticEvent = {
//         id,
//         type,
//         date: date ?? undefined,
//         notes,
//         campaign: { id: campaignStaticEventsId ?? "" },
//         eventAssignmentAmount: eventAssignmentAmount ?? 0,
//         eventTitle: eventTitle ?? "",
//         assignments: rawData.assignments.map(
//             (x) =>
//                 ({
//                     id: x.id,
//                     isPlaceholder: x.isPlaceholder,
//                     placeholderName: x.placeholderName,
//                     influencer: null,
//                 } satisfies Assignment.AssignmentMin),
//         ),
//     };

//     return dataOut;
// }

// export async function createNewStaticEvent(event: StaticEvent.StaticEvent) {
//     const { type, assignments, date, notes, campaign, eventTitle, eventAssignmentAmount } = event;
//     if (!campaign.id) throw new Error("Missing Campaign ID");
//     const { data, errors } = await client.models.StaticEvent.create({
//         type,
//         date,
//         notes,
//         campaignStaticEventsId: campaign.id,
//         eventTitle,
//         eventAssignmentAmount,
//     });
//     console.log({ data, errors });
//     return { data: data.id };
// }

// export async function getStaticEvent(id: string) {
//     const { data, errors } = await client.models.StaticEvent.get({ id });
//     return { data, errors };
// }

// export async function listStaticEvents(): Promise<StaticEvent.StaticEvent[]> {
//     const { data, errors } = await client.models.StaticEvent.list({
//         selectionSet,
//     });
//     if (errors) throw new Error(JSON.stringify(errors));
//     console.log({ data, errors });
//     const dataOut = data.map(validateStaticEvent);

//     return dataOut;
// }

// export async function updateStaticEvent(event: StaticEvent.StaticEvent) {
//     const { id, type, assignments, date, notes, campaign } = event;
//     if (!id) throw new Error("Missing ID");
//     const { data, errors } = await client.models.StaticEvent.update({
//         id,
//         type,
//         date,
//         notes,
//         campaignStaticEventsId: campaign.id,
//     });
//     return { data, errors };
// }

// export async function deleteStaticEvent(event: StaticEvent.StaticEvent) {
//     if (!event.id) throw new Error("Missing ID");
//     const { data, errors } = await client.models.StaticEvent.delete({ id: event.id });
//     return { data, errors };
// }

// export async function listStaticEventsByCampaign(campaignId: string) {
//     const { data, errors } = await client.models.Campaign.get({ id: campaignId });
//     if (errors) throw new Error(JSON.stringify(errors));
//     if (!data) throw new Error("Missing Data");
//     const staticEvents = data.staticEvents;
//     return { data: staticEvents, errors };
// }
