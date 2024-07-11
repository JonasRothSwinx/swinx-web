import { SendMailProps } from "@/app/Emails/templates/types";
import { EmailTriggers } from "@/app/ServerFunctions/types";
import { EmailTriggerData } from "../../database/types";
import defineContext from "./defineContext";
import { SendBulkEmailResponse } from "@aws-sdk/client-sesv2";

interface ProcessTriggersParams {
    triggers: EmailTriggerData[];
    level: EmailTriggers.emailLevel;
    send: (props: SendMailProps) => Promise<SendBulkEmailResponse | void>;
}

export async function sendMailBySender({ triggers, level, send }: ProcessTriggersParams) {
    const tasks: Promise<SendBulkEmailResponse | void>[] = [];
    const grouped = groupBySender(triggers);
    Object.entries(grouped).forEach(async ([sender, triggers]) => {
        const context = defineContext(triggers);
        const sendProps: SendMailProps = {
            level,
            fromAdress: sender === "none" ? undefined : sender,
            commonContext: {},
            individualContext: context,
            bcc: [...triggers[0].projectManagers.slice(1).map((pm) => pm.email)],
        };
        // console.log("Would send mail here!", JSON.stringify(sendProps, null, 2));
        tasks.push(
            send(sendProps)
                .then((res) => {
                    console.log("Mail sent", JSON.stringify(res, null, 2));
                    return res;
                })
                .catch((err) => {
                    const trigger = triggers[0];
                    const event = trigger.event;
                    console.log(
                        "Failed to send mail",
                        event.type,
                        trigger.trigger.type,
                        trigger.influencer.emailLevel,
                    );
                    console.error("Error", err);
                    console.error("Props", JSON.stringify(sendProps, null, 2));
                }),
        );
    });
    return tasks;
}

function groupBySender(triggers: EmailTriggerData[]) {
    const grouped: Record<string, EmailTriggerData[]> = {};
    triggers.forEach((trigger) => {
        const { email, firstName, lastName } = trigger.projectManagers[0];
        const sender =
            firstName && lastName && email ? `${firstName} ${lastName} <${email}>` : "none";
        if (!grouped[sender]) grouped[sender] = [];
        grouped[sender].push(trigger);
    });
    return grouped;
}
