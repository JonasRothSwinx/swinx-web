import { dayjs } from "@/app/utils";
import { CircularProgress, Typography } from "@mui/material";
import { Campaign, Webinar } from "../../Functions/Database/types";

//MARK: - WebinarDescription
interface WebinarDescriptionProps {
    webinar: Webinar;
    campaign: Campaign;
}
export function WebinarDescription({ webinar, campaign }: WebinarDescriptionProps) {
    if (!webinar) return <CircularProgress />;
    const { id, eventTitle, date } = webinar;
    const dateString = dayjs(date).format("DD.MM.YYYY");
    const timeString = dayjs(date).format("HH:mm");
    const customerCompany = campaign.customerCompany;
    return (
        <Typography>
            {customerCompany} werden am{" "}
            <strong>
                {dateString} um {timeString}
            </strong>{" "}
            ein Webinar zum Thema <strong>{`"${webinar.eventTitle}"`}</strong> halten.
        </Typography>
    );
}
