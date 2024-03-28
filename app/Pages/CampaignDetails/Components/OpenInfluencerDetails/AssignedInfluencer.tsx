import { ExpandMoreIcon, RefreshIcon } from "@/app/Definitions/Icons";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    Unstable_Grid2 as Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Skeleton,
    Typography,
    CircularProgress,
    IconButton,
} from "@mui/material";
import dayjs from "@/app/configuredDayJs";
import { useEffect, useState } from "react";
import dbInterface from "@/app/ServerFunctions/database/.dbInterface";
import categorizeEvents, { EventCategory } from "./functions/categorizeEvents";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import EventCategoryDisplay from "./EventCategoryDisplay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtons } from "./components/InfluencerDetailsButtons";
import { InfluencerName } from "./components/InfluencerName";
import QueryDebugDisplay from "@/app/Components/QueryDebugDisplay";

interface AssignedInfluencerProps {
    campaignId: string;
    assignedInfluencer: Assignment.Assignment;
    // campaign: Campaign.Campaign;
    // setCampaign: (campaign: Campaign.Campaign) => void;
    // influencers: Influencer.InfluencerFull[];
    isProcessing: boolean;
    setIsProcessing: (state: boolean) => void;
}
export default function AssignedInfluencer(props: AssignedInfluencerProps): JSX.Element {
    const {
        campaignId,
        // assignedInfluencer,
        // campaign,
        // setCampaign,
        // influencers,
        isProcessing,
        setIsProcessing,
    } = props;

    const queryClient = useQueryClient();
    const campaign = useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => dbInterface.campaign.get(campaignId),
    });
    const campaignEvents = useQuery({
        queryKey: ["campaignEvents", campaignId],
        queryFn: async () => {
            return campaign.data?.campaignTimelineEvents ?? [];
        },
        placeholderData: [],
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dbInterface.influencer.list(),
        placeholderData: [],
    });
    const assignedInfluencer = useQuery({
        queryKey: ["assignedInfluencer", props.assignedInfluencer.id],
        queryFn: async () => {
            const assignment = await dbInterface.assignment.get(props.assignedInfluencer.id);
            const singleEvent = assignment.timelineEvents.filter((event): event is TimelineEvent.SingleEvent =>
                TimelineEvent.isSingleEvent(event)
            );
            queryClient.setQueryData(["assignmentEvents", props.assignedInfluencer.id], singleEvent);
            return assignment;
        },
        // placeholderData: props.assignedInfluencer,
        refetchOnWindowFocus: false,
    });
    const assignmentEvents = useQuery({
        queryKey: ["assignmentEvents", props.assignedInfluencer.id],
        queryFn: async () => {
            const raw = (await dbInterface.assignment.getTimelineEvents(props.assignedInfluencer)).filter(
                (event): event is TimelineEvent.SingleEvent => TimelineEvent.isSingleEvent(event)
            );
            return raw.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        },
        placeholderData: [],
    });

    const [categorizedEvents, setCategorizedEvents] = useState<EventCategory[]>([]);
    const DebugDisplay: JSX.Element = (
        <QueryDebugDisplay
            data={[
                { name: "campaign", ...campaign },
                { name: "campaignEvents", ...campaignEvents },
                { name: "influencers", ...influencers },
                { name: "assignedInfluencer", ...assignedInfluencer },
                { name: "assignmentEvents", ...assignmentEvents },
            ]}
        />
    );
    useEffect(() => {
        console.log("recategorizing events");
        const newCategorizedEvents = categorizeEvents(assignmentEvents?.data ?? []);
        setCategorizedEvents(newCategorizedEvents);
        console.log({ newCategorizedEvents });
    }, [assignmentEvents.data, campaign.data]);
    const EventHandlers = {
        setCampaign: (updatedCampaign: Campaign.Campaign) => {
            if (!assignedInfluencer.data) return;
            queryClient.setQueryData(["campaign", campaignId], updatedCampaign);
            campaign.refetch();
            const newAssignmentEvents = campaign.data?.assignedInfluencers.find(
                (x) => x.id === assignedInfluencer.data.id
            )?.timelineEvents;
            queryClient.setQueryData(["assignmentEvents", assignedInfluencer.data.id], newAssignmentEvents);
            assignmentEvents.refetch();
        },
    };
    if (campaign.isError || influencers.isError || assignmentEvents.isError || assignedInfluencer.isError) {
        const errorMessage: string =
            campaign.error?.message ??
            influencers.error?.message ??
            assignmentEvents.error?.message ??
            assignedInfluencer.error?.message ??
            "Unknown error";
        return (
            <>
                {DebugDisplay}
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Typography>There was an error: {errorMessage}</Typography>
                    <IconButton
                        onClick={() => {
                            [campaign, influencers, assignmentEvents, assignedInfluencer].forEach((query) => {
                                if (query.isError) query.refetch();
                            });
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </div>
            </>
        );
    }
    if (campaign.isLoading || influencers.isLoading || assignmentEvents.isLoading || assignedInfluencer.isLoading) {
        return (
            <>
                {DebugDisplay}
                <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"100px"}
                    sx={{ borderRadius: "20px" }}
                ></Skeleton>
            </>
        );
    }

    if (!campaign.data || !influencers.data || !assignmentEvents.data || !assignedInfluencer.data) {
        return (
            <>
                {DebugDisplay}
                <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"100px"}
                    sx={{ borderRadius: "20px" }}
                ></Skeleton>
            </>
        );
    }
    return (
        <>
            {DebugDisplay}
            <Accordion key={assignedInfluencer.data.id} defaultExpanded disableGutters variant="outlined">
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                            display: "none",
                        },
                    }}
                >
                    <div className={stylesExporter.campaignDetails.assignmentAccordionHeader}>
                        <InfluencerName assignedInfluencer={assignedInfluencer.data} />
                        {assignmentEvents.isFetching ? (
                            <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: "20px" }}>
                                <CircularProgress />
                            </Skeleton>
                        ) : (
                            <InfluencerDetailsButtons
                                influencers={influencers.data ?? []}
                                assignment={assignedInfluencer.data}
                                campaign={campaign.data}
                                setCampaign={EventHandlers.setCampaign}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                                events={assignmentEvents.data ?? []}
                            />
                        )}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <>
                        {assignmentEvents.isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                width={"100%"}
                                height={"100px"}
                                sx={{ borderRadius: "20px" }}
                            ></Skeleton>
                        ) : (
                            <>
                                {!!assignedInfluencer.data.budget && (
                                    <Typography>{`Honorar: ${assignedInfluencer.data.budget}€`}</Typography>
                                )}
                                {categorizedEvents.map((category, index) => {
                                    return <EventCategoryDisplay key={index} category={category} />;
                                })}
                            </>
                        )}
                    </>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
