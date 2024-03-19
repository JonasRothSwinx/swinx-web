import dbInterface from "@/app/ServerFunctions/dbInterface";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Dialog, Unstable_Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TimelineView from "../Timeline/TimeLineView";
import stylesExporter from "../styles/stylesExporter";
import CustomerDetails from "./Components/CustomerDetails";
import OpenInfluencerDetails from "./Components/OpenInfluencerDetails/OpenInfluencerDetails";
import CampaignDetailsButtons from "./Components/TopButtons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { data } from "@/amplify/data/resource";
import { Placeholder } from "@aws-amplify/ui-react";

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
        queryFn: () => dbInterface.campaign.get(campaignId),
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dbInterface.influencer.list(),
        placeholderData: [],
    });

    const staticEvents = useQuery({
        queryKey: ["staticEvents"],
        queryFn: async () => {
            const response = await dbInterface.staticEvent.list();
            console.log("staticEvents", response);
            return response ?? [];
        },
        placeholderData: [],
    });
    const [assignmentData, setAssignmentData] = useState<Assignment.Assignment[]>([]);
    const [highlightedEvent, setHighlightedEvent] = useState<TimelineEvent.TimelineEvent>();

    useEffect(() => {
        console.log("campaign changed");

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
    return (
        <Dialog
            sx={{
                padding: "10px",
                "& .MuiDialog-container > .MuiPaper-root": {
                    borderRadius: "20px",
                    padding: "0px 10px",
                },
            }}
            open={isOpen}
            fullScreen
        >
            {campaign.isLoading && !campaign.data ? (
                <Skeleton variant="rectangular" width={"90vw"} height={"90vh"} sx={{ borderRadius: "20px" }}></Skeleton>
            ) : (
                <>
                    <CampaignDetailsButtons
                        updateCampaign={EventHandlers.updateCampaign}
                        handleClose={EventHandlers.handleClose}
                        campaign={campaign.data}
                        isLoading={campaign.isFetching}
                    />
                    {campaign.data && (
                        <Grid
                            container
                            columns={3}
                            sx={{
                                maxHeight: "100%",
                                "& .MuiGrid2-root": {
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                },
                            }}
                            maxHeight={"100%"}
                        >
                            <Grid xs={1} display={"flex"} flexDirection={"column"}>
                                <CustomerDetails
                                    campaign={campaign.data}
                                    customer={campaign?.data.customer}
                                    setCampaign={EventHandlers.setCampaign}
                                />
                                <OpenInfluencerDetails
                                    influencers={influencers.data ?? []}
                                    campaignId={campaignId}
                                    setCampaign={EventHandlers.setCampaign}
                                    events={campaign.data.campaignTimelineEvents ?? []}
                                    placeholders={campaign.data.assignedInfluencers}
                                    setHighlightedEvent={setHighlightedEvent}
                                />
                                {/* <AssignedInfluencerDetails
                                            events={campaign?.campaignTimelineEvents ?? []}
                                            influencers={influencerData}
                                            setHighlightedEvent={setHighlightedEvent}
                                        /> */}
                            </Grid>
                            <Grid xs={1} maxHeight={"100%"}>
                                <Typography fontSize={8} whiteSpace={"pre-wrap"}>
                                    {JSON.stringify({ ...campaign, data: undefined }, null, "\t")}
                                </Typography>
                            </Grid>
                            <Grid id="timeline" xs={1} columns={1}>
                                <TimelineView
                                    setCampaign={EventHandlers.setCampaign}
                                    influencers={influencers.data ?? []}
                                    campaign={campaign.data}
                                    orientation="vertical"
                                    controlsPosition="before"
                                    editable
                                    highlightedEvent={highlightedEvent}
                                />
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </Dialog>
    );
}
