import { EmailContextProps } from "@/app/Emails/templates/types";
import { types as dbTypes } from "../../database";

export default function defineContext(
    triggers: dbTypes.EmailTriggerData[],
): Partial<EmailContextProps>[] {
    const context: Partial<EmailContextProps>[] = triggers.reduce((context, trigger) => {
        // console.log("------------------------------");
        // console.log("Trigger", JSON.stringify(trigger, null, 2));
        // console.log("Context", JSON.stringify(context, null, 2));
        const { event, influencer, customer, projectManagers } = trigger;
        if (!event || !influencer || !customer) {
            const missingContext = {
                event: !!event,
                influencer: !!influencer,
                customer: !!customer,
            };
            Object.keys(missingContext).forEach((key) => {
                const typedKey = key as keyof typeof missingContext;
                if (!missingContext[typedKey]) delete missingContext[typedKey];
            });
            console.error("Missing context", JSON.stringify(missingContext, null, 2));
            console.error("Trigger", JSON.stringify(trigger, null, 2));
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
