import { Prettify } from "@/app/Definitions/types";
import dataClient from "./dataClient";

export type Webinar = Prettify<Awaited<ReturnType<typeof dataClient.getEventInfo>>>;
export type Campaign = Prettify<Awaited<ReturnType<typeof dataClient.getCampaignInfo>>>;
export type Assignment = Prettify<Awaited<ReturnType<typeof dataClient.getAssignmentData>>>;
export type Candidate = Prettify<Awaited<ReturnType<typeof dataClient.getCandidate>>>;
export type TimelineEvent = Prettify<
    Awaited<ReturnType<typeof dataClient.getEventsByAssignment>>[number]
>;
