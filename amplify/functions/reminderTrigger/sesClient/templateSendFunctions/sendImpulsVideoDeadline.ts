"use server";
import { SignatureTemplateVariables } from "@/app/Emails/templates/_components/SignatureTemplateVariables";
import { sesAPIClient, SendMailProps } from "..";
import {
    TemplateVariables,
    templateNames,
} from "@/app/Emails/templates/impulsVideo/TemplateVariables";
import {
    grabSignatureProps,
    defaultSignatureProps,
    getActionTime,
    getTaskPageUrl,
} from "./functions";

/**
 * Send campaign invites to candidates
 * @param props
 * @param props.level The email level to send
 * @param props.props.candidates The candidates to send the email to
 * @param props.props.assignment The assignment to send the email for
 * @param props.props.taskDescriptions The descriptions of the tasks in the assignment
 * @returns
 */

export async function sendImpulsVideoDeadlineReminder(props: SendMailProps) {
    const { level, fromAdress, bcc, individualContext } = props;
    console.log("Sending Impulsvideo reminders for level", level, props);

    if (level === "none") return;

    const templateName = templateNames[level];
    const templateData = individualContext.reduce(
        (acc, { event, influencer, customer, projectManager }) => {
            if (!event || !influencer || !customer || !projectManager) {
                console.error("Error: Missing context", { event, influencer, customer });
                return acc;
            }
            const { info } = event;
            if (!info) {
                console.error("Error: Missing event info", { event });
                return acc;
            }
            const { draftDeadline } = info;
            if (!draftDeadline) {
                console.error("Error: Missing event info", { info });
                return acc;
            }
            const candidateFullName = `${influencer.firstName} ${influencer.lastName}`;
            const signatureProps = grabSignatureProps({ projectManager });
            const topic = event.eventTitle ?? "<Thema nicht gefunden>";
            const dueDate = getActionTime({ actionDate: draftDeadline });
            const templateVariables: TemplateVariables & SignatureTemplateVariables = {
                name: candidateFullName,
                customerName: customer.company,
                dueDate,
                topic: topic,
                taskPageLink: getTaskPageUrl({ assignmentId: event.assignments[0].id }),
                ...signatureProps,
            };
            acc.push({
                to: influencer.email,
                templateData: JSON.stringify(templateVariables),
            });
            return acc;
        },
        [] as { to: string; templateData: string }[],
    );
    console.log("Sending bulk", JSON.stringify(templateData));
    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        bcc,
        templateName: templateName,
        defaultTemplateData: JSON.stringify({
            name: "TestName",
            customerName: "TestCustomer",
            dueDate: "TestDate",
            topic: "TestTopic",
            taskPageLink: "https://www.swinx.de",
            ...defaultSignatureProps,
        } satisfies TemplateVariables & SignatureTemplateVariables),
        bulkTemplateData: templateData,
    });
    return response;
}
