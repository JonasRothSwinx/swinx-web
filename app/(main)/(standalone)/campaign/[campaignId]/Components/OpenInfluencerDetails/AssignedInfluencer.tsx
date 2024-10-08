import { ExpandMoreIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { Assignment, Campaign, Events } from "@/app/ServerFunctions/types";
import {
    Grid2 as Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Skeleton,
    Typography,
    CircularProgress,
    IconButton,
    Box,
} from "@mui/material";
import { dayjs } from "@/app/utils";
import React, { useEffect, useState } from "react";
import categorizeEvents, { EventCategory } from "./functions/categorizeEvents";
import EventCategoryDisplay from "./EventCategoryDisplay";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtons } from "./components/InfluencerDetailsButtons";
import { InfluencerName } from "./components/InfluencerName";
import { QueryDebugDisplay } from "@/app/Components";
import { dataClient } from "@dataClient";

interface AssignedInfluencerProps {
    campaignId: string;
    assignedInfluencer: Assignment;
    // campaign: Campaign.Campaign;
    // setCampaign: (campaign: Campaign.Campaign) => void;
    // influencers: Influencer.InfluencerFull[];
    isProcessing: boolean;
    setIsProcessing: (state: boolean) => void;
}
export default function AssignedInfluencer(props: AssignedInfluencerProps): React.JSX.Element {
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
        queryFn: () => dataClient.campaign.get(campaignId),
    });
    const campaignEvents = useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ["campaignEvents", campaignId],
        queryFn: async () => {
            return campaign.data?.campaignTimelineEvents ?? [];
        },
        placeholderData: [],
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
        placeholderData: [],
    });
    const assignedInfluencer = useQuery({
        queryKey: ["assignment", props.assignedInfluencer.id],
        queryFn: async () => {
            if (props.assignedInfluencer.id.startsWith("placeholder")) return null;
            const assignment = await dataClient.assignment.get(props.assignedInfluencer.id);
            return assignment;
        },
        // placeholderData: props.assignedInfluencer,
        refetchOnWindowFocus: false,
    });
    const assignmentEvents = useQuery({
        queryKey: ["assignmentEvents", props.assignedInfluencer.id],
        queryFn: async () => {
            const raw = (
                await dataClient.event.list.by.assignment(props.assignedInfluencer.id)
            ).filter((event): event is Events.SingleEvent => Events.isSingleEvent(event));
            return raw.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        },
        placeholderData: [],
    });

    const [categorizedEvents, setCategorizedEvents] = useState<EventCategory[]>([]);

    useEffect(() => {
        // console.log("recategorizing events");
        const newCategorizedEvents = categorizeEvents(assignmentEvents?.data ?? []);
        setCategorizedEvents(newCategorizedEvents);
        // console.log({ newCategorizedEvents });
    }, [assignmentEvents.data, campaign.data]);
    const EventHandlers = {
        setCampaign: (updatedCampaign: Campaign) => {
            if (!assignedInfluencer.data || assignedInfluencer.data === null) return;
            queryClient.setQueryData(["campaign", campaignId], updatedCampaign);
            campaign.refetch();
            const newAssignmentEvents = campaign.data?.assignedInfluencers.find(
                (influencer) => influencer.id === assignedInfluencer.data?.id,
            )?.timelineEvents;
            queryClient.setQueryData(
                ["assignmentEvents", assignedInfluencer.data.id],
                newAssignmentEvents,
            );
            assignmentEvents.refetch();
        },
    };
    if (
        campaign.isError ||
        influencers.isError ||
        assignmentEvents.isError ||
        assignedInfluencer.isError
    ) {
        const errorMessage: string =
            campaign.error?.message ??
            influencers.error?.message ??
            assignmentEvents.error?.message ??
            assignedInfluencer.error?.message ??
            "Unknown error";
        return (
            <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography>There was an error: {errorMessage}</Typography>
                <IconButton
                    onClick={() => {
                        [campaign, influencers, assignmentEvents, assignedInfluencer].forEach(
                            (query) => {
                                if (query.isError) query.refetch();
                            },
                        );
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>
        );
    }
    if (
        campaign.isLoading ||
        influencers.isLoading ||
        assignmentEvents.isLoading ||
        assignedInfluencer.isLoading
    ) {
        return (
            <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"100px"}
                sx={{ borderRadius: "20px" }}
            ></Skeleton>
        );
    }

    if (!campaign.data || !influencers.data || !assignmentEvents.data || !assignedInfluencer.data) {
        return (
            <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"100px"}
                sx={{ borderRadius: "20px" }}
            ></Skeleton>
        );
    }
    const sx = {
        "&": {
            ".assignmentAccordionHeader": {
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px",
                maxHeight: "1em",
                margin: "5px",
            },
        },
    };
    return (
        <Accordion
            key={assignedInfluencer.data.id}
            defaultExpanded
            disableGutters
            variant="outlined"
            sx={sx}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                        display: "none",
                    },
                }}
            >
                <div className={"assignmentAccordionHeader"}>
                    <InfluencerName assignedInfluencer={assignedInfluencer.data} />
                    {assignmentEvents.isFetching ? (
                        <Skeleton
                            variant="rectangular"
                            width={200}
                            height={40}
                            sx={{ borderRadius: "20px" }}
                        >
                            <CircularProgress />
                        </Skeleton>
                    ) : (
                        <InfluencerDetailsButtons
                            influencers={influencers.data ?? []}
                            assignment={assignedInfluencer.data}
                            campaignId={campaignId}
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
                    ) : assignmentEvents.data.length === 0 ? (
                        <Typography>Keine Events zugewiesen</Typography>
                    ) : (
                        <>
                            {!!assignedInfluencer.data.budget && (
                                <Typography>{`Honorar: ${assignedInfluencer.data.budget}€`}</Typography>
                            )}
                            {categorizedEvents.map((category, index) => {
                                return (
                                    <EventCategoryDisplay
                                        key={index}
                                        category={category}
                                    />
                                );
                            })}
                        </>
                    )}
                </>
            </AccordionDetails>
        </Accordion>
    );
}
