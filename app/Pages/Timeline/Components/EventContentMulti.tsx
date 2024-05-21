import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import {
    CircularProgress,
    Unstable_Grid2 as Grid,
    GridSize,
    Link,
    Typography,
} from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";

interface EventContentProps {
    event: TimelineEvent.MultiEvent;
    columnSize?: number | GridSize;
}
type eventType = TimelineEvent.multiEventType;
export default function EventContentMulti(props: EventContentProps) {
    const { event, columnSize = 10 } = props;
    const EventElement: { [key in eventType]: JSX.Element } = {
        Webinar: <WebinarEventContent event={event} />,
    };

    return (
        <Grid sx={{ paddingLeft: "10px" }} xs={columnSize}>
            {EventElement[event.type as eventType] ?? <></>}
        </Grid>
    );
}

function WebinarEventContent(props: EventContentProps) {
    const { event } = props;
    const speakers = useMemo(
        () => event.childEvents.filter((childEvent) => childEvent.type === "WebinarSpeaker"),
        [event],
    );
    const speakerEvents = useQueries({
        queries: speakers.map((speaker) => ({
            enabled: speaker.id !== undefined,
            queryKey: ["timelineEvent", speaker.id],
            queryFn: () => {
                return dataClient.timelineEvent.get(speaker.id!);
            },
        })),
    });
    // debugger;
    const openSlots = event.eventAssignmentAmount - speakers.length;
    return (
        <Grid xs>
            <Typography variant="h6">{event.type}</Typography>
            <Typography variant="body1">Titel: {event.eventTitle}</Typography>
            {event.eventAssignmentAmount > 0 && (
                <>
                    <Typography variant="body1">Speaker:</Typography>
                    {speakerEvents.map((event, index) => {
                        console.log(event);
                        const data = event.data;
                        if (!data) return <CircularProgress key={index} />;
                        const assignment = data.assignments[0];
                        return (
                            <Grid key={data.id} xs>
                                -{" "}
                                {assignment.isPlaceholder
                                    ? `Influencer ${assignment.placeholderName}`
                                    : `${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
                            </Grid>
                        );
                    })}
                    {openSlots > 0 && (
                        <Typography variant="body1">
                            {openSlots} {openSlots === 1 ? "Platz" : "Plätze"} nicht belegt
                        </Typography>
                    )}
                </>
            )}
            <Typography variant="body1">
                {event.info?.eventLink ? (
                    <Link href={event.info.eventLink} target="_blank">
                        Zur Eventpage
                    </Link>
                ) : (
                    <Typography
                        bgcolor={"red"}
                        sx={{
                            color: "white",
                            paddingInline: "5px",
                            maxWidth: "fit-content",
                            borderRadius: "5px",
                        }}
                    >
                        Eventpage Link fehlt
                    </Typography>
                )}
            </Typography>
        </Grid>
    );
}
// interface ItemNameProps {
//     event: TimelineEvent.MultiEvent;
// }
// function ItemName(props: ItemNameProps) {
//     const { event } = props;
//     return (
//         <Grid xs>
//             {event.assignment.isPlaceholder
//                 ? `Influencer ${event.assignment.placeholderName}`
//                 : `${event.assignment.influencer?.firstName} ${event.assignment.influencer?.lastName}`}
//             {/* {event.assignment.influencer?.firstName} {event.assignment.influencer?.lastName} */}
//         </Grid>
//     );
// }
