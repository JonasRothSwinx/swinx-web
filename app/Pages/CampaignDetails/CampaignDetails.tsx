import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Dialog, Unstable_Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";
import { EditIcon, ExpandMoreIcon, MailIcon } from "@/app/Definitions/Icons";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import stylesExporter from "../styles/stylesExporter";
import CustomerDialog from "../Dialogs/CustomerDialog";
import CampaignDetailsButtons from "./Components/TopButtons";
import AssignedInfluencerDetails from "./Components/AssignedInfluencerDetails";
import CustomerDetails from "./Components/CustomerDetails";
import OpenInfluencerDetails from "./Components/OpenInfluencerDetails/OpenInfluencerDetails";
import { influencers, campaigns } from "@/app/ServerFunctions/dbInterface";
import Assignment from "@/app/ServerFunctions/types/assignment";

const styles = stylesExporter.campaignDetails;

interface CampaignDetailsProps {
    isOpen: boolean;
    campaignId: string;
    onClose: (hasChanged?: boolean) => void;
}

export default function CampaignDetails(props: CampaignDetailsProps) {
    const { isOpen, onClose, campaignId } = props;
    const [campaign, setCampaign] = useState<Campaign.Campaign>();
    const [influencerData, setInfluencerData] = useState<Influencer.InfluencerFull[]>([]);
    const [assignmentData, setAssignmentData] = useState<Assignment.Assignment[]>([]);
    const [highlightedEvent, setHighlightedEvent] = useState<TimelineEvent.TimelineEvent>();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function onDialogClose() {
        updateCampaign();
    }
    function handleClose(hasChanged?: boolean) {
        if (onClose) {
            onClose(true || hasChanged);
        }
    }
    // useEffect(() => {
    //     console.log("applying props", props);
    //     setInfluencers(props.influencers);

    //     return () => {};
    // }, [props]);

    useEffect(() => {
        console.log("campaign changed");

        return () => {};
    }, [campaign]);

    useEffect(() => {
        updateCampaign();
        updateInfluencers();

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId]);

    function updateCampaign(background?: boolean) {
        if (campaignId === "") return;
        setIsLoading(true);
        console.log("updating campaign");
        if (!background) {
            setLoading(true);
        }
        campaigns.get(campaignId).then((result) => {
            console.log("newCampaign", result);
            setCampaign(result);
            setLoading(false);
            setIsLoading(false);
        });
    }
    function updateInfluencers() {
        console.log("updating Influencers");
        influencers.list().then((result) => setInfluencerData(result));
    }
    // console.log(callbackSetCampaign);
    function callbackSetCampaign(campaign: Campaign.Campaign) {
        console.log("callback set triggered");
        setCampaign(campaign);
        console.log(campaign);
        // updateCampaign();
    }
    // console.log(campaign);

    return (
        <>
            {isOpen && (
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
                    {loading ? (
                        <Skeleton></Skeleton>
                    ) : (
                        <>
                            <CampaignDetailsButtons
                                updateCampaign={updateCampaign}
                                handleClose={handleClose}
                                campaign={campaign}
                                isLoading={isLoading}
                            />
                            {isOpen && campaign && (
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
                                            campaign={campaign}
                                            customer={campaign?.customer}
                                            setCampaign={callbackSetCampaign}
                                        />
                                        <OpenInfluencerDetails
                                            influencers={influencerData}
                                            campaign={campaign}
                                            setCampaign={callbackSetCampaign}
                                            events={campaign?.campaignTimelineEvents ?? []}
                                            placeholders={campaign.assignedInfluencers}
                                            setHighlightedEvent={setHighlightedEvent}
                                        />
                                        <AssignedInfluencerDetails
                                            events={campaign?.campaignTimelineEvents ?? []}
                                            influencers={influencerData}
                                            setHighlightedEvent={setHighlightedEvent}
                                        />
                                    </Grid>
                                    <Grid xs={1} maxHeight={"100%"}>
                                        <Typography fontSize={8} whiteSpace={"pre-wrap"}>
                                            {/* JSON.stringify(campaign, null, "\t") */
                                            /* ?.replaceAll(",", "\n") */}
                                        </Typography>
                                    </Grid>
                                    <Grid id="timeline" xs={1} columns={1}>
                                        <TimelineView
                                            setCampaign={callbackSetCampaign}
                                            influencers={influencerData}
                                            campaign={campaign}
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
            )}
        </>
    );
}
