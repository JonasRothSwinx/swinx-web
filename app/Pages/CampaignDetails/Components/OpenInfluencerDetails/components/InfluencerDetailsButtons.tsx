import { AddIcon, DeleteIcon, EuroSymbolIcon, PersonSearchIcon, PrintIcon } from "@/app/Definitions/Icons";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Tooltip, IconButton } from "@mui/material";
import { MouseEvent, useState } from "react";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import TimelineEventDialog from "@/app/Pages/Dialogs/TimelineEventDialog";
import AssignmentDialog from "@/app/Pages/Dialogs/AssignmentDialog";
import CandidatePicker from "../CandidatePicker";
import BudgetDialog from "@/app/Pages/Dialogs/BudgetDialog";
import { useQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Confirm } from "@/app/Components/Popups";

type openDialog = "none" | "timelineEvent" | "assignmentDialog" | "candidates" | "budget" | "notes" | "delete";
interface InfluencerDetailsButtonProps {
    setIsProcessing: (state: boolean) => void;
    isProcessing: boolean;
    setCampaign: (campaign: Campaign.Campaign) => void;
    campaign: Campaign.Campaign;
    assignment: Assignment.Assignment;
    influencers: Influencer.InfluencerFull[];
}
export function InfluencerDetailsButtons(props: InfluencerDetailsButtonProps) {
    const { isProcessing, setIsProcessing, campaign, setCampaign, assignment, influencers } = props;
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => getUserGroups(),
        placeholderData: [],
    });

    const EventHandlers = {
        onDialogClose: () => {
            setOpenDialog("none");
        },
        deleteAssignment: () => {
            dbInterface.assignment.delete(assignment);
            const newCampaign = {
                ...campaign,
                assignedInfluencers: campaign.assignedInfluencers.filter((x) => x.id !== assignment.id),
            };
            setCampaign(newCampaign);
        },
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
        setAssignment: (targetAssignment: Assignment.Assignment, updatedValues?: Partial<Assignment.Assignment>) => {
            // debugger;
            // console.log(targetAssignment);
            if (updatedValues) {
                const updateObject = { id: targetAssignment.id, ...updatedValues };
                console.log(updateObject);
                dbInterface.assignment.update(updateObject);
            }
            const newCampaign: Campaign.Campaign = {
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
        [state in openDialog]: JSX.Element | null;
    } = {
        none: null,
        timelineEvent: (
            <TimelineEventDialog
                // isOpen={openDialog === "timelineEvent"}
                onClose={EventHandlers.onDialogClose}
                influencers={[]}
                parent={campaign}
                setParent={setCampaign}
                targetAssignment={assignment}
            />
        ),
        assignmentDialog: (
            <AssignmentDialog
                // isOpen={openDialog === "assignmentDialog"}
                parent={campaign}
                setParent={setCampaign}
                onClose={EventHandlers.onDialogClose}
            />
        ),
        candidates: (
            <CandidatePicker
                influencers={influencers}
                assignment={assignment}
                onClose={EventHandlers.onDialogClose}
                setAssignment={EventHandlers.setAssignment}
            />
        ),
        budget: (
            <BudgetDialog
                previousBudget={assignment.budget ?? 0}
                onClose={EventHandlers.onDialogClose}
                onSave={(budget: number) => {
                    EventHandlers.setAssignment(assignment, { budget });
                }}
            />
        ),
        delete: (
            <Confirm
                title="Löschen"
                message="Sind Sie sicher, dass Sie diese Zuweisung löschen möchten?"
                onClose={EventHandlers.onDialogClose}
                onConfirm={EventHandlers.deleteAssignment}
                onCancel={() => {}}
            />
        ),
        notes: null,
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
            {DialogElements[openDialog]}
            <Tooltip title="Honorar bearbeiten" placement="top">
                <span>
                    <IconButton disabled={isProcessing} onClick={EventHandlers.openBudget()}>
                        <EuroSymbolIcon color={assignment.budget ? "inherit" : "error"} />
                    </IconButton>
                </span>
            </Tooltip>
            {hasNecessaryData(assignment) && (
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
                        <AddIcon color={assignment.timelineEvents.length > 0 ? "inherit" : "error"} />
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
            {userGroups.data?.includes("admin") && (
                <Tooltip title="Log assignment" placement="top">
                    <span>
                        <IconButton disabled={isProcessing} onClick={() => console.log(assignment)}>
                            <PrintIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            )}
        </div>
    );
}
function hasNecessaryData(assignment: Assignment.Assignment) {
    return !!assignment.budget && assignment.budget > 0 && assignment.timelineEvents.length > 0;
}
