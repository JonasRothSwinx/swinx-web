import { AddIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import { randomDesk, randomId } from "@mui/x-data-grid-generator";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AssignedInfluencer from "./AssignedInfluencer";
import dataClient from "@/app/ServerFunctions/database";

type OpenInfluencerDetailsProps = {
    influencers: Influencer.Full[];
    campaignId: string;
    setCampaign: (campaign: Campaign.Campaign) => void;
    placeholders: Assignment.Assignment[];
    events: TimelineEvent.Event[];
};

type eventDict = { [key: string]: TimelineEvent.Event[] };

export default function OpenInfluencerDetails(props: OpenInfluencerDetailsProps) {
    const { campaignId, setCampaign, events, placeholders, influencers } = props;
    const queryClient = useQueryClient();
    const campaign = useSuspenseQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => dataClient.campaign.get(campaignId),
    });
    const [assignedInfluencers, setAssignedInfluencers] = useState<Assignment.Assignment[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [targetAssignment, setTargetAssignment] = useState<Assignment.Assignment>();

    useEffect(() => {
        function getInfluencers() {
            // debugger;
            // console.log(openInfluencers);
            const assignments: Assignment.Assignment[] = campaign.data.assignedInfluencers ?? [];

            for (const event of events /* .filter((event) => event.assignment.isPlaceholder) */) {
                switch (true) {
                    case TimelineEvent.isSingleEvent(event): {
                        const assignment = assignments.find(
                            (x) => x.id === event.assignments[0]?.id,
                        );
                        if (!assignment) continue;
                        if (assignment.timelineEvents.find((x) => x.id === event.id)) {
                            continue;
                        }

                        assignment.timelineEvents.push(event);
                        break;
                    }
                    case TimelineEvent.isMultiEvent(event): {
                        const assignment = assignments.find((x) =>
                            event.assignments?.find((y) => {
                                y.id === x.id;
                            }),
                        );
                        if (!assignment) continue;
                        if (assignment.timelineEvents.find((x) => x.id === event.id)) {
                            continue;
                        }

                        assignment.timelineEvents.push(event);
                        break;
                    }
                }
            }

            for (const assignment of assignments) {
                assignment.timelineEvents.sort((a, b) =>
                    a.date && b.date ? a.date.localeCompare(b.date) : 0,
                );
            }
            return assignments;
        }
        setAssignedInfluencers(getInfluencers());
        return () => {};
    }, [/* placeholders,  */ events, campaign.data]);
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
                campaign: { id: campaignId },
            };
            dataClient.assignment.create(newPlaceholder).then((id) => {
                // console.log("got id");
                // const newPlaceholders = campaign.assignedInfluencers.map((x) =>
                //     x.id === tempId ? { ...x, id: id } : x
                // );
                const newPlaceholders = [
                    ...campaign.data.assignedInfluencers,
                    { ...newPlaceholder, id },
                ];
                // console.log({ newPlaceholders });
                setIsProcessing(false);
            });
            const newCampaign: Campaign.Campaign = {
                ...campaign.data,
                assignedInfluencers: [...campaign.data.assignedInfluencers, newPlaceholder],
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
                    {campaign.data && (
                        <>
                            {campaign.data.assignedInfluencers.map((assignment) => {
                                // console.log(influencer);
                                return (
                                    <AssignedInfluencer
                                        key={assignment.id}
                                        campaignId={campaign.data.id}
                                        assignedInfluencer={assignment}
                                        // campaign={campaign}
                                        // setCampaign={setCampaign}
                                        // influencers={influencers}
                                        isProcessing={isProcessing}
                                        setIsProcessing={setIsProcessing}
                                    />
                                );
                            })}
                            <Button onClick={EventHandlers.addAssignment} disabled={isProcessing}>
                                <AddIcon />
                                <Typography>Neuer Influencer</Typography>
                                {isProcessing && <CircularProgress />}
                            </Button>
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
        </>
    );
}
