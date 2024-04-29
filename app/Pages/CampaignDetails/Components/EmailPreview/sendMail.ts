import emailClient from "@/app/ServerFunctions/email";
import Assignment from "@/app/ServerFunctions/types/assignment";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import * as SesHandlerType from "@/amplify/functions/sesHandler/types";

interface SendInvitesProps {
    candidates: Candidates.Candidate[];
    assignment: Assignment.Assignment;
}
export default async function sendInvites(props: SendInvitesProps) {
    console.log("Sending invites", props);
    const { assignment, candidates } = props;
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
        } as { [key in EmailTriggers.emailLevel]: Candidates.Candidate[] }
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
                    taskDescriptions: ["Make Tea"],
                    assignment,
                },
                individualContext: [],
            });

            return { level, data: response };
        })
    );
    if (groupedCandidates.none.length > 0) {
        alert(
            "Die folgendern Influencer erhalten keine automatischen Emails: " +
                groupedCandidates.none
                    .map(({ influencer: x }) => {
                        return `${x.firstName} ${x.lastName}: ${x.email}`;
                    })
                    .join(",\n")
        );
    }
    return responses.filter((x) => x?.data !== undefined);
}
