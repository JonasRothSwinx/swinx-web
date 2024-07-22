import { Event, Events } from "@/app/ServerFunctions/types";
type necesaryKeyInfo = {
    flat?: (keyof Event)[];
    info?: (keyof Event["info"])[];
    targetAudience?: (keyof Event["targetAudience"])[];
    campaign?: (keyof Event["campaign"])[];
};
const necessaryKeys: { [key in Events.eventType]?: necesaryKeyInfo } = {
    Invites: {
        flat: ["type", "eventTaskAmount", "assignments", "parentEvent"],
        campaign: ["id"],
    },
};
export default function validateFields(
    event: Partial<Event>,
    type: Events.eventType,
): event is Event {
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
        if (
            !targetAudience ||
            !keys.targetAudience.every((key) => validateKey(targetAudience[key]))
        )
            return false;
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
