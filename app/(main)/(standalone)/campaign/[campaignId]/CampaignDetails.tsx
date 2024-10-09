import TimelineView from "@/app/(main)/Timeline/TimeLineView";
import { CustomErrorBoundary } from "@/app/Components";
import { LoadingPage } from "@/app/Components/Loading";
import { highlightData } from "@/app/Definitions/types";
import { dataClient } from "@dataClient";
import { Assignment, Campaign } from "@/app/ServerFunctions/types";
import { Placeholder } from "@aws-amplify/ui-react";
import { Box, Grid2 as Grid, SxProps } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CustomerDetails from "./Components/CustomerDetails";
import OpenInfluencerDetails from "./Components/OpenInfluencerDetails/OpenInfluencerDetails";
import CampaignDetailsButtons from "./Components/TopButtons";
import { MediaPreview } from "./MediaPreview";
import { queryKeys } from "@/app/(main)/queryClient/keys";

interface CampaignDetailsProps {
    campaignId: string;
}

export default function CampaignDetails({ campaignId }: CampaignDetailsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: () => dataClient.campaign.getRef(campaignId),
        refetchOnWindowFocus: false,
    });
    // const influencers = useQuery({
    //     queryKey: queryKeys.influencer.all,
    //     queryFn: () => dataClient.influencer.list(),
    //     placeholderData: [],
    //     refetchOnWindowFocus: false,
    // });
    // const [assignmentData, setAssignmentData] = useState<Assignment[]>([]);
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
    }, [campaign.data]);

    // console.log(callbackSetCampaign);
    // function callbackSetCampaign(campaign: Campaign.Campaign) {
    //     console.log("callback set triggered");
    //     queryClient.setQueryData(["campaign", campaignId], campaign);
    // }
    // console.log(campaign);
    // const EventHandlers = {
    //     dialogClose: () => {
    //         queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    //         // queryClient.invalidateQueries("campaigns");
    //     },
    //     handleClose: () => {
    //         router.push("/");
    //         // window.history.pushState({}, "", "/");
    //         // redirect("/");
    //     },
    //     updateCampaign: () => {
    //         queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
    //         campaign.refetch();
    //     },
    //     setCampaign: (updatedCampaign: Campaign) => {
    //         console.log("setCampaign", updatedCampaign);
    //         queryClient.setQueryData(["campaign", campaignId], updatedCampaign);
    //         campaign.refetch();
    //     },
    // };
    const styles: SxProps = useMemo(() => {
        return {
            "&.campaignDetailsPage": {
                height: "100dvh",
                width: "100dvw",
                padding: "10px",
                display: "flex",

                // padding: "10px",
                ".campaignDetailsContent": {
                    // padding: "10px",
                    borderRadius: "20px",
                    backgroundColor: "white",
                    border: "1px solid black",
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    "#CampaignDetailsButtons": {
                        position: "relative",
                        width: "100%",
                        display: "flex",

                        justifyContent: "right",
                        alignItems: "center",
                        padding: "5px 10px ",
                        backgroundColor: "var(--swinx-blue)",
                        borderBottom: "1px solid black",
                        "#DeleteButton": {
                            color: "error.main",
                            borderColor: "error.main",
                            backgroundColor: "white",
                            position: "absolute",
                            left: "10px",
                            borderRadius: "20px",
                        },
                    },
                    "#CampaignDetailsGrid": {
                        padding: "5px 10px 10px",
                        height: "100%",
                        maxHeight: "100%",
                        overflow: "auto",
                        "& .MuiGrid2-root": {
                            overflowY: "auto",
                            overflowX: "hidden",
                        },
                        "#CampaignDetailsDisplay": {
                            "& .MuiAccordion-root": {
                                overflow: "hidden",
                                borderRadius: "0px",

                                border: "1px solid black",
                                "&:first-of-type": {
                                    borderTopLeftRadius: "20px",
                                    borderTopRightRadius: "20px",
                                    borderBottom: "none",
                                },
                                "&:last-of-type": {
                                    borderBottomLeftRadius: "20px",
                                    borderBottomRightRadius: "20px",
                                    borderBottom: "1px solid black",
                                },
                            },
                            ".MuiAccordionSummary-root": {
                                backgroundColor: "var(--swinx-blue)",
                                color: "white",
                            },

                            ".MuiAccordionSummary-content:not(.Mui-expanded) button": {
                                display: "none",
                            },
                            ".MuiAccordionSummary-expandIconWrapper": {
                                color: "white",
                            },
                            ".MuiIconButton-root": {
                                color: "white",
                            },
                        },
                    },
                },
            },
        };
    }, []);
    if (campaign.isLoading)
        return (
            <LoadingPage
                textMessage="Kampagne wird geladen"
                spinnerSize={100}
            />
        );
    if (!campaign.data) return <Placeholder />;
    return (
        <Box
            id="CampaignDetails"
            className={"campaignDetailsPage"}
            sx={styles}
            // sx={{
            //     padding: "5px",
            //     "& .MuiDialog-container > .MuiPaper-root": {
            //         borderRadius: "20px",
            //         padding: "10px",
            //     },
            // }}
            // open={isOpen}
        >
            <Box
                id="campaignDetailsContent"
                className={"campaignDetailsContent"}
            >
                <CustomErrorBoundary message="Error loading.... Buttons?">
                    <CampaignDetailsButtons campaignId={campaignId} />
                </CustomErrorBoundary>

                <Grid
                    id="CampaignDetailsGrid"
                    container
                    columns={3}
                    sx={{}}
                    maxHeight={"100%"}
                >
                    <Grid
                        id="CampaignDetailsDisplay"
                        size={1}
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <CustomErrorBoundary message="Error loading customer details">
                            <CustomerDetails campaignId={campaignId} />
                        </CustomErrorBoundary>
                        <CustomErrorBoundary message="Error loading influencer details">
                            <OpenInfluencerDetails
                                // influencers={influencers.data ?? []}
                                campaignId={campaignId}
                                // setCampaign={EventHandlers.setCampaign}
                                // events={campaign.data.campaignTimelineEvents ?? []}
                                // placeholders={campaign.data.assignedInfluencers}
                            />
                        </CustomErrorBoundary>
                    </Grid>
                    <Grid
                        id="MediaPreview"
                        size={1}
                        maxHeight={"100%"}
                    >
                        <MediaPreview campaignId={campaignId} />

                        {/* <QueryDebugDisplay
                            data={[
                                { ...campaign, name: "campaign" },
                                { ...influencers, name: "influencers" },
                                { ...highlightQuery, name: "highlightedEvents" },
                            ]}
                        />
                        <Typography>
                            Highlighted Events:
                            <br />
                        </Typography>
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
                        )} */}
                    </Grid>
                    <Grid
                        id="timeline"
                        size={1}
                        columns={1}
                    >
                        <CustomErrorBoundary message="Error loading timeline">
                            <TimelineView
                                campaignId={campaignId}
                                orientation="vertical"
                                controlsPosition="before"
                                editable
                            />
                        </CustomErrorBoundary>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
