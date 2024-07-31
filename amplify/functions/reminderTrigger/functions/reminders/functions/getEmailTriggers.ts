// import { EmailTriggerWithContext } from "../types";
import { getDbClient, types } from "../../database";
// import { getTriggerContext } from "./getTriggerContext";
import { Dayjs } from "@/app/utils";
import { EmailContextProps } from "@/app/Emails/templates/types";
// import defineContext from "./defineContext";

// const DataCache: DataCache = {
//     campaign: {},
//     customer: {},
//     influencer: {},
// };

export interface GetEmailTriggerProps {
    startDate: Dayjs;
    endDate: Dayjs;
}
export async function getEmailTriggers(
    props: GetEmailTriggerProps,
): Promise<types.EmailTriggerData[]> {
    const { startDate, endDate } = props;
    const dbClient = await getDbClient();
    console.log("Getting email triggers", startDate.toString(), endDate.toString());
    const triggers = await dbClient.getEmailTriggers({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
    });
    const filteredTriggers = triggers.filter((trigger) => {
        switch (true) {
            case trigger.event.status === "COMPLETED":
            case trigger.event.isCompleted: {
                return false;
            }
            case trigger.trigger.type === "deadlineReminder" &&
                trigger.event.status !== "WAITING_FOR_DRAFT": {
                return false;
            }
            default: {
                return true;
            }
        }
    });
    // const contextProps = await defineContext(triggers);
    // const triggersWithContext = await Promise.all(
    //     triggers.map(async (trigger) => {
    //         const triggerWithContext = await getTriggerContext(trigger);
    return filteredTriggers;
}
