import { RefreshIcon } from "@/app/Definitions/Icons";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import emailClient from "@/app/Emails/";
import templateDefinitions, { templateName } from "@/app/Emails/templates";
import { getInviteBaseUrl, getUserGroups } from "@/app/ServerFunctions/serverActions";
import Assignment from "@/app/ServerFunctions/types/assignment";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    IconButton,
    MenuItem,
    SxProps,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { UseQueryResult, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import sendInvites from "./sendMail";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Nullable } from "@/app/Definitions/types";
import Customer from "@/app/ServerFunctions/types/customer";
import dataClient from "@/app/ServerFunctions/database";
import encodeQueryParams from "@/app/Emails/templates/campaignInvite/encodeQueryParams";

interface GetTemplateProps {
    setIsLoading: (value: boolean) => void;
    setEmailPreview: (value?: string) => void;
    templateName: string;
}

function getTemplate({ setIsLoading, setEmailPreview, templateName }: GetTemplateProps) {
    setIsLoading(true);
    emailClient.templates.get({ templateName }).then((result) => {
        if (result === null) throw new Error("Template not found");
        console.log("Template received:", result);
        setIsLoading(false);
        setEmailPreview(result.TemplateContent?.Html);
    });
}

interface EmailPreviewProps {
    onClose: () => void;
    // templateName: string;
    // variables: Partial<TemplateVariableType>;
    // candidates: Candidates.Candidate[];
    // assignment: Assignment.AssignmentFull;
    assignmentId: string;
}

type inviteTemplateVariables =
    typeof templateDefinitions.mailTypes.campaignInvite.CampaignInvite.defaultParams;
/**
 * Renders the email preview component.
 *
 * @param props - The component props.
 * @returns The rendered email preview component.
 */
