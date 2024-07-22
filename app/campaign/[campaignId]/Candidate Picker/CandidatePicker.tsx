import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Nullable } from "@/app/Definitions/types";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Assignment, Influencers } from "@/app/ServerFunctions/types";
import {
    Button,
    Dialog,
    IconButton,
    Skeleton,
    Tabs,
    Tab,
    Tooltip,
    Typography,
    SxProps,
    Box,
    Grow,
    Collapse,
    Link,
} from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import EmailPreview from "../Email Preview";
import { Candidates } from "@/app/ServerFunctions/types";
import { dataClient } from "@/app/ServerFunctions/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtonsOpenDialog } from "../Components/OpenInfluencerDetails/components/InfluencerDetailsButtons";
import InfluencerTable from "./InfluencerTable";
import CandidateResponses from "./CandidateResponses";
import { TransitionGroup } from "react-transition-group";
import emailClient from "@/app/Emails";
import { InfluencerTaskEncodedData } from "@/app/utils";
import { sendDecisionNotification } from "./Functions";
import { useConfirm } from "material-ui-confirm";

// eslint-disable-next-line
interface CandidatePickerProps {
    influencers: Influencers.Full[];
    assignmentId: string;
    setAssignment: (assignment: Assignment, updatedValues?: Partial<Assignment>) => void;
    onClose: (hasChanged?: boolean, newDialog?: InfluencerDetailsButtonsOpenDialog) => void;
}

export function CandidatePickerTabs({ setAssignment, assignmentId, onClose }: CandidatePickerProps) {
    const queryClient = useQueryClient(); //TODO: change props to only require assignmentId, get asignemnt by query
    const confirm = useConfirm();

    // const influencers = useQuery({
    //     queryKey: ["influencers"],
    //     queryFn: () => dataClient.influencer.list(),
    // });

    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => dataClient.assignment.get(assignmentId),
    });
    const campaign = useQuery({
        enabled: !!assignment.data?.campaign.id,
        queryKey: ["campaign", assignment.data?.campaign.id],
        queryFn: () => dataClient.campaign.get(assignment.data!.campaign.id),
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
            if (!assignment.data || !campaign.data || !assignment.data.candidates) return;
            // if (
            //     !confirm(
            //         `Möchtest du ${candidate.influencer.firstName} wirklich endgültig für diese Position zuweisen?\nAlle anderen Kandidaten erhalten hierbei eine Absagemail`,
            //     )
            // ) {
            //     return;
            // }
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
                    title: `${Influencers.getFullName(candidate.influencer)} erhält keine automatischen Emails`,
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
                assignment.data
            );
            onClose();
            const emailNone = await sendDecisionNotification({
                acceptedCandidate: candidate,
                rejectedCandidates: assignment.data.candidates.filter((c) => c.id !== candidate.id),
                customer: campaign.data.customers[0],
                projectManagers: campaign.data.projectManagers,
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
                                        <Link target="_blank" href={`mailto:${c.influencer.email}`}>
                                            {`${Influencers.getFullName(c.influencer)}: ${c.influencer.email}`}
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
            assignment.data?.candidates?.filter((candidate) => candidate.invitationSent === true).length ?? 0;
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
        <Dialog open onClose={() => EventHandlers.onClose()} fullWidth sx={styles}>
            <TabContext value={tabValue}>
                <Box id="TabListContainer">
                    <TabList
                        id="TabList"
                        onChange={EventHandlers.handleTabChange}
                        aria-label="tab list"
                        variant="fullWidth"
                    >
                        <Tab label="Influencer einladen" value={"invite"} />
                        <Tab label="Antworten" value={"response"} />
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
