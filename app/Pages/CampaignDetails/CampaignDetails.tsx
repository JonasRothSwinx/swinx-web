import { Campaign, Customer, Influencer, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { Dialog, Unstable_Grid2 as Grid, Skeleton, Typography } from "@mui/material";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";
import { EditIcon, ExpandMoreIcon, MailIcon } from "@/app/Definitions/Icons";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import { deleteCampaign, getCampaign, listInfluencers } from "@/app/ServerFunctions/serverActions";
import stylesExporter from "../styles/stylesExporter";
import CustomerDialog from "../Dialogs/CustomerDialog";
import CampaignDetailsButtons from "./Components/TopButtons";
import AssignedInfluencerDetails from "./Components/AssignedInfluencerDetails";
import CustomerDetails from "./Components/CustomerDetails";
import OpenInfluencerDetails from "./Components/OpenInfluencerDetails";

const styles = stylesExporter.campaignDetails;

interface CampaignDetailsProps {
    isOpen: boolean;
    campaignId: string;
    onClose: (hasChanged?: boolean) => void;
}

export default function CampaignDetails(props: CampaignDetailsProps) {
    const { isOpen, onClose, campaignId } = props;
    const [campaign, setCampaign] = useState<Campaign.Campaign>();
    const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>([]);
    const [highlightedEvent, setHighlightedEvent] = useState<TimelineEvent.TimelineEvent>();
    const [loading, setLoading] = useState(false);

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

    function updateCampaign() {
        if (campaignId === "") return;
        console.log("updating campaign");
        setLoading(true);
        getCampaign(campaignId).then((result) => {
            console.log("newCampaign", result);
            setCampaign(result);
            setLoading(false);
        });
    }
    function updateInfluencers() {
        console.log("updating Influencers");
        listInfluencers().then((result) => setInfluencers(result));
    }
    // console.log(callbackSetCampaign);
    function callbackSetCampaign(campaign: Campaign.Campaign) {
        console.log("callback set triggered");
        setCampaign(campaign);
    }

    return (
        <>
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
                        />
                        {isOpen && campaign && (
                            <Grid container columns={3}>
                                <Grid xs={1} display={"flex"} flexDirection={"column"}>
                                    <CustomerDetails
                                        campaign={campaign}
                                        customer={campaign?.customer}
                                        setCampaign={callbackSetCampaign}
                                    />
                                    <OpenInfluencerDetails
                                        influencers={campaign.influencerPlaceholders}
                                        setHighlightedEvent={setHighlightedEvent}
                                    />
                                    <AssignedInfluencerDetails
                                        events={campaign?.campaignTimelineEvents ?? []}
                                        influencers={influencers}
                                        setHighlightedEvent={setHighlightedEvent}
                                    />
                                </Grid>
                                <Grid xs={1}>
                                    <Typography fontSize={8} whiteSpace={"pre-wrap"}>
                                        {JSON.stringify(campaign)?.replaceAll(",", "\n")}
                                    </Typography>
                                </Grid>
                                <Grid id="timeline" xs={1}>
                                    <TimelineView
                                        setCampaign={callbackSetCampaign}
                                        influencers={influencers}
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
        </>
    );
}
