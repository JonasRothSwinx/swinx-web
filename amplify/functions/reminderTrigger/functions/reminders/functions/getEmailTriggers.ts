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
    // const contextProps = await defineContext(triggers);
    // const triggersWithContext = await Promise.all(
    //     triggers.map(async (trigger) => {
    //         const triggerWithContext = await getTriggerContext(trigger);
    return triggers;
}
