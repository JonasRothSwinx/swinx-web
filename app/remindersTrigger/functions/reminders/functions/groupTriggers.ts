"use server";

import { EmailTriggerWithContext, TriggerGroup } from "../types";

export default async function groupTriggers(
    triggers: EmailTriggerWithContext[],
): Promise<TriggerGroup> {
    const grouped: TriggerGroup = {};
    triggers.reduce((grouped, trigger) => {
        const {
            event: { type: eventType },
            type: mailType,
            influencer,
        } = trigger;
        if (trigger.sent || !trigger.active) return grouped;
        if (!influencer) return grouped;
        const level = trigger.emailLevelOverride ?? trigger.influencer?.emailLevel ?? "new";
        if (!level || level === "none") return grouped;
        const eventTypeGroup = grouped[eventType];
        if (!eventTypeGroup) {
            grouped[eventType] = {
                [mailType]: {
                    [level]: [trigger],
                },
            };
            return grouped;
        }
        const mailTypeGroup = eventTypeGroup[mailType];
        if (!mailTypeGroup) {
            eventTypeGroup[mailType] = { [level]: [trigger] };
            return grouped;
        }
        const levelGroup = mailTypeGroup[level];
        if (!levelGroup) {
            mailTypeGroup[level] = [trigger];
            return grouped;
        }
        levelGroup.push(trigger);

        return grouped;
    }, grouped);
    return grouped;
}
