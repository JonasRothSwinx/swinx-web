import { Box, SxProps, Typography } from "@mui/material";
import { SwinxLogo } from "./SwinxLogo";
import { Campaign, ParentEvent, TimelineEvent } from "../Functions/Database/types";

interface TitleProps {
    parentEvent: ParentEvent;
    campaign: Campaign;
}
export default function Title({ parentEvent, campaign }: TitleProps) {
    const sx: SxProps = {
        "&": {
            // position: "sticky",
            padding: "20px",
            paddingBottom: "0",
            width: "100%",
            textAlign: "center",
            backgroundColor: "var(--swinx-blue)",
            borderRadius: "10px 10px 0 0",
            color: "white",
            "#SwinxLogo": {
                float: "right",
                width: "100px",
                height: "2em",
                marginInlineStart: "10px",
            },
        },
    };

    return (
        <Box id="Title" sx={sx}>
            <SwinxLogo white />
            <Typography variant="h4">{`"${parentEvent.eventTitle}" von ${campaign.customerCompany}`}</Typography>
        </Box>
    );
}
