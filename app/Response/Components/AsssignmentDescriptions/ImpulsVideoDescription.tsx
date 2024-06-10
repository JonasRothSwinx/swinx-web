import dayjs from "@/app/utils/configuredDayJs";
import { Box, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { TimelineEvent, Webinar } from "../../Functions/Database/types";
import Loading from "../Loading";

//MARK: WebinarSpeakerDescription
interface WebinarSpeakerDescriptionProps {
    events: TimelineEvent[];
}
export default function ImpulsVideoDescription({ events }: WebinarSpeakerDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(["parentEvent"]);
    if (!events || !webinar) {
        queryClient.refetchQueries();
        return <Loading />;
    }

    return (
        <Box id="DescriptionContainer">
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Impulsvideo</Typography>
            </Box>
            <Box id="SummaryContainer">
                {events.map((event) => {
                    const { eventTitle, info } = event;
                    const { maxDuration, draftDeadline } = info ?? {};
                    return (
                        <Typography key={event.id}>
                            Sie werden ein Impuls-Video zum Thema <strong>{eventTitle}</strong> für den Kunden
                            erstellen, das im Webinar des Kunden gezeigt wird.
                            <br />
                            {draftDeadline && (
                                <>
                                    Die Aufnahme muss bis zum <strong>{dayjs(draftDeadline).format("DD.MM.")}</strong>{" "}
                                    bei uns eingeschickt werden.
                                    <br />
                                </>
                            )}
                            {maxDuration && (
                                <>
                                    Das Video darf maximal <strong>{maxDuration}</strong> Minuten lang sein.
                                </>
                            )}
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}
