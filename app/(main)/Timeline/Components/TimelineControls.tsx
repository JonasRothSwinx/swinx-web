import React, { Dispatch, SetStateAction, useState } from "react";
import { Campaign, Influencer, Influencers } from "@/app/ServerFunctions/types/";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import { AddIcon } from "@/app/Definitions/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { TimelineEventDialog } from "@/app/Components";

interface TimelineControlsProps {
    campaignId: string;
    groupBy: groupBy;
    setGroupBy: (value: groupBy) => void;
    onDataChange: () => void;
}
type openDialog = "None" | "Timeline";

export default function TimelineControls({
    groupBy,
    setGroupBy,
    campaignId,
    // campaign,
    // influencers,
    // setCampaign: setRows,
    onDataChange,
}: TimelineControlsProps) {
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState<openDialog>("None");

    const ClickHandlers = {
        addTimeline: () => () => {
            setOpenDialog("Timeline");
        },
    };
    function onDialogClose(hasChanged?: boolean) {
        if (hasChanged) {
            console.log("dialog closed with changes");
            // queryClient.invalidateQueries({
            //     queryKey: ["campaign", campaign.id],
            //     refetchType: "all",
            // });
            // queryClient.invalidateQueries({
            //     queryKey: ["events", campaign.id],
            //     refetchType: "all",
            // });
            // queryClient.invalidateQueries({
            //     queryKey: ["groups", campaign.id],
            //     refetchType: "all",
            // });
            // queryClient.refetchQueries();
            onDataChange();
        }
        setOpenDialog("None");
    }
    const Dialogs: { [key in openDialog]: React.JSX.Element | null } = {
        None: null,
        Timeline: (
            <TimelineEventDialog
                onClose={onDialogClose}
                campaignId={campaignId}
                editing={false}
            />
        ),
    };
    return (
        <Box id="TimelineControls">
            {/* Dialogs */}
            <>{Dialogs[openDialog]}</>
            <Box
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
                    <Typography variant="body1">Webinar</Typography>
                </Button>
            </Box>
        </Box>
    );
}
