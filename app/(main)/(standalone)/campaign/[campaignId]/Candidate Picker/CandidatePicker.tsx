import { Assignment, Candidates, Customer, Influencers } from "@/app/ServerFunctions/types";
import { dataClient } from "@dataClient";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Dialog, Grow, Link, Skeleton, SxProps, Tab, Typography } from "@mui/material";
import { useQueries, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useConfirm } from "material-ui-confirm";
import React, { useEffect, useState } from "react";
import { InfluencerDetailsButtonsOpenDialog } from "../Components/OpenInfluencerDetails/components/InfluencerDetailsButtons";
import CandidateResponses from "./CandidateResponses";
import { sendDecisionNotification } from "./Functions";
import InfluencerTable from "./InfluencerTable";
import { queryKeys } from "@/app/(main)/queryClient/keys";

// eslint-disable-next-line
interface CandidatePickerProps {
    influencers: Influencers.Full[];
    assignmentId: string;
    campaignId: string;
    setAssignment: (assignment: Assignment, updatedValues?: Partial<Assignment>) => void;
    onClose: (hasChanged?: boolean, newDialog?: InfluencerDetailsButtonsOpenDialog) => void;
}

export function CandidatePickerTabs({
    setAssignment,
    assignmentId,
    campaignId,
    onClose,
}: CandidatePickerProps) {
    const queryClient = useQueryClient(); //TODO: change props to only require assignmentId, get asignemnt by query
    const confirm = useConfirm();

    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => dataClient.assignment.get(assignmentId),
    });
    const campaign = useQuery({
        enabled: !!assignment.data?.campaign.id,
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: () => dataClient.campaign.getRef(campaignId),
    });

    const primaryCustomer = useQuery({
        enabled: !!campaign.data,
        queryKey: queryKeys.customer.one(campaign.data?.customerIds[0] ?? ""),
        queryFn: () => dataClient.customer.get({ id: campaign.data?.customerIds[0] ?? "" }),
    });

    const projectManagers = useQueries({
        queries:
            campaign.data?.projectManagerIds?.map((id) => {
                return {
                    queryKey: queryKeys.projectManager.one(id),
                    queryFn: () => dataClient.projectManager.get({ id }),
                };
            }) ?? [],
    });

    const [tabValue, setTabValue] = useState("none");
    useEffect(() => {}, [assignment.data]);

    const EventHandlers = {
        onClose: (submit = true) => {
            if (submit) {
                console.log("submitCandidates before closing");
                // EventHandlers.submitCandidates();
            }
            onClose();
            // setChangedCandidates({ removed: [], added: [] });
        },
        assignInfluencer: async (candidate: Candidates.Candidate) => {
            if (
                !assignment.data ||
                !campaign.data ||
                !assignment.data.candidates ||
                !primaryCustomer.data
            )
                return;
            try {
                await confirm({
                    title: `Möchtest du ${candidate.influencer.firstName} wirklich endgültig für diese Position zuweisen?`,
                    description: "Alle anderen Kandidaten erhalten hierbei eine Absagemail",
                    confirmationText: "Ja",
                    cancellationText: "Nein",
                });
            } catch (error) {
                return;
            }
            if (candidate.influencer.emailLevel === "none") {
                await confirm({
                    title: `${Influencers.getFullName(
                        candidate.influencer,
                    )} erhält keine automatischen Emails`,
                    description: `Bitte kontaktiere sie/ihn persönlich unter\n ${candidate.influencer.email}`,
                    confirmationText: "Ok",
                    hideCancelButton: true,
                    allowClose: false,
                });
            }
            const newAssignment: Assignment = {
                ...assignment.data,
                candidates: [...(assignment.data.candidates ?? []), candidate],
            };
            dataClient.assignment.update(
                {
                    id: assignment.data.id,
                    candidates: [],
                    influencer: candidate.influencer,
                    isPlaceholder: false,
                },
                assignment.data,
            );
            onClose();
            const emailNone = await sendDecisionNotification({
                acceptedCandidate: candidate,
                rejectedCandidates: assignment.data.candidates.filter((c) => c.id !== candidate.id),
                customer: primaryCustomer.data,
                projectManagers: projectManagers
                    .map((pm) => pm.data)
                    .filter((pm) => pm !== undefined && pm !== null),
                // campaign: campaign.data,
                assignment: assignment.data,
            });
            if (emailNone.length > 0) {
                await confirm({
                    title: "Einige Influencer erhalten keine automatische Absage",
                    description: (
                        <Typography>
                            Bitte kontaktiere sie persönlich:
                            {emailNone.map((c) => {
                                return (
                                    <React.Fragment key={c.id}>
                                        <br />
                                        <Link
                                            target="_blank"
                                            href={`mailto:${c.influencer.email}`}
                                        >
                                            {`${Influencers.getFullName(c.influencer)}: ${
                                                c.influencer.email
                                            }`}
                                        </Link>
                                    </React.Fragment>
                                );
                            })}
                        </Typography>
                    ),
                    confirmationText: "Ok",
                    hideCancelButton: true,
                    allowClose: false,
                });
            }

            console.log("assignInfluencer");
        },

        handleTabChange: (event: React.SyntheticEvent, newValue: string) => {
            console.log({ event, newValue });
            setTabValue(newValue);
        },
    };
    //#region Effects
    useEffect(() => {
        if (tabValue !== "none") return;
        const numberOfInvitedCandidates =
            assignment.data?.candidates?.filter((candidate) => candidate.invitationSent === true)
                .length ?? 0;
        if (numberOfInvitedCandidates > 0) {
            setTabValue("response");
        } else {
            setTabValue("invite");
        }
    }, [assignment.data, tabValue]);
    //#endregion

    const styles: SxProps = {
        "&": {
            margin: "0",
            minHeight: "50vh",
            "& .MuiPaper-root": {
                // width: "fit-content",
                maxWidth: "75%",
            },
            // transition: "all 5s",
            "#TabList": {
                // backgroundColor: "var(--swinx-blue)",
                ".MuiTab-root": {
                    color: "white",
                    backgroundColor: "var(--swinx-blue-light)",
                    transition: "all 0.5s",
                    "&.Mui-selected": {
                        color: "var(--swinx-blue)",
                        // backgroundColor: "var(--swinx-blue-light)",
                        backgroundColor: "white",
                        flex: 2,
                        // transform: "scaleX(1.4)",
                    },
                },
                ".MuiTabs-indicator": {
                    transition: "all 0.5s",
                    backgroundColor: "var(--swinx-blue)",
                },
            },
        },
    };
    if (!assignment.data) return <Loading />;
    return (
        <Dialog
            open
            onClose={() => EventHandlers.onClose()}
            fullWidth
            sx={styles}
        >
            <TabContext value={tabValue}>
                <Box id="TabListContainer">
                    <TabList
                        id="TabList"
                        onChange={EventHandlers.handleTabChange}
                        aria-label="tab list"
                        variant="fullWidth"
                    >
                        <Tab
                            label="Influencer einladen"
                            value={"invite"}
                        />
                        <Tab
                            label="Antworten"
                            value={"response"}
                        />
                    </TabList>
                </Box>
                <Grow in={tabValue === "invite"}>
                    <TabPanel value={"invite"}>
                        <InfluencerTable
                            assignmentId={assignmentId}
                            // openEmailPreview={() => EventHandlers.openDialog("emailPreview")}
                            setTab={setTabValue}
                        />
                    </TabPanel>
                </Grow>
                <Grow in={tabValue === "response"}>
                    <TabPanel value={"response"}>
                        <CandidateResponses
                            assignmentId={assignmentId}
                            assignInfluencer={EventHandlers.assignInfluencer}
                        />
                    </TabPanel>
                </Grow>
            </TabContext>
        </Dialog>
    );
}

function Loading() {
    return (
        <Dialog open>
            <Box width={"min(50vw,500px)"}>
                <Skeleton height={"100px"} />
                <Skeleton height={"100px"} />
                <Skeleton height={"100px"} />
            </Box>
        </Dialog>
    );
}
