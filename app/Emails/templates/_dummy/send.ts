"use server";
import { SendMailProps } from "../types";

export default async function send(props: SendMailProps) {
    const {
        level,
        commonContext: {
            candidates,
            assignment,
            taskDescriptions,
            customer,
            // campaign,
            projectManager: campaignManager,
        },
    } = props;
    console.log("Sending invites for level", level, props);

    if (level === "none") return;
    // Check if all required data is present
}
