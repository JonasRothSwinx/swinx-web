import Campaign from "@/app/ServerFunctions/types/campaign";
import { Dispatch, SetStateAction, useState } from "react";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import { MenuItem, TextField } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";

interface TimelineControlsProps {
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    groupBy: groupBy;
    setGroupBy: (value: groupBy) => void;
    influencers: Influencer.InfluencerFull[];
}
type openDialog = "None" | "Timeline";
export default function TimelineControls(props: TimelineControlsProps) {
    const { groupBy, setGroupBy, campaign, influencers, setCampaign: setRows } = props;
    const [openDialog, setOpenDialog] = useState<openDialog>("None");
    const DialogOptions: DialogOptions = {
        campaignId: campaign.id,
    };
    const DialogConfig: DialogConfig<Campaign.Campaign> = {
        onClose: onDialogClose,
        parent: campaign,
        setParent: setRows,
    };

    const ClickHandlers = {
        addTimeline: () => () => {
            setOpenDialog("Timeline");
        },
    };
    function onDialogClose(hasChanged?: boolean) {
        setOpenDialog("None");
    }
    return (
        <>
            {/* Dialogs */}
            <>
                {/* <TimelineEventDialog
                    {...DialogOptions}
                    {...DialogConfig}
                    influencers={influencers}
                    isOpen={openDialog === "Timeline"}
                /> */}
            </>
            <div
                style={{
                    // position: "fixed",
                    // top: "40px",
                    // right: "20px",
                    marginBlock: "10px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                    height: "60px",
                    alignContent: "stretch",
                    padding: "5px",
                    background: "white",
                    zIndex: 999,
                }}
            >
                <TextField
                    select
                    label={"Gruppieren nach"}
                    SelectProps={{
                        sx: { minWidth: "15ch" },
                        onChange: (e) => {
                            setGroupBy(e.target.value as groupBy);
                        },
                        value: groupBy,
                    }}
                >
                    <MenuItem value={"day"}>Tag</MenuItem>
                    <MenuItem value={"week"}>Woche</MenuItem>
                </TextField>
                {/* <Button
                    style={{ height: "100%" }}
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.addTimeline()}
                >
                    <AddIcon />
                    <Typography variant="body1">Ereignis</Typography>
                </Button> */}
            </div>
        </>
    );
}
