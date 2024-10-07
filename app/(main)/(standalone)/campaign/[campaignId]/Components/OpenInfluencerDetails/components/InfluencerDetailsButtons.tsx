import {
    AddIcon,
    ArrowOutwardIcon,
    DeleteIcon,
    EuroSymbolIcon,
    PersonSearchIcon,
    PrintIcon,
} from "@/app/Definitions/Icons";
import { Assignment, Campaign, Influencer, Event, Events, Influencers } from "@/app/ServerFunctions/types";
import { Tooltip, IconButton, Box } from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { TimelineEventDialog, BudgetDialog } from "@/app/Components/Dialogs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Confirm } from "@/app/Components/Popups";
import { dataClient } from "@dataClient";
import { CandidatePickerTabs } from "../../../Candidate Picker/CandidatePicker";
import { encodeQueryParams, getTaskPageUrl } from "@/app/utils";
import Link from "next/link";
import { queryKeys } from "@/app/(main)/queryClient/keys";

type openDialog = "none" | "timelineEvent" | "candidates" | "budget" | "notes" | "delete" | "emailPreview";

export type InfluencerDetailsButtonsOpenDialog = openDialog;

interface InfluencerDetailsButtonProps {
    setIsProcessing: (state: boolean) => void;
    isProcessing: boolean;
    setCampaign: (campaign: Campaign) => void;
    campaign: Campaign;
    assignment: Assignment;
    influencers: Influencers.Full[];
    events: Event[];
}
export function InfluencerDetailsButtons(props: InfluencerDetailsButtonProps) {
    const { isProcessing, setIsProcessing, campaign, setCampaign, assignment, influencers, events } = props;
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    const userGroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
        queryFn: () => getUserGroups(),
        placeholderData: [],
    });

    const EventHandlers = {
        onDialogClose: (hasChanged = false, newDialog: openDialog = "none") => {
            setOpenDialog(newDialog);
        },
        // deleteAssignment: () => {
        //     if (!assignment) return;
        //     database.assignment.delete(assignment);
        //     const newCampaign = {
        //         ...campaign,
        //         assignedInfluencers: campaign.assignedInfluencers.filter(
        //             (x) => x.id !== assignment.id,
        //         ),
        //     };
        //     setCampaign(newCampaign);
        // },
        deleteAssignment: useMutation({
            mutationFn: async () => {
                if (!assignment) return;
                await dataClient.assignment.delete(assignment.id);
            },
            onMutate: async () => {
                await queryClient.cancelQueries({ queryKey: ["assignment", assignment.id] });
                await queryClient.cancelQueries({ queryKey: ["assignments", campaign.id] });
                await queryClient.cancelQueries({ queryKey: ["campaign", campaign.id] });
                const prevCampaign = campaign;
                const prevAssignments = campaign.assignedInfluencers;

                queryClient.setQueryData(["assignment", assignment.id], undefined);
                queryClient.setQueryData(
                    ["assignments", campaign.id],
                    prevAssignments.filter((x) => x.id !== assignment.id)
                );
                queryClient.setQueryData(["campaign", campaign.id], {
                    ...prevCampaign,
                    assignedInfluencers: prevAssignments.filter((x) => x.id !== assignment.id),
                });
                return { prevCampaign, prevAssignments };
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ["assignments", campaign.id] });
                queryClient.invalidateQueries({ queryKey: ["campaign", campaign.id] });
            },
            onError: (error, _, context) => {
                console.error(error);
                const { prevCampaign, prevAssignments } = context ?? {};
                if (prevCampaign && prevAssignments) {
                    queryClient.setQueryData(["assignment", assignment.id], assignment);
                    queryClient.setQueryData(["assignments", campaign.id], prevAssignments);
                    queryClient.setQueryData(["campaign", campaign.id], prevCampaign);
                }
            },
        }),
        addEvents: () => (e: MouseEvent) => {
            e.stopPropagation();
            setOpenDialog("timelineEvent");
        },
        openCandidates: () => (e: MouseEvent) => {
            e.stopPropagation();
            setOpenDialog("candidates");
        },
        preventClickthrough: (e: MouseEvent) => {
            e.stopPropagation();
        },
        setAssignment: (targetAssignment: Assignment, updatedValues?: Partial<Assignment>) => {
            // debugger;
            // console.log(targetAssignment);
            if (updatedValues) {
                const id = targetAssignment.id;
                dataClient.assignment.update({ ...updatedValues, id }, targetAssignment);
            }
            const newCampaign: Campaign = {
                ...campaign,
                assignedInfluencers: [
                    ...campaign.assignedInfluencers.map((x) => (x.id === targetAssignment.id ? targetAssignment : x)),
                ],
            };
            // console.log({ newCampaign, assignments: newCampaign.assignedInfluencers });
            setCampaign(newCampaign);
        },
        openBudget: () => (e: MouseEvent) => {
            e.stopPropagation();
            setOpenDialog("budget");
        },
        confirmDelete: () => (e: MouseEvent) => {
            e.stopPropagation();
            setOpenDialog("delete");
        },
    };
    const DialogElements: {
        [state in openDialog]: () => React.JSX.Element | null;
    } = {
        none: () => null,
        timelineEvent: () => (
            <TimelineEventDialog
                // isOpen={openDialog === "timelineEvent"}
                onClose={EventHandlers.onDialogClose}
                targetAssignment={assignment}
                campaignId={campaign.id}
            />
        ),
        candidates: () => (
            <CandidatePickerTabs
                influencers={influencers}
                assignmentId={assignment.id}
                onClose={EventHandlers.onDialogClose}
                setAssignment={EventHandlers.setAssignment}
            />
        ),
        budget: () => (
            <BudgetDialog
                previousBudget={assignment.budget ?? 0}
                onClose={EventHandlers.onDialogClose}
                onSave={(budget: number) => {
                    EventHandlers.setAssignment(assignment, { budget });
                }}
            />
        ),
        delete: () => (
            <Confirm
                title="Löschen"
                message="Sind Sie sicher, dass Sie diese Zuweisung löschen möchten?"
                onClose={EventHandlers.onDialogClose}
                onConfirm={() => EventHandlers.deleteAssignment.mutate()}
                onCancel={() => {}}
            />
        ),
        emailPreview: () => null,
        // <EmailPreview
        //     assignment={assignment}
        //     onClose={EventHandlers.onDialogClose}
        //     candidates={assignment.candidates ?? []}
        // />
        notes: () => null,
    };
    return (
        <div
            onClick={EventHandlers.preventClickthrough}
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "right",
            }}
        >
            {DialogElements[openDialog]()}
            <Tooltip title="Honorar bearbeiten" placement="top">
                <Box>
                    <IconButton disabled={isProcessing} onClick={EventHandlers.openBudget()}>
                        <EuroSymbolIcon color={assignment.budget ? "inherit" : "error"} />
                    </IconButton>
                </Box>
            </Tooltip>
            {hasNecessaryData(assignment, events) && (
                <Tooltip title="Kandidaten zuweisen" placement="top">
                    <span>
                        <IconButton disabled={isProcessing} onClick={EventHandlers.openCandidates()}>
                            <PersonSearchIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
            <Tooltip title="Aufgaben zuweisen" placement="top">
                <span>
                    <IconButton disabled={isProcessing} onClick={EventHandlers.addEvents()}>
                        <AddIcon color={events.length > 0 ? "inherit" : "error"} />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Löschen" placement="top">
                <span>
                    <IconButton color="error" onClick={EventHandlers.confirmDelete()} disabled={isProcessing}>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Tooltip>
            {assignment.timelineEvents.length > 0 && (
                <Tooltip title="Zur Statuspage des Influencers" placement="top">
                    <Link href={`/tasks/${assignment.id}`} target="_blank">
                        <IconButton>
                            <ArrowOutwardIcon />
                        </IconButton>
                    </Link>
                </Tooltip>
            )}
            {userGroups.data?.includes("admin") && (
                <>
                    <Tooltip title="Log assignment" placement="top">
                        <span>
                            <IconButton disabled={isProcessing} onClick={() => console.log(assignment)}>
                                <PrintIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </>
            )}
        </div>
    );
}
function hasNecessaryData(assignment: Assignment, events: Event[]) {
    return /* !!assignment.budget && assignment.budget > 0 && */ events.length > 0;
}
