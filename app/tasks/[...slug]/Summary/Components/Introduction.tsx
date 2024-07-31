import { Box, SxProps, Typography } from "@mui/material";
import { Campaign, TimelineEvent, Webinar } from "../../Functions/Database/types";

interface IntroductionProps {
    influencerFullName: string;
    webinar: Webinar;
    campaign: Campaign;
}
export function Introduction({ influencerFullName, webinar, campaign }: IntroductionProps) {
    const sx: SxProps = {
        "&": {
            width: "fit-content",
            backgroundColor: "white",
            borderRadius: "10px 10px 0 0",
            color: "black",
            flex: 10,
            fontSize: 24,
            "#Greeting": {
                fontSize: 20,
                paddingBottom: "10px",
            },
            ".MuiTypography-root": {
                fontSize: 16,
            },
        },
    };
    return (
        <Box sx={sx}>
            <Typography id="Greeting">
                Hallo <strong>{influencerFullName}</strong>,
            </Typography>
            <Typography>
                Hier finden sie eine Übersicht über ihre Aufgaben für das <strong>Event</strong>{" "}
                unseres Auftraggebers <strong>{campaign.customerCompany}</strong>.
            </Typography>
            {/* <WebinarDescription webinar={webinar} campaign={CampaignData} /> */}
        </Box>
    );
}
