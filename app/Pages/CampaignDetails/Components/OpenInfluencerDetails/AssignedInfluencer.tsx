import { AddIcon, DeleteIcon, ExpandMoreIcon, PersonSearchIcon } from "@/app/Definitions/Icons";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    Unstable_Grid2 as Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Tooltip,
    IconButton,
} from "@mui/material";
import dayjs from "@/app/configuredDayJs";
import { MouseEvent, useEffect, useState } from "react";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import TimelineEventDialog from "@/app/Pages/Dialogs/TimelineEventDialog";
import AssignmentDialog from "@/app/Pages/Dialogs/AssignmentDialog";
import CandidatePicker from "./CandidatePicker";
import categorizeEvents, { EventCategory } from "./functions/categorizeEvents";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import EventCategoryDisplay from "./EventCategoryDisplay";

interface AssignedInfluencerProps {
    assignedInfluencer: Assignment.Assignment;
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    influencers: Influencer.InfluencerFull[];
    isProcessing: boolean;
    setIsProcessing: (state: boolean) => void;
    setHighlightedEvent: (event?: TimelineEvent.TimelineEvent) => void;
}
export default function AssignedInfluencer(props: AssignedInfluencerProps): JSX.Element {
    const {
        assignedInfluencer,
        campaign,
        setCampaign,
        influencers,
        isProcessing,
        setIsProcessing,
        setHighlightedEvent,
    } = props;
    const [categorizedEvents, setCategorizedEvents] = useState<EventCategory[]>([]);
    useEffect(() => {
        const newCategorizedEvents = categorizeEvents(assignedInfluencer.timelineEvents);
        setCategorizedEvents(newCategorizedEvents);
        console.log(newCategorizedEvents);
    }, [assignedInfluencer.timelineEvents]);
    return (
        <Accordion key={assignedInfluencer.id} defaultExpanded disableGutters variant="outlined">
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                        display: "none",
                    },
                }}
            >
                <div className={stylesExporter.campaignDetails.assignmentAccordionHeader}>
                    <InfluencerName assignedInfluencer={assignedInfluencer} />
                    <InfluencerDetailsButtons
                        influencers={influencers}
                        assignment={assignedInfluencer}
                        campaign={campaign}
                        setCampaign={setCampaign}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                    />
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {categorizedEvents.map((category, index) => {
                    return (
                        <EventCategoryDisplay
                            key={index}
                            category={category}
                            setHighlightedEvent={setHighlightedEvent}
                        />
                    );
                })}
                {/* {assignedInfluencer.timelineEvents.length > 0 && (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Invites:{" "}
                            {assignedInfluencer.timelineEvents
                                .filter((x): x is TimelineEvent.TimelineEventInvites => {
                                    return TimelineEvent.isInviteEvent(x);
                                })
                                .reduce((sum: number, event) => {
                                    return sum + (event?.inviteEvent?.invites ?? 0);
                                }, 0)}{" "}
                            verteilt über {assignedInfluencer.timelineEvents?.length} Termine
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                {assignedInfluencer.timelineEvents?.map((event, i) => {
                                    const date = dayjs(event.date);
                                    return (
                                        <Grid
                                            xs={12}
                                            key={(event.id ?? "") + i.toString()}
                                            onClick={() => {
                                                setHighlightedEvent(event);
                                            }}
                                        >
                                            <Typography>
                                                {date.format("DD.MM.YYYY")} ({date.fromNow()})
                                            </Typography>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                )} */}
            </AccordionDetails>
        </Accordion>
    );
}
type openDialog = "none" | "timelineEvent" | "assignmentDialog" | "candidates";
interface InfluencerDetailsButtonProps {
    setIsProcessing: (state: boolean) => void;
    isProcessing: boolean;
    setCampaign: (campaign: Campaign.Campaign) => void;
    campaign: Campaign.Campaign;
    assignment: Assignment.Assignment;
    influencers: Influencer.InfluencerFull[];
}
function InfluencerDetailsButtons(props: InfluencerDetailsButtonProps) {
    const { isProcessing, setIsProcessing, campaign, setCampaign, assignment, influencers } = props;
    const [openDialog, setOpenDialog] = useState<openDialog>("none");

    const EventHandlers = {
        onDialogClose: () => {
            setOpenDialog("none");
        },
        deleteAssignment: () => (e: MouseEvent) => {
            e.stopPropagation();
            dbInterface.assignment.delete(assignment);
            const newCampaign = {
                ...campaign,
                assignedInfluencers: campaign.assignedInfluencers.filter(
                    (x) => x.id !== assignment.id,
                ),
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
        setAssignment: (
            targetAssignment: Assignment.Assignment,
            updatedValues?: Partial<Assignment.Assignment>,
        ) => {
            // debugger;
            // console.log(targetAssignment);
            // if (updatedValues) {
            //     const updateObject = { id: targetAssignment.id, ...updatedValues };
            //     console.log(updateObject);
            //     dbInterface.assignment.update(updateObject);
            // }
            const newCampaign: Campaign.Campaign = {
                ...campaign,
                assignedInfluencers: [
                    ...campaign.assignedInfluencers.map((x) =>
                        x.id === targetAssignment.id ? targetAssignment : x,
                    ),
                ],
            };
            // console.log({ newCampaign, assignments: newCampaign.assignedInfluencers });
            setCampaign(newCampaign);
        },
    };
    const DialogElements: { [state in openDialog]: JSX.Element | null } = {
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
            <Tooltip title="Kandidaten zuweisen" placement="top">
                <span>
                    <IconButton disabled={isProcessing} onClick={EventHandlers.openCandidates()}>
                        <PersonSearchIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Aufgaben zuweisen" placement="top">
                <span>
                    <IconButton disabled={isProcessing} onClick={EventHandlers.addEvents()}>
                        <AddIcon />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title="Löschen" placement="top">
                <span>
                    <IconButton
                        color="error"
                        onClick={EventHandlers.deleteAssignment()}
                        disabled={isProcessing}
                    >
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </div>
    );
}

function InfluencerName(props: { assignedInfluencer: Assignment.Assignment }) {
    const { assignedInfluencer } = props;
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                width: "100%",
                maxHeight: "1em",
            }}
        >
            {assignedInfluencer.isPlaceholder ? (
                <Typography>{`Influencer ${assignedInfluencer.placeholderName}`}</Typography>
            ) : (
                <Typography>{`${assignedInfluencer.influencer?.firstName} ${assignedInfluencer.influencer?.lastName}`}</Typography>
            )}
        </div>
    );
}
