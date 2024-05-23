import { Box, Typography } from "@mui/material";
import { BudgetDescriptionText } from "./BudgetDescriptionText";
import { WebinarDescription } from "./WebinarDescription";
import { Campaign, TimelineEvent, Webinar } from "../Functions/Database/types";

interface IntroductionProps {
    candidateFullName: string;
    webinar: Webinar;
    CampaignData: Campaign;
}
export default function Introduction({
    candidateFullName,
    webinar,
    CampaignData,
}: IntroductionProps) {
    return (
        <Box>
            <Typography>
                Hallo {candidateFullName},<br />
                Wir würden Sie gerne als Speaker*in für eine Kampagne unseres Kunden{" "}
                <strong>{CampaignData.customerCompany}</strong> gewinnen.
            </Typography>
            <WebinarDescription webinar={webinar} campaign={CampaignData} />
            <BudgetDescriptionText />
            <Typography>
                Wir möchten dabei folgende Aufgaben in Ihre Verantwortung übergeben:
            </Typography>
        </Box>
    );
}
