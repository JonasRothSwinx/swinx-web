import dayjs from "@/app/utils/configuredDayJs";
import { Box, Typography } from "@mui/material";
import { TimelineEvent } from "../../Functions/Database/types";

//MARK: PostDescription
interface PostDescriptionProps {
    events: TimelineEvent[];
}
export function PostDescription({ events }: PostDescriptionProps) {
    return (
        <Box id="DescriptionContainer">
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Textbeiträge</Typography>
            </Box>
            <Box id="SummaryContainer">
                {events.map((event) => {
                    return (
                        <Typography key={event.id}>
                            Sie werden das Webinar des Kunden{" "}
                            {event.date && (
                                <>
                                    am <strong>{`${dayjs(event.date).format("DD.MM")}`}</strong>{" "}
                                </>
                            )}
                            in einem Textbeitrag{" "}
                            {event.info?.topic && (
                                <>
                                    zum Thema <strong>{`"${event.info.topic}"`}</strong>{" "}
                                </>
                            )}
                            auf ihrem LinkedIn-Profil bewerben.
                            {event.info?.draftDeadline && (
                                <>
                                    <br />
                                    Der Entwurf muss dabei bis zum{" "}
                                    <strong>
                                        {dayjs(event.info.draftDeadline).format("DD.MM")}
                                    </strong>{" "}
                                    bei uns eingereicht werden.
                                </>
                            )}
                        </Typography>
                    );
                })}
            </Box>
        </Box>
    );
}
