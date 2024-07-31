"use server";
import emailClient from "@/app/Emails";
import { EmailContextProps } from "@/app/Emails/templates/types";
import {
    Candidate,
    Customer,
    ProjectManager,
    EmailTriggers,
    Campaign,
    Assignment,
} from "@/app/ServerFunctions/types";

interface SendDecisionNotification {
    acceptedCandidate: Candidate;
    rejectedCandidates: Candidate[];
    projectManagers: ProjectManager[];
    customer: Customer;
    campaign: Campaign;
    assignment: Assignment;
}
export async function sendDecisionNotification({
    acceptedCandidate,
    rejectedCandidates,
    projectManagers,
    customer,
    campaign,
    assignment,
}: SendDecisionNotification) {
    console.log("Sending decision notification");
    console.log("Accepted candidate", acceptedCandidate);
    console.log("Rejected candidates", rejectedCandidates);
    console.log("Project managers", projectManagers);
    console.log("Customer", customer);
    const primaryProjectManager = projectManagers[0];
    const commonContext: Partial<EmailContextProps> = {
        customer,
        projectManager: primaryProjectManager,
        campaign,
        assignment,
    };

    const rejectedCandidatesByEmailLevel: { [key in EmailTriggers.emailLevel]: Candidate[] } = {
        new: [],
        reduced: [],
        none: [],
    };
    rejectedCandidates.reduce((acc, candidate) => {
        const level = candidate.influencer.emailLevel;
        if (!level) return acc;
        acc[level].push(candidate);
        return acc;
    }, rejectedCandidatesByEmailLevel);

    if (acceptedCandidate.influencer.emailLevel !== "none") {
        emailClient.email.campaignInvitesAccept.send({
            level: acceptedCandidate.influencer.emailLevel ?? "new",
            commonContext,
            individualContext: [{ influencer: acceptedCandidate.influencer }],
        });
    }

    Object.entries(rejectedCandidatesByEmailLevel).forEach(([level, candidates]) => {
        if (candidates.length === 0 || level === "none") return;

        emailClient.email.campaignInvitesReject.send({
            level: level as EmailTriggers.emailLevel,
            commonContext,
            individualContext: candidates.map((candidate) => ({
                influencer: candidate.influencer,
            })),
        });
    });
    return rejectedCandidatesByEmailLevel.none;
}
