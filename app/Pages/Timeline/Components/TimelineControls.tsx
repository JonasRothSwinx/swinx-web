import Campaign from "@/app/ServerFunctions/types/campaign";
import { Dispatch, SetStateAction, useState } from "react";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import { AddIcon } from "@/app/Definitions/Icons";
import TimelineEventMultiDialog from "../../Dialogs/TimelineEvent/MultiEvent/TimelineEventMultiDialog";
import { useQueryClient } from "@tanstack/react-query";

interface TimelineControlsProps {
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    groupBy: groupBy;
    setGroupBy: (value: groupBy) => void;
    influencers: Influencer.Full[];
    onDataChange: () => void;
}
type openDialog = "None" | "Timeline";

export default function TimelineControls(props: TimelineControlsProps) {
    const queryClient = useQueryClient();
    const { groupBy, setGroupBy, campaign, influencers, setCampaign: setRows, onDataChange } = props;
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
        if (hasChanged) {
            console.log("dialog closed with changes");
            queryClient.invalidateQueries({
                queryKey: ["campaign", campaign.id],
                refetchType: "all",
            });
            queryClient.invalidateQueries({
                queryKey: ["events", campaign.id],
                refetchType: "all",
            });
            queryClient.invalidateQueries({
                queryKey: ["groups", campaign.id],
                refetchType: "all",
            });
            queryClient.refetchQueries();
            onDataChange();
        }
        setOpenDialog("None");
    }
    const Dialogs: { [key in openDialog]: JSX.Element | null } = {
        None: null,
        Timeline: <TimelineEventMultiDialog onClose={onDialogClose} campaign={campaign} editing={false} />,
    };
    return (
        <>
            {/* Dialogs */}
            <>{Dialogs[openDialog]}</>
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
                {/*                 <TextField
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
                </TextField> */}
                <Button
                    style={{ height: "100%" }}
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.addTimeline()}
                >
                    <AddIcon />
                    <Typography variant="body1">Ereignis</Typography>
                </Button>
            </div>
        </>
    );
}
