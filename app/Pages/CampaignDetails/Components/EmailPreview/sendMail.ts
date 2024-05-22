import emailClient from "@/app/Emails";
import Assignment from "@/app/ServerFunctions/types/assignment";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import Customer from "@/app/ServerFunctions/types/customer";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import Campaign from "@/app/ServerFunctions/types/campaign";
import ProjectManagers from "@/app/ServerFunctions/types/projectManagers";
import dataClient from "@/app/ServerFunctions/database";

interface SendInvitesProps {
    customer: Customer.Customer;
    candidates: Candidates.Candidate[];
    assignment: Assignment.Assignment;
    campaignId: string;
    queryClient: QueryClient;
}
export default async function sendInvites({
    assignment,
    campaignId,
    candidates,
    customer,
    queryClient,
}: SendInvitesProps) {
    console.log("Sending invites");

    const campaign = queryClient.getQueryData<Campaign.Campaign>(["campaign", campaignId]);
    if (!campaign) {
        alert("Kampagnendaten nicht gefunden");
        return;
    }
    const campaignManager = campaign.projectManagers[0];
    if (!campaignManager) {
        alert("Kampagnenmanager nicht gefunden");
        return;
    }
    return;
    const groupedCandidates = candidates.reduce(
        (acc, candidate) => {
            const level = candidate.influencer.emailLevel;
            if (!level) return acc;
            acc[level].push(candidate);
            return acc;
        },
        {
            new: [],
            reduced: [],
            none: [],
        } as { [key in EmailTriggers.emailLevel]: Candidates.Candidate[] },
    );
    const responses = await Promise.all(
        Object.entries(groupedCandidates).map(async ([level, candidates]) => {
            if (level === "none") return;
            if (candidates.length === 0) return;
            console.log("Sending invites for level", level, candidates);
            const response = await emailClient.email.campaignInvites.send({
                level: level as EmailTriggers.emailLevel,
                commonContext: {
                    candidates,
                    // taskDescriptions: ["Make Tea"],
                    assignment,
                    customer,
                    campaign,
                    campaignManager,
                },
                individualContext: [],
            });

            return { level, data: response };
        }),
    );
    if (groupedCandidates.none.length > 0) {
        alert(
            "Die folgendern Influencer erhalten keine automatischen Emails: " +
                groupedCandidates.none
                    .map(({ influencer: x }) => {
                        return `${x.firstName} ${x.lastName}: ${x.email}`;
                    })
                    .join(",\n"),
        );
    }
    return responses.filter((x) => x?.data !== undefined);
}
