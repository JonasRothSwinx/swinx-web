import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import { Unstable_Grid2 as Grid, GridSize, Typography } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";

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
    const openSlots = event.eventAssignmentAmount - event.assignments.length;
    return (
        <Grid xs>
            <Typography variant="h6">{event.type}</Typography>
            <Typography variant="body1">Titel: {event.eventTitle}</Typography>
            <Typography variant="body1">Speaker:</Typography>
            {event.assignments.map((assignment) => {
                return (
                    <Grid key={assignment.id} xs>
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
