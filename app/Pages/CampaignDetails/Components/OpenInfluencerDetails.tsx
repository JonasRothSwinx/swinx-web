import { AddIcon, DeleteIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
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
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import AssignmentDialog from "../../Dialogs/AssignmentDialog";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import {
    randomCity,
    randomDesk,
    randomId,
    randomName,
    randomTraderName,
    randomUserName,
} from "@mui/x-data-grid-generator";
import TimelineEventDialog from "../../Dialogs/TimelineEventDialog";

type OpenInfluencerDetailsProps = {
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    placeholders: Assignment.Assignment[];
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: Dispatch<SetStateAction<TimelineEvent.TimelineEvent | undefined>>;
};

type eventDict = { [key: string]: TimelineEvent.TimelineEvent[] };

type openDialog = "none" | "timelineEvent" | "assignmentDialog";

export default function OpenInfluencerDetails(props: OpenInfluencerDetailsProps) {
    const { campaign, setCampaign, events, placeholders, setHighlightedEvent } = props;
    const [openInfluencers, setOpenInfluencers] = useState<Assignment.Assignment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    const [targetAssignment, setTargetAssignment] = useState<Assignment.Assignment>();

    useEffect(() => {
        function getInfluencers() {
            // debugger;
            console.log(openInfluencers);
            const placeholdersGroup: Assignment.Assignment[] = campaign.assignedInfluencers;

            for (const event of events.filter((event) => event.assignment.isPlaceholder)) {
                const assignment = placeholdersGroup.find((x) => x.id === event.assignment?.id);
                if (!assignment) continue;
                assignment.timelineEvents.push(event);
            }

            // for (const influencer of placeholdersGroup) {
            //     influencer.inviteEvents.sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : 0));
            // }
            return placeholdersGroup;
        }
        setOpenInfluencers(getInfluencers());
        return () => {};
    }, [placeholders, events, campaign]);

    const EventHandlers = {
        onDialogClose: () => {
            setOpenDialog("none");
        },
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
                const newPlaceholders = [...campaign.assignedInfluencers, { ...newPlaceholder, id }];
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
        deleteAssignment: (placeholder: Assignment.Assignment) => () => {
            dbInterface.assignment.delete(placeholder);
            const newCampaign = {
                ...campaign,
                assignedInfluencers: campaign.assignedInfluencers.filter((x) => x.id !== placeholder.id),
            };
            setCampaign(newCampaign);
        },
        addEvents: (assignment: Assignment.Assignment) => () => {
            setTargetAssignment(assignment);
            setOpenDialog("timelineEvent");
        },
    };
    return (
        <>
            <>
                {/* Dialogs */}
                <AssignmentDialog
                    isOpen={openDialog === "assignmentDialog"}
                    parent={campaign}
                    setParent={setCampaign}
                    onClose={EventHandlers.onDialogClose}
                />
                <TimelineEventDialog
                    isOpen={openDialog === "timelineEvent"}
                    onClose={EventHandlers.onDialogClose}
                    influencers={[]}
                    parent={campaign}
                    setParent={setCampaign}
                    targetAssignment={targetAssignment}
                />
            </>
            <Accordion defaultExpanded disableGutters variant="outlined">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                    Offene Influencer Positionen
                </AccordionSummary>
                <AccordionDetails>
                    {openInfluencers.map((assignment) => {
                        // console.log(influencer);
                        return (
                            <Accordion key={assignment.id} defaultExpanded disableGutters variant="outlined">
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    {`Influencer ${assignment.placeholderName}`}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "right" }}>
                                        <Tooltip title="Aufgaben zuweisen" placement="top">
                                            <span>
                                                <IconButton
                                                    disabled={isProcessing}
                                                    onClick={EventHandlers.addEvents(assignment)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Löschen" placement="top">
                                            <span>
                                                <IconButton
                                                    color="error"
                                                    onClick={EventHandlers.deleteAssignment(assignment)}
                                                    disabled={isProcessing}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </div>
                                    {assignment.timelineEvents.length > 0 && (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                Invites:{" "}
                                                {assignment.timelineEvents
                                                    .filter((x): x is TimelineEvent.TimelineEventInvites => {
                                                        return TimelineEvent.isInviteEvent(x);
                                                    })
                                                    .reduce((sum: number, event) => {
                                                        return sum + (event?.inviteEvent?.invites ?? 0);
                                                    }, 0)}
                                                verteilt über {assignment.timelineEvents?.length} Termine
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    {assignment.timelineEvents?.map((event, i) => {
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
