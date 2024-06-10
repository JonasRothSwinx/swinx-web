import dayjs from "@/app/utils/configuredDayJs";
import { Box, Typography } from "@mui/material";
import { TimelineEvent } from "../../Functions/Database/types";
import dateToRange from "../../Functions/dateToRange";

//MARK: VideoDescription
interface VideoDescriptionProps {
    events: TimelineEvent[];
}
export default function VideoDescription({ events }: VideoDescriptionProps) {
    return (
        <Box id="DescriptionContainer">
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Videobeiträge</Typography>
            </Box>
            <Box id="SummaryContainer">
                {events.map((event) => {
                    const { startDate, endDate } = dateToRange({ date: event.date });
                    return (
                        <Typography key={event.id}>
                            Sie werden das Webinar des Kunden{" "}
                            {event.date && (
                                // <>
                                //     am <strong>{`${dayjs(event.date).format("DD.MM")}`}</strong>{" "}
                                // </>
                                <>
                                    im Zeitraum vom <strong>{`${startDate}`}</strong> bis{" "}
                                    <strong>{`${endDate}`}</strong>{" "}
                                </>
                            )}
                            in einem Videobeitrag{" "}
                            {event.info?.topic && (
                                <>
                                    zum Thema <strong>{`"${event.info.topic}"`}</strong>{" "}
                                </>
                            )}
                            auf ihrem LinkedIn-Profil bewerben.
                            {event.info?.draftDeadline && (
                                <>
                                    <br />
                                    Die Aufnahme muss dabei bis zum{" "}
                                    <strong>{dayjs(event.info.draftDeadline).format("DD.MM")}</strong> bei uns
                                    eingereicht werden.
                                </>
                            )}
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}
