import { SendMailProps } from "@/app/Emails/templates/types";
import { EmailTriggerWithContext } from "../types";
import defineContext from "./defineContext";
import { EmailTriggers } from "@/app/ServerFunctions/types";

interface ProcessTriggersParams {
    triggers: EmailTriggerWithContext[];
    level: EmailTriggers.emailLevel;
    send: (props: SendMailProps) => Promise<unknown>;
}

export default async function sendMailBySender({ triggers, level, send }: ProcessTriggersParams) {
    const tasks: Promise<unknown>[] = [];
    const grouped = groupBySender(triggers);
    Object.entries(grouped).forEach(async ([sender, triggers]) => {
        const context = await defineContext(triggers);
        const sendProps: SendMailProps = {
            level,
            fromAdress: sender === "none" ? undefined : sender,
            commonContext: {},
            individualContext: context,
            bcc: [...triggers[0].projectManagers.slice(1).map((pm) => pm.email)],
        };
        tasks.push(send(sendProps));
    });
    return Promise.all(tasks);
}

function groupBySender(triggers: EmailTriggerWithContext[]) {
    const grouped: Record<string, EmailTriggerWithContext[]> = {};
    triggers.forEach((trigger) => {
        const sender = trigger.projectManagers?.[0].email ?? "none";
        if (!grouped[sender]) grouped[sender] = [];
        grouped[sender].push(trigger);
    });
    return grouped;
}
