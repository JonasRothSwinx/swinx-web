import { RefreshIcon } from "@/app/Definitions/Icons";
import { Nullable, Prettify } from "@/app/Definitions/types";
import emailClient from "@/app/Emails";
import templateDefinitions from "@/app/Emails/templates";
import { templateVariables as inviteTemplateVariables } from "@/app/Emails/templates/campaignInvite";
import { dataClient } from "@/app/ServerFunctions/database";
import { getInviteBaseUrl, getUserGroups } from "@/app/ServerFunctions/serverActions";
import {
    Assignment,
    Candidate,
    Customer,
    EmailTriggers,
    Influencer,
    Influencers,
} from "@/app/ServerFunctions/types";
import { Box, CircularProgress, IconButton, SxProps, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { use, useMemo } from "react";
//#region Definitions
//#endregion

//MARK: - Main Component
interface PreviewFrameProps {
    selectedCandidate?: Candidate;
    assignmentId: string;
}
export default function PreviewFrame({ selectedCandidate, assignmentId }: PreviewFrameProps) {
    const emailLevel = selectedCandidate?.influencer?.emailLevel ?? "none";

    //#region Queries
    const templates = useQueries({
        queries: templateDefinitions.mailTypes.campaignInvite.CampaignInvite.templateNames.map(
            (templateName) => {
                return {
                    queryKey: ["template", templateName],
                    queryFn: () => emailClient.templates.get({ templateName }),
                };
            },
        ),
        combine(result) {
            const out: {
                [key in EmailTriggers.emailLevel]: Nullable<{
                    subjectLine: Nullable<string>;
                    html: Nullable<string>;
                    text: Nullable<string>;
                }>;
            } & { isLoading: boolean; isFetching: boolean; original: typeof result } = {
                none: null,
                new: (() => {
                    const data = result[0]?.data;
                    if (!data) return null;
                    return {
                        subjectLine: data.Subject ?? "",
                        html: data.Html ?? "",
                        text: data.Text ?? "",
                    };
                })(),
                reduced: (() => {
                    const data = result[1]?.data;
                    if (!data) return null;
                    return {
                        subjectLine: data.Subject ?? "",
                        html: data.Html ?? "",
                        text: data.Text ?? "",
                    };
                })(),
                isLoading: result.some((x) => x.isLoading),
                isFetching: result.some((x) => x.isFetching),
                original: result,
            };
            return out;
        },
    });

    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => dataClient.assignment.get(assignmentId),
    });
    const campaignId = useMemo(() => assignment.data?.campaign.id ?? null, [assignment.data]);

    const customer = useQuery({
        enabled: !!campaignId,
        queryKey: ["mainCustomer", campaignId],
        queryFn: async () => {
            if (!campaignId) return null;
            return (await dataClient.customer.byCampaign(campaignId))[0];
        },
    });

    const inviteBaseUrl = useQuery({
        queryKey: ["inviteBaseUrl"],
        queryFn: () => getInviteBaseUrl(),
    });

    const variables: inviteTemplateVariables = useMemo(() => {
        const name = selectedCandidate?.influencer
            ? Influencers.getFullName(selectedCandidate.influencer)
            : "<Kein Name gefunden>";
        const linkBase = inviteBaseUrl.data ?? "<Kein Link gefunden>";
        return {
            name,
            linkBase: "http://localhost:3000/Response?",
            linkData: "testData",
            customerCompany: customer.data?.company ?? "<Kein Unternehmen gefunden>",
        };
    }, [selectedCandidate, customer.data, inviteBaseUrl.data]);

    const [previewHtml, subjectLine] = useMemo(() => {
        const template = templates[emailLevel];
        const html = template?.html;
        const subjectLine = template?.subjectLine ?? "<Kein Betreff gefunden>";
        if (!template || !html) {
            return ["", ""];
        }
        return [replaceVariables(html, variables), subjectLine];
    }, [templates, emailLevel, variables]);

    const sxProps: SxProps = useMemo(
        () =>
            ({
                "&": {
                    "display": "flex",
                    "width": "100%",
                    "height": "100%",
                    // margin: "10px",
                    "padding": "10px",
                    "alignContent": "center",
                    "alignItems": "stretch",
                    "justifyContent": "center",
                    "textAlign": "center",

                    "& > *:not(button)": {
                        borderRadius: "10px",
                        border: "2px solid lightgray",
                        borderStyle: "inset",
                    },
                    "#EmailPreview": {
                        "display": "flex",
                        "flexDirection": "column",
                        "#EmailSubjectLine": {
                            padding: "10px",
                            color: "white",
                            backgroundColor: "var(--swinx-blue)",
                            borderRadius: "10px 10px 0px 0px",
                        },
                        "#previewFrame": {
                            flex: 1,
                            // borderRadius: "10px",
                            border: "none",
                        },
                    },
                    "#LoadingContainer": {
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    },
                },
            } satisfies SxProps),
        [],
    );
    //#region Data States
    //Loading
    if (
        templates.isLoading ||
        assignment.isLoading ||
        customer.isLoading ||
        inviteBaseUrl.isLoading
    )
        return (
            <Box sx={sxProps}>
                <Loading />;
            </Box>
        );
    //#endregion
    return (
        <Box sx={sxProps}>
            <AdminRefreshButton
                isRefetching={templates.isFetching}
                refreshTemplates={() => templates.original.forEach((x) => x.refetch())}
            />
            <EmailPreview
                html={previewHtml}
                subjectLine={subjectLine}
            />
        </Box>
    );
}
function replaceVariables(template: string, variables: Partial<inviteTemplateVariables>) {
    let out = template;
    // debugger;
    Object.entries(variables).forEach(([key, value]) => {
        if (typeof value === "string") {
            out = out.replaceAll(`{{${key}}}`, value);
        } /*  else if (Array.isArray(value)) {
            const regex = new RegExp(`(?:{{#each ${key}}})(.*?){{/each}}`, "gs");
            const matches = regex.exec(out);
            if (!matches) return;
            const replacementSection = matches[0];
            const targetSection = matches[1].trim();
            // console.log({ replacementSection, targetSection });

            const replacementContent = value
                .map((x) => {
                    return Object.entries(x).map(([subkey, subvalue]) => {
                        const modified = targetSection.replaceAll(`{{${subkey}}}`, subvalue);
                        return modified;
                    });
                })
                .join("\n");
            out = out.replaceAll(replacementSection, replacementContent);
        } */
        // console.log(key, value, out);
    });
    return out;
}
interface AdminRefreshButtonProps {
    refreshTemplates: () => void;
    isRefetching: boolean;
}
function AdminRefreshButton({ refreshTemplates, isRefetching }: AdminRefreshButtonProps) {
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => getUserGroups(),
    });
    const style = useMemo(
        () =>
            ({
                "position": "absolute",
                "bottom": "10px",
                "animationPlayState": "running",
                "animationName": "spin",
                "animationDuration": "500ms",
                "animationIterationCount": `${isRefetching ? "infinite" : "0"}`,
                "animationTimingFunction": "linear",
                "@keyframes spin": {
                    "100%": { transform: `rotate(360deg)` },
                },
            } as const),
        [isRefetching],
    );
    if (!userGroups.data?.includes("admin")) return null;
    return (
        <IconButton
            onClick={refreshTemplates}
            sx={style}
        >
            <RefreshIcon />
        </IconButton>
    );
}

function Loading() {
    const styles: SxProps = {};
    return (
        <Box
            id="LoadingContainer"
            sx={styles}
        >
            <Typography variant="h4">Emailvorschau wird geladen</Typography>
            <CircularProgress />
        </Box>
    );
}

interface EmailPreviewProps {
    html: string;
    subjectLine: string;
}
function EmailPreview({ html, subjectLine }: EmailPreviewProps) {
    return (
        <Box id="EmailPreview">
            <EmailSubjectLine subjectLine={subjectLine} />
            <EmailBody html={html} />
        </Box>
    );
}
interface EmailSubjectLineProps {
    subjectLine: string;
}
function EmailSubjectLine({ subjectLine }: EmailSubjectLineProps) {
    return <Typography id="EmailSubjectLine">{subjectLine}</Typography>;
}
interface EmailBodyProps {
    html: string;
}
function EmailBody({ html }: EmailBodyProps) {
    return (
        <iframe
            id="previewFrame"
            title="Email Preview"
            srcDoc={html}
        />
    );
}
