"use server";
import { EmailContextProps } from "@/app/Emails/templates/types";
import { EmailTriggerWithContext } from "../types";

export default async function defineContext(
    triggers: EmailTriggerWithContext[],
): Promise<Partial<EmailContextProps>[]> {
    const context: Partial<EmailContextProps>[] = triggers.reduce((context, trigger) => {
        const { event, influencer, customer, projectManagers } = trigger;
        if (!event || !influencer || !customer) {
            console.error("Missing context");
            return context;
        }
        context.push({
            event,
            influencer,
            customer,
            projectManager: projectManagers[0],
        });
        return context;
    }, [] as Partial<EmailContextProps>[]);
    return context;
}
