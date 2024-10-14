import { dayjs } from "@/app/utils";
import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { TimelineEvent, Webinar } from "../../Functions/Database/types";
import Loading from "../Loading";
import { queryKeys } from "../../queryKeys";

//MARK: WebinarSpeakerDescription
interface WebinarSpeakerDescriptionProps {
    events: TimelineEvent[];
    parentEventId: string;
}
export default function WebinarSpeakerDescription({
    events,
    parentEventId,
}: WebinarSpeakerDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(queryKeys.event.parent(parentEventId));
    if (!events || !webinar) {
        // queryClient.refetchQueries();
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
                            Dort sollen Sie zum Thema <strong>{`"${event.eventTitle}"`}</strong>{" "}
                            sprechen.
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}
