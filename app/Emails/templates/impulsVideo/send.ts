"use server";

import sesAPIClient from "../../sesAPI";
import { SendMailProps } from "../types";
import { TemplateVariables } from "./Email";
import template from ".";

/**
 * Send campaign invites to candidates
 * @param props
 * @param props.level The email level to send
 * @param props.props.candidates The candidates to send the email to
 * @param props.props.assignment The assignment to send the email for
 * @param props.props.taskDescriptions The descriptions of the tasks in the assignment
 * @returns
 */

export default async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    console.log("Sending Impulsvideo reminders for level", level, props);

    if (level === "none") return;

    const templateName = template.levels[level].name;
    const templateData = individualContext.reduce((acc, { event, influencer, customer }) => {
        if (!event || !influencer || !customer) {
            console.error("Error: Missing context", { event, influencer, customer });
            return acc;
        }
        const { info } = event;
        if (!info) {
            console.error("Error: Missing event info", { event });
            return acc;
        }
        const { draftDeadline, topic } = info;
        if (!draftDeadline || !topic) {
            console.error("Error: Missing event info", { info });
            return acc;
        }
        const candidateFullName = `${influencer.firstName} ${influencer.lastName}`;
        const templateVariables: TemplateVariables = {
            name: candidateFullName,
            customerName: customer.company,
            dueDate: draftDeadline,
            topic: topic,
        };
        acc.push({
            to: influencer.email,
            templateData: JSON.stringify(templateVariables),
        });
        return acc;
    }, [] as { to: string; templateData: string }[]);
    const response = await sesAPIClient.sendBulk({
        from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
        templateName: templateName,
        defaultTemplateData: JSON.stringify(template.defaultParams),
        bulkTemplateData: templateData,
    });
    return response;
}
