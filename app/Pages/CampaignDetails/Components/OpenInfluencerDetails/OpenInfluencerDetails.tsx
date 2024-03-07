import { AddIcon, DeleteIcon, ExpandMoreIcon, PersonSearchIcon } from "@/app/Definitions/Icons";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import Influencer from "@/app/ServerFunctions/types/influencer";
import Assignment from "@/app/ServerFunctions/types/assignment";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    CircularProgress,
    Fade,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import AssignmentDialog from "../../../Dialogs/AssignmentDialog";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import {
    randomCity,
    randomDesk,
    randomId,
    randomName,
    randomTraderName,
    randomUserName,
} from "@mui/x-data-grid-generator";
import TimelineEventDialog from "../../../Dialogs/TimelineEventDialog";
import CandidatePicker from "./CandidatePicker";

type OpenInfluencerDetailsProps = {
    influencers: Influencer.InfluencerFull[];
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    placeholders: Assignment.Assignment[];
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: Dispatch<SetStateAction<TimelineEvent.TimelineEvent | undefined>>;
};

type eventDict = { [key: string]: TimelineEvent.TimelineEvent[] };

export default function OpenInfluencerDetails(props: OpenInfluencerDetailsProps) {
    const { campaign, setCampaign, events, placeholders, setHighlightedEvent, influencers } = props;
    const [openInfluencers, setOpenInfluencers] = useState<Assignment.Assignment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [targetAssignment, setTargetAssignment] = useState<Assignment.Assignment>();

    useEffect(() => {
        function getInfluencers() {
            // debugger;
            // console.log(openInfluencers);
            const assignments: Assignment.Assignment[] = campaign.assignedInfluencers;

            for (const event of events /* .filter((event) => event.assignment.isPlaceholder) */) {
                const assignment = assignments.find((x) => x.id === event.assignment?.id);
                if (!assignment) continue;
                if (assignment.timelineEvents.find((x) => x.id === event.id)) {
                    continue;
                }
                assignment.timelineEvents.push(event);
            }

            for (const assignment of assignments) {
                assignment.timelineEvents.sort((a, b) =>
                    a.date && b.date ? a.date.localeCompare(b.date) : 0,
                );
            }
            return assignments;
        }
        setOpenInfluencers(getInfluencers());
        return () => {};
    }, [/* placeholders,  */ events, campaign]);
    const EventHandlers = {
        addAssignment: () => {
            setIsProcessing(true);
            const tempId = randomId();
            const newPlaceholder: Assignment.Assignment = {
                id: tempId,
                placeholderName: `${randomDesk()}`,
                budget: 0,
                timelineEvents: [],
                isPlaceholder: true,
                influencer: null,
            };
            dbInterface.assignment.create(newPlaceholder, campaign.id).then((id) => {
                // console.log("got id");
                // const newPlaceholders = campaign.assignedInfluencers.map((x) =>
                //     x.id === tempId ? { ...x, id: id } : x
                // );
                const newPlaceholders = [
                    ...campaign.assignedInfluencers,
                    { ...newPlaceholder, id },
                ];
                // console.log({ newPlaceholders });
                setIsProcessing(false);
                setCampaign({ ...campaign, assignedInfluencers: newPlaceholders });
            });
            const newCampaign: Campaign.Campaign = {
                ...campaign,
                assignedInfluencers: [...campaign.assignedInfluencers, newPlaceholder],
            };
            setCampaign(newCampaign);
        },
    };
    return (
        <>
            <>{/* Dialogs */}</>
            <Accordion defaultExpanded disableGutters variant="outlined">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    Influencer
                </AccordionSummary>
                <AccordionDetails>
                    {openInfluencers.map((assignment) => {
                        // console.log(influencer);
                        return (
                            <Accordion
                                key={assignment.id}
                                defaultExpanded
                                disableGutters
                                variant="outlined"
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        "& .MuiAccordionSummary-content:not(.Mui-expanded) button":
                                            {
                                                display: "none",
                                            },
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            maxHeight: "1em",
                                        }}
                                    >
                                        <Typography>{`Influencer ${assignment.placeholderName}`}</Typography>
                                        <InfluencerDetailsButtons
                                            influencers={influencers}
                                            assignment={assignment}
                                            campaign={campaign}
                                            setCampaign={setCampaign}
                                            isProcessing={isProcessing}
                                            setIsProcessing={setIsProcessing}
                                        />
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {assignment.timelineEvents.length > 0 && (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Invites:{" "}
                                                {assignment.timelineEvents
                                                    .filter(
                                                        (
                                                            x,
                                                        ): x is TimelineEvent.TimelineEventInvites => {
                                                            return TimelineEvent.isInviteEvent(x);
                                                        },
                                                    )
                                                    .reduce((sum: number, event) => {
                                                        return (
                                                            sum + (event?.inviteEvent?.invites ?? 0)
                                                        );
                                                    }, 0)}{" "}
                                                verteilt über {assignment.timelineEvents?.length}{" "}
                                                Termine
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    {assignment.timelineEvents?.map((event, i) => {
                                                        const date = dayjs(event.date);
                                                        return (
                                                            <Grid
                                                                xs={12}
                                                                key={
                                                                    (event.id ?? "") + i.toString()
                                                                }
                                                                onClick={() => {
                                                                    setHighlightedEvent(event);
                                                                }}
                                                            >
                                                                <Typography>
                                                                    {date.format("DD.MM.YYYY")} (
                                                                    {date.fromNow()})
                                                                </Typography>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                    <Button onClick={EventHandlers.addAssignment} disabled={isProcessing}>
                        <AddIcon />
                        <Typography>Neuer Influencer</Typography>
                        {isProcessing && <CircularProgress />}
                    </Button>
                </AccordionDetails>
            </Accordion>
        </>
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
