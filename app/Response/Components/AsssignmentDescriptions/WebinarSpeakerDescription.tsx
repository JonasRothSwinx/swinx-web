import dayjs from "@/app/utils/configuredDayJs";
import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { TimelineEvent, Webinar } from "../../Functions/Database/types";
import Loading from "../Loading";

//MARK: WebinarSpeakerDescription
interface WebinarSpeakerDescriptionProps {
    events: TimelineEvent[];
}
export default function WebinarSpeakerDescription({ events }: WebinarSpeakerDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(["parentEvent"]);
    if (!events || !webinar) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    return (
        <Box id="DescriptionContainer">
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Webinar Speaker</Typography>
            </Box>
            <Box id="SummaryContainer">
                {events.map((event) => {
                    return (
                        <Typography key={event.id}>
                            Sie werden{" "}
                            {webinar.date && (
                                <>
                                    am <strong>{dayjs(webinar.date).format("DD.MM")}</strong>{" "}
                                </>
                            )}
                            als Speaker am Webinar des Kunden teilnehmen.
                            <br />
                            Dort sollen Sie zum Thema <strong>{`"${event.eventTitle}"`}</strong> sprechen.
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}
