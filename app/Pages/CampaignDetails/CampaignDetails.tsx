import CustomErrorBoundary from "@/app/Components/CustomErrorBoundary";
import QueryDebugDisplay from "@/app/Components/QueryDebugDisplay";
import { highlightData } from "@/app/Definitions/types";
import dataClient from "@/app/ServerFunctions/database";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import { Placeholder } from "@aws-amplify/ui-react";
import { Dialog, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TimelineView from "../Timeline/TimeLineView";
import stylesExporter from "../styles/stylesExporter";
import CustomerDetails from "./Components/CustomerDetails";
import OpenInfluencerDetails from "./Components/OpenInfluencerDetails/OpenInfluencerDetails";
import CampaignDetailsButtons from "./Components/TopButtons";

const styles = stylesExporter.campaignDetails;

interface CampaignDetailsProps {
    isOpen: boolean;
    campaignId: string;
    onClose: (hasChanged?: boolean) => void;
}

export default function CampaignDetails(props: CampaignDetailsProps) {
    const { isOpen, onClose, campaignId } = props;
    const queryClient = useQueryClient();
    const campaign = useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => dataClient.campaign.get(campaignId),
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
        placeholderData: [],
    });
    const [assignmentData, setAssignmentData] = useState<Assignment.Assignment[]>([]);
    const highlightQuery = useQuery<highlightData[]>({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });

    useEffect(() => {
        // console.log("campaign changed");

        return () => {};
    }, [campaign]);

    // console.log(callbackSetCampaign);
    // function callbackSetCampaign(campaign: Campaign.Campaign) {
    //     console.log("callback set triggered");
    //     queryClient.setQueryData(["campaign", campaignId], campaign);
    // }
    // console.log(campaign);
    const EventHandlers = {
        dialogClose: () => {
            queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
            // queryClient.invalidateQueries("campaigns");
        },
        handleClose: () => {
            if (onClose) {
                onClose();
            }
        },
        updateCampaign: () => {
            queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
            campaign.refetch();
        },
        setCampaign: (updatedCampaign: Campaign.Campaign) => {
            console.log("setCampaign", updatedCampaign);
            queryClient.setQueryData(["campaign", campaignId], updatedCampaign);
            campaign.refetch();
        },
    };
    if (campaign.isLoading) return <Placeholder />;
    if (!campaign.data) return <Placeholder />;
    return (
        <Dialog
            sx={{
                padding: "5px",
                "& .MuiDialog-container > .MuiPaper-root": {
                    borderRadius: "20px",
                    padding: "10px",
                },
            }}
            open={isOpen}
            fullScreen
        >
            <>
                <CustomErrorBoundary message="Error loading.... Buttons?">
                    <CampaignDetailsButtons
                        updateCampaign={EventHandlers.updateCampaign}
                        handleClose={EventHandlers.handleClose}
                        campaign={campaign.data}
                        isLoading={campaign.isFetching}
                    />
                </CustomErrorBoundary>

                <Grid
                    container
                    columns={3}
                    sx={{
                        height: "100%",
                        maxHeight: "100%",
                        "& .MuiGrid2-root": {
                            overflowY: "auto",
                            overflowX: "hidden",
                        },
                    }}
                    maxHeight={"100%"}
                >
                    <Grid xs={1} display={"flex"} flexDirection={"column"}>
                        <CustomErrorBoundary message="Error loading customer details">
                            <CustomerDetails
                                campaign={campaign.data}
                                customers={campaign?.data.customers}
                                setCampaign={EventHandlers.setCampaign}
                            />
                        </CustomErrorBoundary>
                        <CustomErrorBoundary message="Error loading influencer details">
                            <OpenInfluencerDetails
                                influencers={influencers.data ?? []}
                                campaignId={campaignId}
                                setCampaign={EventHandlers.setCampaign}
                                events={campaign.data.campaignTimelineEvents ?? []}
                                placeholders={campaign.data.assignedInfluencers}
                            />
                        </CustomErrorBoundary>
                    </Grid>
                    <Grid xs={1} maxHeight={"100%"}>
                        <QueryDebugDisplay
                            data={[
                                { ...campaign, name: "campaign" },
                                { ...influencers, name: "influencers" },
                                { ...highlightQuery, name: "highlightedEvents" },
                            ]}
                        />
                        <Typography>
                            Highlighted Events:
                            <br />
                            {highlightQuery.data?.length ? (
                                highlightQuery.data.map((x) => {
                                    return (
                                        <Typography key={x.id} color={x.color}>
                                            {x.id}
                                        </Typography>
                                    );
                                })
                            ) : (
                                <Typography> None</Typography>
                            )}
                        </Typography>
                    </Grid>
                    <Grid id="timeline" xs={1} columns={1}>
                        <CustomErrorBoundary message="Error loading timeline">
                            <TimelineView
                                setCampaign={EventHandlers.setCampaign}
                                influencers={influencers.data ?? []}
                                campaign={campaign.data}
                                orientation="vertical"
                                controlsPosition="before"
                                editable
                            />
                        </CustomErrorBoundary>
                    </Grid>
                </Grid>
            </>
        </Dialog>
    );
}
