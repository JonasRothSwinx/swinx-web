"use server";
import { EmailTriggerWithContext } from "../types";
import getDbClient from "../../database";
import { getTriggerContext } from "./getTriggerContext";
import { Dayjs } from "@/app/utils/configuredDayJs";

// const DataCache: DataCache = {
//     campaign: {},
//     customer: {},
//     influencer: {},
// };

export interface GetEmailTriggerProps {
    startDate: Dayjs;
    endDate: Dayjs;
}
export async function getEmailTriggers(props: GetEmailTriggerProps) {
    const { startDate, endDate } = props;
    const dbClient = await getDbClient();
    console.log("Getting email triggers", startDate.toString(), endDate.toString());
    const triggers = await dbClient.getEmailTriggers({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
    });
    const fullTriggers = (
        await Promise.all(
            triggers.map(async (trigger) => {
                if (!trigger.event || !trigger.event.id || trigger.event.isCompleted) return null;
                return await getTriggerContext(trigger);
            }),
        )
    ).filter((trigger): trigger is EmailTriggerWithContext => trigger !== null);
    return fullTriggers;
}
