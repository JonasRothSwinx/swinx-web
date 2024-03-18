import { ExpandMoreIcon } from "@/app/Definitions/Icons";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Unstable_Grid2 as Grid, Accordion, AccordionDetails, AccordionSummary, Skeleton } from "@mui/material";
import dayjs from "@/app/configuredDayJs";
import { useEffect, useState } from "react";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import categorizeEvents, { EventCategory } from "./functions/categorizeEvents";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import EventCategoryDisplay from "./EventCategoryDisplay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtons } from "./components/InfluencerDetailsButtons";
import { InfluencerName } from "./components/InfluencerName";

interface AssignedInfluencerProps {
    campaignId: string;
    assignedInfluencer: Assignment.Assignment;
    // campaign: Campaign.Campaign;
    // setCampaign: (campaign: Campaign.Campaign) => void;
    // influencers: Influencer.InfluencerFull[];
    isProcessing: boolean;
    setIsProcessing: (state: boolean) => void;
    setHighlightedEvent: (event?: TimelineEvent.TimelineEvent) => void;
}
export default function AssignedInfluencer(props: AssignedInfluencerProps): JSX.Element {
    const {
        campaignId,
        assignedInfluencer,
        // campaign,
        // setCampaign,
        // influencers,
        isProcessing,
        setIsProcessing,
        setHighlightedEvent,
    } = props;

    const queryClient = useQueryClient();
    const campaign = useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => dbInterface.campaign.get(campaignId),
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dbInterface.influencer.list(),
        placeholderData: [],
    });
    const assignmenEvents = useQuery({
        queryKey: ["assignmentEvents", assignedInfluencer.id],
        queryFn: async () => {
            const raw = await dbInterface.timelineEvent.listByAssignment(assignedInfluencer.id);
            return raw.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        },
        placeholderData: [],
    });

    const [categorizedEvents, setCategorizedEvents] = useState<EventCategory[]>([]);

    useEffect(() => {
        console.log("recategorizing events");
        const newCategorizedEvents = categorizeEvents(assignmenEvents?.data ?? []);
        setCategorizedEvents(newCategorizedEvents);
        console.log({ newCategorizedEvents });
    }, [assignmenEvents.data, campaign.data]);
    const EventHandlers = {
        setCampaign: (updatedCampaign: Campaign.Campaign) => {
            queryClient.setQueryData(["campaign", campaignId], updatedCampaign);
            campaign.refetch();
            const newAssignmentEvents = campaign.data?.assignedInfluencers.find(
                (x) => x.id === assignedInfluencer.id
            )?.timelineEvents;
            queryClient.setQueryData(["assignmentEvents", assignedInfluencer.id], newAssignmentEvents);
            assignmenEvents.refetch();
        },
    };

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
                    {!campaign.data ? (
                        <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                        <InfluencerDetailsButtons
                            influencers={influencers.data ?? []}
                            assignment={assignedInfluencer}
                            campaign={campaign.data}
                            setCampaign={EventHandlers.setCampaign}
                            isProcessing={isProcessing}
                            setIsProcessing={setIsProcessing}
                        />
                    )}
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {campaign.isLoading && !campaign.data ? (
                    <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={"100%"}
                        sx={{ borderRadius: "20px" }}
                    ></Skeleton>
                ) : (
                    <>
                        {categorizedEvents.map((category, index) => {
                            return (
                                <EventCategoryDisplay
                                    key={index}
                                    category={category}
                                    setHighlightedEvent={setHighlightedEvent}
                                />
                            );
                        })}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
