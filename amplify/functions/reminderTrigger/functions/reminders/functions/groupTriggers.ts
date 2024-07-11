import { types as dbTypes } from "../../database";
import { TriggerGroup } from "../types";

export default async function groupTriggers(
    triggers: dbTypes.EmailTriggerData[],
): Promise<TriggerGroup> {
    const grouped: TriggerGroup = {};
    triggers.reduce((grouped, triggerData) => {
        const {
            event: { type: eventType },
            trigger,
            trigger: { type: mailType },
            influencer,
        } = triggerData;
        if (trigger.sent || !trigger.active) return grouped;
        if (!influencer) return grouped;
        const level = trigger.emailLevelOverride ?? influencer?.emailLevel ?? "new";
        if (!level || level === "none") return grouped;
        const eventTypeGroup = grouped[eventType];
        if (!eventTypeGroup) {
            grouped[eventType] = {
                [mailType]: {
                    [level]: [triggerData],
                },
            };
            return grouped;
        }
        const mailTypeGroup = eventTypeGroup[mailType];
        if (!mailTypeGroup) {
            eventTypeGroup[mailType] = { [level]: [triggerData] };
            return grouped;
        }
        const levelGroup = mailTypeGroup[level];
        if (!levelGroup) {
            mailTypeGroup[level] = [triggerData];
            return grouped;
        }
        levelGroup.push(triggerData);

        return grouped;
    }, grouped);
    return grouped;
}
