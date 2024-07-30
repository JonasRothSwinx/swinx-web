import { DeepWriteable, Prettify } from "@/app/Definitions/types";
import { dataClient } from "./dataClient";

export type Webinar = Prettify<Awaited<ReturnType<typeof dataClient.getEventInfo>>>;
export type Campaign = Prettify<Awaited<ReturnType<typeof dataClient.getCampaignInfo>>>;
export type Assignment = Prettify<Awaited<ReturnType<typeof dataClient.getAssignmentData>>>;
export type Candidate = Prettify<Awaited<ReturnType<typeof dataClient.getCandidate>>>;
export type TimelineEvent = Prettify<NonNullable<Awaited<ReturnType<typeof dataClient.getEventsByAssignment>>[number]>>;
export type ParentEvent = Prettify<NonNullable<Awaited<ReturnType<typeof dataClient.getEventInfo>>>>;
export type Task = Prettify<Awaited<ReturnType<typeof dataClient.getTaskDetails>>>;
