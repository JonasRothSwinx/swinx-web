import { Box, SxProps, Typography } from "@mui/material";
import { SwinxLogo } from "@/app/Components";
import { Campaign, ParentEvent, TimelineEvent } from "../Functions/Database/types";

interface TitleProps {
    parentEvent: ParentEvent;
    campaign: Campaign;
}
export default function Title({ parentEvent, campaign }: TitleProps) {
    const sx: SxProps = {
        "&": {
            // position: "sticky",
            padding: "20px 0 20px",
            // paddingBottom: "0",
            width: "100%",
            textAlign: "center",
            backgroundColor: "transparent",
            borderRadius: "10px 10px 0 0",
            // color: "white",
            // color: "var(--swinx-blue)",
            color: "black",
            ".PageTitle": {
                fontSize: "24px",
                fontWeight: "bold",
                lineHeight: "130%",
            },
            "#SwinxLogo": {
                float: "right",
                width: "100px",
                height: "1.5em",
                marginInlineStart: "10px",
            },
        },
    };

    return (
        <Box
            id="Title"
            sx={sx}
        >
            {/* <SwinxLogo /> */}
            <Typography className="PageTitle">{`Leistungübersicht für ihre Kampagne von ${campaign.customerCompany}`}</Typography>
        </Box>
    );
}