export default function EmailPreview(props: EmailPreviewProps) {
    const { assignmentId, onClose } = props;
    const queryClient = useQueryClient();
    // const campaignId = assignment.campaign.id;
    // const [emailPreview, setEmailPreview] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    // const [variables, setVariables] = useState<Partial<inviteTemplateVariables>>({
    //     name: "testName",
    //     assignments: [{ assignmentDescription: "Fliege zum Mars" }],
    //     honorar: "0€",
    //     linkBase: "http://localhost:3000/Response?",
    //     linkData: "testData",
    //     customerCompany: "TestCustomer",
    // });
    const [templateName, setTemplateName] = useState<templateName>("CampaignInviteNew");
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
                [key in EmailTriggers.emailLevel]: Nullable<string>;
            } & { isLoading: boolean; isFetching: boolean; original: typeof result } = {
                none: null,
                new: result[0].data?.TemplateContent?.Html ?? "",
                reduced: result[1].data?.TemplateContent?.Html ?? "",
                isLoading: result.some((x) => x.isLoading),
                isFetching: result.some((x) => x.isFetching),
                original: result,
            };
            return out;
        },
    });

    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: async () => (await dataClient.assignment.get(assignmentId)) ?? null,
    });
    const campaignId = useMemo(() => assignment.data?.campaign.id ?? null, [assignment.data]);
    const customer = useQuery({
        enabled: campaignId !== null,
        queryKey: ["mainCustomer", campaignId],
        queryFn: async () => {
            if (!campaignId) return null;
            return (await dataClient.customer.byCampaign(campaignId))[0];
        },
    });
    const baseUrl = useQuery({
        queryKey: ["campaignInviteBaseUrl"],
        queryFn: () => getInviteBaseUrl(),
    });
    const candidates = useMemo(() => {
        if (!assignment.data) return [];
        return assignment.data.candidates ?? [];
    }, [assignment.data]);
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: getUserGroups,
    });

    const [selectedCandidate, setSelectedCandidate] = useState(candidates[0] ?? null);
    // useEffect(() => {
    //     setVariables((prev) => {
    //         if (!selectedCandidate) return prev;
    //         return {
    //             ...prev,
    //             name: `${selectedCandidate.influencer.firstName} ${selectedCandidate.influencer.lastName}`,
    //         };
    //     });

    //     return () => {};
    // }, [selectedCandidate]);
    useEffect(() => {
        setSelectedCandidate(candidates[0] ?? null);
        return () => {};
    }, [candidates]);

    const variables: inviteTemplateVariables = useMemo(() => {
        if (!selectedCandidate || !selectedCandidate.id || !baseUrl.data || !campaignId) return {};
        const candidateFullName = `${selectedCandidate.influencer.firstName} ${selectedCandidate.influencer.lastName}`;
        const encodedData = encodeQueryParams({
            assignmentId,
            candidateId: selectedCandidate.id,
            campaignId,
            candidateFullName,
        });
        const data: inviteTemplateVariables = {
            name: candidateFullName,
            linkBase: baseUrl.data,
            linkData: encodedData,
            customerCompany: customer.data?.company ?? "<Kundendaten nicht gefunden>",
            // honorar: `${assignment.data?.budget} €` ?? "<Honorar nicht gefunden>",
        };

        return data;
    }, [selectedCandidate, baseUrl.data, campaignId, assignmentId, customer.data?.company]);

    const EventHandlers = {
        sendEmail: async () => {
            if (!customer.data || !assignment.data || !campaignId) return;
            const responses = await sendInvites({
                candidates,
                assignment: assignment.data,
                customer: customer.data,
                queryClient,

                campaignId,
            });
            console.log(responses);
            onClose();
        },
        cancel: () => {
            onClose();
        },
    };
    //Loading placeholder
    // if (!template.data) return <div>Template not found</div>;
    if (!selectedCandidate) {
        return (
            <Dialog
                open
                onClose={onClose}
                fullWidth
                sx={{
                    margin: "0",
                    "& .MuiPaper-root": { maxWidth: "75%", height: "50vh", overflow: "hidden" },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            sx={{
                margin: "0",
                "& .MuiPaper-root": { maxWidth: "75%", height: "50vh", overflow: "hidden" },
            }}
        >
            <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid xs={4}>
                    {userGroups.data?.includes("admin") && (
                        <IconButton
                            onClick={() => templates.original.forEach((x) => x.refetch())}
                            sx={{
                                position: "absolute",
                                bottom: "0",
                                animationPlayState: "running",
                                animationName: "spin",
                                animationDuration: "500ms",
                                animationIterationCount: `${
                                    templates.isFetching ? "infinite" : "0"
                                }`,
                                animationTimingFunction: "linear",
                                "@keyframes spin": {
                                    "100%": { transform: `rotate(360deg)` },
                                },
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    )}
                    {isLoading ? (
                        <Box
                            justifyContent={"center"}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            height={"100%"}
                        >
                            <Typography>Lade Email-Template</Typography>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <EmailFrame
                                emailPreview={
                                    templates[selectedCandidate.influencer.emailLevel ?? "new"] ??
                                    null
                                }
                                isLoading={templates.isLoading}
                                variables={{
                                    ...variables,
                                    name: `${selectedCandidate.influencer.firstName} ${selectedCandidate.influencer.lastName}`,
                                }}
                            />
                        </>
                    )}
                </Grid>
                <Grid xs={8} display={"flex"} flexDirection={"column"}>
                    <Editor
                        candidates={candidates}
                        selectedCandidate={selectedCandidate}
                        setSelectedCandidate={setSelectedCandidate}
                    />
                    <ButtonGroup
                        sx={{
                            // position: "absolute",
                            // right: "5px",
                            // bottom: "5px",
                            justifyContent: "flex-end",
                            padding: "5px",
                        }}
                    >
                        <Button onClick={EventHandlers.cancel} color="error">
                            Abbrechen
                        </Button>
                        <Button onClick={EventHandlers.sendEmail} disabled={!customer.isFetched}>
                            Emails verschicken
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Dialog>
    );
}
function replaceVariables(template: string, variables: Partial<inviteTemplateVariables>) {
    let out = template;
    // debugger;
    Object.entries(variables).forEach(([key, value]) => {
        if (typeof value === "string") {
            out = out.replaceAll(`{{${key}}}`, value);
        } else if (Array.isArray(value)) {
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
        }
        // console.log(key, value, out);
    });
    return out;
}

interface EmailFrameProps {
    isLoading?: boolean;
    emailPreview: Nullable<string>;
    variables: Partial<inviteTemplateVariables>;
}
function EmailFrame(props: EmailFrameProps) {
    const { emailPreview } = props;
    const sxProps: SxProps = useMemo(
        () =>
            ({
                "&": {
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                },
            } satisfies SxProps),
        [],
    );
    if (props.isLoading)
        return (
            <Box sx={sxProps}>
                <CircularProgress />
            </Box>
        );
    if (emailPreview === null) {
        return (
            <Box sx={sxProps}>
                <Typography>Dieser Influenzer erhält keine automatischen Emails</Typography>
            </Box>
        );
    }
    if (emailPreview === "")
        return (
            <Box sx={sxProps}>
                <Typography>Kein Email-Template gefunden</Typography>;
            </Box>
        );
    return (
        <iframe
            className={stylesExporter.campaignDetails.emailPreviewIframe}
            srcDoc={replaceVariables(props.emailPreview ?? "", props.variables)}
        ></iframe>
    );
}

interface EditorProps {
    selectedCandidate: Candidates.Candidate;
    setSelectedCandidate: (candidate: Candidates.Candidate) => void;
    candidates: Candidates.Candidate[];
}
function Editor(props: EditorProps) {
    return (
        <Box flex={1} padding={"10px"}>
            <TextField
                fullWidth
                select
                name="influencer"
                label="Zeige für Influencer'"
                value={props.selectedCandidate.id}
                size="medium"
                required
                SelectProps={{
                    // sx: { minWidth: "15ch" },
                    value: props.selectedCandidate.id,
                    onChange: ({ target: { value } }) => {
                        console.log(value);
                        const candidate = props.candidates.find((x) => x.id === value);
                        if (!candidate) return;
                        props.setSelectedCandidate(candidate);
                    },
                }}
            >
                {props.candidates.map((candidate, i) => {
                    return (
                        <MenuItem key={candidate.id ?? ""} value={candidate.id ?? ""}>
                            {`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}
                        </MenuItem>
                    );
                })}
            </TextField>
            <br />
            <br />
            <br />
            <Typography>TODO: Email Editor</Typography>
        </Box>
    );
}
