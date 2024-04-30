import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
type necesaryKeyInfo = {
    flat?: (keyof TimelineEvent.Event)[];
    info?: (keyof TimelineEvent.Event["info"])[];
    targetAudience?: (keyof TimelineEvent.Event["targetAudience"])[];
    relatedEvents?: (keyof TimelineEvent.Event["relatedEvents"])[];
    campaign?: (keyof TimelineEvent.Event["campaign"])[];
};
const necessaryKeys: { [key in TimelineEvent.eventType]?: necesaryKeyInfo } = {
    Invites: {
        flat: ["type", "eventTaskAmount", "assignments"],
        campaign: ["id"],
        relatedEvents: ["parentEvent"],
    },
};
export default function validateFields(
    event: Partial<TimelineEvent.Event>,
    type: TimelineEvent.eventType
): event is TimelineEvent.Event {
    const keys = necessaryKeys[type];
    if (!keys) return true;
    if (keys.flat) {
        if (!keys.flat.every((key) => validateKey(event[key]))) return false;
    }
    if (keys.info) {
        const info = event.info;
        if (!info || !keys.info.every((key) => validateKey(info[key]))) return false;
    }
    if (keys.targetAudience) {
        const targetAudience = event.targetAudience;
        if (!targetAudience || !keys.targetAudience.every((key) => validateKey(targetAudience[key]))) return false;
    }
    if (keys.relatedEvents) {
        const relatedEvents = event.relatedEvents;
        if (!relatedEvents || !keys.relatedEvents.every((key) => validateKey(relatedEvents[key]))) return false;
    }
    if (keys.campaign) {
        const campaign = event.campaign;
        if (!campaign || !keys.campaign.every((key) => validateKey(campaign[key]))) return false;
    }
    return true;
}

function validateKey(value: unknown) {
    if (value === undefined) return false;
    if (value === null) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === "string" && value === "") return false;
    return true;
}
