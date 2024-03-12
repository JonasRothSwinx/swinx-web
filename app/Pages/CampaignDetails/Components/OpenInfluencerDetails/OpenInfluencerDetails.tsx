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
import AssignedInfluencer from "./AssignedInfluencer";

type OpenInfluencerDetailsProps = {
    influencers: Influencer.InfluencerFull[];
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    placeholders: Assignment.Assignment[];
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: (event?: TimelineEvent.TimelineEvent) => void;
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
                            <AssignedInfluencer
                                key={assignment.id}
                                assignedInfluencer={assignment}
                                campaign={campaign}
                                setCampaign={setCampaign}
                                influencers={influencers}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                                setHighlightedEvent={setHighlightedEvent}
                            />
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
