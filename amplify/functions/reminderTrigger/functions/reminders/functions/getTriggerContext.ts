import getDbClient from "../../database";
import { RawEmailTrigger } from "../../database/types";

export async function getTriggerContext(trigger: RawEmailTrigger) {
    const dbClient = await getDbClient();
    console.log("Getting events by trigger", trigger);
    const response = await dbClient.getEvent(trigger.event.id);
    if (response === null) return null;
    const { event, customer, projectManagers } = response;
    if (!event || !customer) return null;
    if (event.isCompleted) return null;
    const triggerWithEvent = { ...trigger, event, customer, projectManagers };
    return triggerWithEvent;
}
