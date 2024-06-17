import { Box, Typography } from "@mui/material";
import { WebinarDescription } from "./WebinarDescription";
import { Campaign, TimelineEvent, Webinar } from "../../Functions/Database/types";

interface IntroductionProps {
    influencerFullName: string;
    webinar: Webinar;
    CampaignData: Campaign;
}
export default function Introduction({ influencerFullName, webinar, CampaignData }: IntroductionProps) {
    return (
        <Box>
            <Typography>
                Hallo {influencerFullName},<br />
                Hier finden sie eine Übersicht über ihre Aufgaben für das Event unseres Kunden{" "}
                <strong>{CampaignData.customerCompany}</strong>.
            </Typography>
            {/* <WebinarDescription webinar={webinar} campaign={CampaignData} /> */}
        </Box>
    );
}
