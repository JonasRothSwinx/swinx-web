import { Nullable } from "@/app/Definitions/types";
import emailClient from "@/app/Emails/";
import templateDefinitions, { templateName } from "@/app/Emails/templates";
import { dataClient } from "@/app/ServerFunctions/database";
import { getInviteBaseUrl, getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Candidates } from "@/app/ServerFunctions/types";
import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Box, Button, ButtonGroup, CircularProgress, Dialog, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Editor from "./Editor";
import PreviewFrame from "./PreviewFrame";
import sendInvites from "./sendMail";

interface GetTemplateProps {
    setIsLoading: (value: boolean) => void;
    setEmailPreview: (value?: string) => void;
    templateName: string;
}

// function getTemplate({ setIsLoading, setEmailPreview, templateName }: GetTemplateProps) {
//     setIsLoading(true);
//     emailClient.templates.get({ templateName }).then((result) => {
//         if (result === null) throw new Error("Template not found");
//         console.log("Template received:", result);
//         setIsLoading(false);
//         setEmailPreview(result.TemplateContent?.Html);
//     });
// }

interface EmailPreviewProps {
    onClose: ({ didSend }: { didSend: boolean }) => void;
    // templateName: string;
    // variables: Partial<TemplateVariableType>;
    // candidates: Candidates.Candidate[];
    // assignment: Assignment.AssignmentFull;
    assignmentId: string;
}

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
    // const [templateName, setTemplateName] = useState<templateName>("CampaignInviteNew");
    // const templates = useQueries({
    //     queries: templateDefinitions.mailTypes.campaignInvite.CampaignInvite.templateNames.map(
    //         (templateName) => {
    //             return {
    //                 queryKey: ["template", templateName],
    //                 queryFn: () => emailClient.templates.get({ templateName }),
    //             };
    //         },
    //     ),
    //     combine(result) {
    //         const out: {
    //             [key in EmailTriggers.emailLevel]: Nullable<string>;
    //         } & { isLoading: boolean; isFetching: boolean; original: typeof result } = {
    //             none: null,
    //             new: result[0].data?.TemplateContent?.Html ?? "",
    //             reduced: result[1].data?.TemplateContent?.Html ?? "",
    //             isLoading: result.some((x) => x.isLoading),
    //             isFetching: result.some((x) => x.isFetching),
    //             original: result,
    //         };
    //         return out;
    //     },
    // });

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
        return (
            assignment.data.candidates?.filter((candidate) => {
                return candidate.invitationSent === false;
            }) ?? []
        );
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

    // const variables: inviteTemplateVariables = useMemo(() => {
    //     if (!selectedCandidate || !selectedCandidate.id || !baseUrl.data || !campaignId) return {};
    //     const candidateFullName = `${selectedCandidate.influencer.firstName} ${selectedCandidate.influencer.lastName}`;
    //     const encodedData = encodeQueryParams({
    //         assignmentId,
    //         candidateId: selectedCandidate.id,
    //         campaignId,
    //         candidateFullName,
    //     });
    //     const data: inviteTemplateVariables = {
    //         name: candidateFullName,
    //         linkBase: baseUrl.data,
    //         linkData: encodedData,
    //         customerCompany: customer.data?.company ?? "<Kundendaten nicht gefunden>",
    //         // honorar: `${assignment.data?.budget} €` ?? "<Honorar nicht gefunden>",
    //     };

    //     return data;
    // }, [selectedCandidate, baseUrl.data, campaignId, assignmentId, customer.data?.company]);

    const EventHandlers = {
        // sendEmail: async () => {
        //     if (!customer.data || !assignment.data || !campaignId) return;
        //     const responses = await sendInvites({
        //         candidates,
        //         assignment: assignment.data,
        //         customer: customer.data,
        //         queryClient,

        //         campaignId,
        //     });
        //     console.log(responses);
        //     Mutations.markCandidateAsSent.mutate(candidates);
        //     onClose({ didSend: true });
        // },
        sendEmail: useMutation({
            mutationFn: async () => {
                if (!customer.data || !assignment.data || !campaignId) return;
                const responses = await sendInvites({
                    candidates,
                    assignment: assignment.data,
                    customer: customer.data,
                    queryClient,

                    campaignId,
                });
                return responses;
            },
            onMutate: async () => {
                await queryClient.cancelQueries({ queryKey: ["candidates", assignmentId] });
                return { previousCandidates: candidates };
            },
            onSuccess: (data, variables, context) => {
                if (process.env.NODE_ENV === "development")
                    console.log("Emails sent", { data, variables, context });
                Mutations.markCandidateAsSent.mutate(candidates);
                onClose({ didSend: true });
            },
        }),

        cancel: () => {
            onClose({ didSend: false });
        },
    };
    const Mutations = {
        markCandidateAsSent: useMutation({
            mutationFn: async (candidates: Candidates.Candidate[]) => {
                if (process.env.NODE_ENV === "development") {
                    console.log("marking candidates as sent", candidates);
                }
                const tasks = candidates.map(async (candidate) => {
                    if (!candidate.id) throw new Error("Candidate has no id");
                    return dataClient.candidate.update({
                        candidateId: candidate.id,
                        previousCandidate: candidate,
                        updatedValues: { invitationSent: true },
                    });
                });
                return await Promise.all(tasks);
            },
            onMutate: async (candidates) => {
                await queryClient.cancelQueries({ queryKey: ["candidates", assignmentId] });
                const newCandidates = candidates.map((candidate) => {
                    return { ...candidate, invitationSent: true };
                });
                queryClient.setQueryData(["candidates", assignmentId], newCandidates);
                return { previousCandidates: candidates, newCandidates };
            },
            onError: (error, variables, context) => {
                console.error("Error updating candidates", { error, variables, context });
                const { previousCandidates } = context ?? {};
                if (!previousCandidates) {
                    queryClient.setQueryData(["candidates", assignmentId], previousCandidates);
                }
            },
            onSettled: (data, error, variables, context) => {
                if (process.env.NODE_ENV === "development")
                    console.log(
                        "Candidates updated",
                        { data, error, variables, context },
                        // data?.isCompleted,
                    );
                queryClient.invalidateQueries({ queryKey: ["candidates", assignmentId] });
            },
        }),
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
            <Grid
                container
                sx={{ width: "100%", height: "100%" }}
            >
                <Grid xs={4}>
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
                            <PreviewFrame
                                selectedCandidate={selectedCandidate}
                                assignmentId={assignmentId}
                            />
                        </>
                    )}
                </Grid>
                <Grid
                    xs={8}
                    display={"flex"}
                    flexDirection={"column"}
                >
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
                        <Button
                            onClick={EventHandlers.cancel}
                            color="error"
                        >
                            Abbrechen
                        </Button>
                        <Button
                            onClick={() => EventHandlers.sendEmail.mutate()}
                            disabled={!customer.isFetched || EventHandlers.sendEmail.isPending}
                        >
                            Emails verschicken
                            {EventHandlers.sendEmail.isPending && <CircularProgress size={20} />}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Dialog>
    );
}
