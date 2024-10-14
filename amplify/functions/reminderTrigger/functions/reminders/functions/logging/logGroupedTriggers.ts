import { GroupedTrigger, TriggerGroup } from "../../types";

export function logGroupedTriggers(triggerGroup: TriggerGroup): void {
    Object.entries(triggerGroup).forEach(([eventType, eventTypeGroup]) => {
        // console.log(`Email type: ${emailType}`);
        Object.entries(eventTypeGroup).forEach(([reminderType, reminderTypeTriggers]) => {
            // console.log(`Level: ${level}`);
            let totalAmount = 0;
            const amountStrings = Object.entries(reminderTypeTriggers)
                .map(([emaiLevel, triggers]) => {
                    const amount = triggers.length;
                    totalAmount += amount;
                    if (amount > 0) {
                        return `${emaiLevel}: ${amount}`;
                    } else return "";
                })
                .join(", ");
            if (totalAmount > 0) {
                console.log(`${eventType}: ${reminderType} - ${amountStrings}`);
            }
        });
    });
}
