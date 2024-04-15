import html from "./invite.html";
import { MailTemplate, Template, SendMailProps, EmailLevelDefinition } from "..";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import { fetchApi } from "../../sesAPI";

type inviteTemplateVariables = {
    name: string;
    assignments: { assignmentDescription: string }[];
    honorar: string;
    linkBase: string;
    linkYes: string;
    linkNo: string;
};

const templateNew: MailTemplate = {
    name: "CampaignInviteNew",
    subjectLine: "Einladung zu Kampagne",
    html,
} as const;

const templateReduced: MailTemplate = {
    name: "CampaignInviteReduced",
    subjectLine: "Einladung zu Kampagne",
    html,
} as const;

const templates: EmailLevelDefinition = {
    new: templateNew,
    reduced: templateReduced,
};

const inviteTemplateNames = [templateNew.name, templateReduced.name] as const;

const defaultParams: inviteTemplateVariables = {
    name: "testName",
    assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    honorar: "0€",
    linkBase: "http://localhost:3000/Response?",
    linkYes: "q=Yes",
    linkNo: "q=No",
};

const inviteEmails: Template = {
    defaultParams,
    send,
    levels: {
        new: templateNew,
        reduced: templateReduced,
    },
    templateNames: [...inviteTemplateNames],
};
export default inviteEmails;

function extractVariables(event: TimelineEvent.Event): inviteTemplateVariables {
    const name = "";
    throw new Error("Not implemented yet");
}

interface BulkCampaignInviteProps {
    candidates: Candidates.Candidate[];
    variables: Pick<inviteTemplateVariables, "assignments" | "honorar">;
    templateName: (typeof inviteTemplateNames)[number];
}
async function send(props: SendMailProps) {
    const {
        level,
        props: { candidates, assignment, taskDescriptions },
    } = props;
    if (level === "none" || !candidates || !assignment) return;
    const templateName = templates[level].name;
    sendBulkCampaignInviteAPI({
        templateName,
        candidates,
        variables: {
            assignments: taskDescriptions.map((assignmentDescription) => ({
                assignmentDescription,
            })),
            honorar: assignment.budget?.toString() ?? "<Honorar nicht definiert>",
        },
    });
}

async function sendBulkCampaignInviteAPI(props: BulkCampaignInviteProps) {
    const { templateName } = props;
    const baseUrl = process.env.BASE_URL;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify({
                name: "Error 418: Teapot",
                assignments: props.variables.assignments ?? [{ assignmentDescription: "Make Tea" }],
                honorar: props.variables.honorar ?? "<Honorar nicht definiert>",
                linkBase: baseUrl + "/Response?",
                linkYes: "q=Yes",
                linkNo: "q=No",
            } satisfies inviteTemplateVariables),
            emailData: props.candidates.map((candidate) => {
                const baseParams = {
                    firstName: candidate.influencer.firstName,
                    lastName: candidate.influencer.lastName,
                    id: candidate.id,
                };
                const encodedParametersYes = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "accepted" })),
                );
                const encodedParametersNo = encodeURIComponent(
                    btoa(JSON.stringify({ ...baseParams, response: "rejected" })),
                );
                return {
                    to: candidate.influencer.email,
                    templateData: JSON.stringify({
                        name: `${candidate.influencer.firstName} ${candidate.influencer.lastName}`,
                        linkYes: `q=${encodedParametersYes}`,
                        linkNo: `q=${encodedParametersNo}`,
                    } satisfies Partial<inviteTemplateVariables>),
                };
            }),
        },
    };
    const response = await fetchApi(requestBody);
    return response.json();
}
