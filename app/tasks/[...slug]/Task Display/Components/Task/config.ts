import { Events } from "@/app/ServerFunctions/types";
import { TimelineEvent } from "../../../Functions/Database/types";
import { getActionTime } from "@/app/utils";

export const eventTypes = [...Events.eventValues, "Draft-Post", "Draft-Video", "Draft-ImpulsVideo"] as const;
export type eventType = (typeof eventTypes)[number];

type nextStepsParams = {
    task: TimelineEvent;
};
export const nextSteps: { [key in eventType]: (params: nextStepsParams) => string } = {
    Invites: (params) =>
        `Laden sie ${getActionTime({ actionDate: params.task.date, dateOnly: true })} ${
            params.task.eventTaskAmount
        } ihrer Follower*innen zum Event ein.\n `,
    Post: (params) =>
        `Veröffentlichen sie ihren Beitrag ${getActionTime({
            actionDate: params.task.date,
        })}. Bitte teilen sie danach hier den Link auf den Beitrag mit uns`,
    Video: (params) =>
        `Veröffentlichen sie ihren Beitrag ${getActionTime({
            actionDate: params.task.date,
        })}. Bitte teilen sie danach hier den Link auf den Beitrag mit uns`,
    WebinarSpeaker: (params) => "Teilen sie ihr Wissen mit den Teilnehmern des Webinars",
    ImpulsVideo: (params) =>
        `Ihr freigegebenes Video wird ${getActionTime({ actionDate: params.task.date })} im Webinar gezeigt`,
    Webinar: (params) => "<Error>",
    "Draft-Post": (params) =>
        `Schreiben sie bis spätestens ${getActionTime({
            actionDate: params.task.date,
            dateOnly: true,
        })} ihren Beitrag und schicken sie ihn zur Freigabe an uns`,
    "Draft-Video": (params) =>
        `Nehmen sie bis spätestens ${getActionTime({
            actionDate: params.task.date,
            dateOnly: true,
        })} ihr Video auf und schicken sie es zur Freigabe an uns`,
    "Draft-ImpulsVideo": (params) =>
        `Nehmen sie bis spätestens ${getActionTime({
            actionDate: params.task.date,
            dateOnly: true,
        })} ihr Video auf und schicken sie es zur Freigabe an uns`,
};

type ContentLengthParams = {
    task: TimelineEvent;
};

export const contentLength: { [key in eventType]: (params: ContentLengthParams) => string | null } = {
    Invites: (params) => null,
    Post: (params) => null,
    Video: (params) => null,
    WebinarSpeaker: (params) => null,
    ImpulsVideo: (params) => null,
    Webinar: (params) => null,
    "Draft-Post": (params) => (params.task.info?.charLimit ? `${params.task.info?.charLimit} Zeichen` : null),
    "Draft-Video": (params) => (params.task.info?.maxDuration ? `${params.task.info?.maxDuration} Minuten` : null),
    "Draft-ImpulsVideo": (params) =>
        params.task.info?.maxDuration ? `${params.task.info?.maxDuration} Minuten` : null,
};

type TaskTopicParams = {
    task: TimelineEvent;
};

export const taskTopic: { [key in eventType]: (params: TaskTopicParams) => string | null } = {
    Invites: (params) => null,
    Post: (params) => null,
    Video: (params) => null,
    WebinarSpeaker: (params) => params.task.eventTitle ?? null,
    ImpulsVideo: (params) => null,
    Webinar: (params) => null,
    "Draft-Post": (params) => params.task.eventTitle ?? null,
    "Draft-Video": (params) => params.task.info?.topic ?? null,
    "Draft-ImpulsVideo": (params) => params.task.eventTitle ?? null,
};

const PossibleActionTypes = [
    "markFinished",
    "uploadText",
    "uploadVideo",
    "uploadImage",
    "uploadLink",
    "uploadScreenshot",
] as const;
export type PossibleAction = (typeof PossibleActionTypes)[number];
export type ActionConfig = { [key in PossibleAction]?: boolean };

export const possibleAction: { [key in eventType]: ActionConfig } = {
    Invites: {
        // uploadImage: true,
        uploadScreenshot: true,
    },
    Post: {
        uploadLink: true,
    },
    Video: {
        uploadLink: true,
    },
    WebinarSpeaker: {
        markFinished: true,
    },
    ImpulsVideo: {
        // markFinished: true,
        uploadVideo: true,
    },
    Webinar: {},
    "Draft-Post": {
        // markFinished: true,
        uploadText: true,
        uploadImage: true,
    },
    "Draft-Video": {
        // markFinished: true,
        uploadText: true,
        uploadVideo: true,
    },
    "Draft-ImpulsVideo": {
        // markFinished: true,
        uploadVideo: true,
    },
};

type InstructionsParams = {
    task: TimelineEvent;
};

export const instructions: { [key in eventType]: (params: InstructionsParams) => string | null } = {
    Invites: (params) => params.task.info?.instructions ?? null,
    Post: (params) => null,
    Video: (params) => null,
    WebinarSpeaker: (params) => params.task.info?.instructions ?? null,
    ImpulsVideo: (params) => null,
    Webinar: (params) => null,
    "Draft-Post": (params) => params.task.info?.instructions ?? null,
    "Draft-Video": (params) => params.task.info?.instructions ?? null,
    "Draft-ImpulsVideo": (params) => params.task.info?.instructions ?? null,
};
