import { Event, Events } from "@/app/ServerFunctions/types";
import { Box, Unstable_Grid2 as Grid, GridSize, IconButton } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import { dayjs } from "@/app/utils";
import { timelineEventTypesType } from "@/amplify/data/types";
import { DeleteIcon, EditIcon } from "@/app/Definitions/Icons";

interface EventContentProps {
    event: Events.SingleEvent;
    columnSize?: number | GridSize;
    editing?: boolean;
}
type eventType = Events.singleEventType;
export default function EventContentSingle(props: EventContentProps) {
    const { event, columnSize = 10, editing = false } = props;
    const EventElement: { [key in eventType]: JSX.Element } = {
        Invites: <InviteEventContent event={event} />,
        ImpulsVideo: <ImpulsVideoEventContent event={event} />,
        Post: <PostEventContent event={event} />,
        Video: <VideoEventContent event={event} />,
        WebinarSpeaker: <></>,
        // WebinarSpeaker: <WebinarEventContent event={event} />,
    };

    return (
        <Grid
            id="EventContentSingle"
            xs={columnSize}
        >
            {EventElement[event.type as eventType] ?? <></>}
        </Grid>
    );
}

function InviteEventContent(props: EventContentProps) {
    const { event } = props;
    if (!Events.isInviteEvent(event)) return <></>;
    return (
        <Grid container>
            <Grid xs>
                <ItemName event={event} />
            </Grid>
            <Grid
                xs={2}
                sx={{ textAlign: "end", paddingInlineEnd: "2px" }}
            >
                <div>{event.eventTaskAmount}</div>
            </Grid>
        </Grid>
    );
}

function PostEventContent(props: EventContentProps) {
    const { event } = props;
    return (
        <Grid xs>
            <ItemName event={event} />
        </Grid>
    );
}

function VideoEventContent(props: EventContentProps) {
    const { event } = props;
    return (
        <Grid
            id="EventContent"
            xs
        >
            <ItemName event={event} />
        </Grid>
    );
}
function ImpulsVideoEventContent(props: EventContentProps) {
    const { event } = props;
    return (
        <Grid
            id="EventContent"
            xs
        >
            <ItemName event={event} />
        </Grid>
    );
}

interface ItemNameProps {
    event: Events.SingleEvent;
}
function ItemName(props: ItemNameProps) {
    const { event } = props;
    const assignment = event.assignments[0];
    return (
        <Grid
            id="AssignmentName"
            xs
        >
            {assignment.isPlaceholder
                ? `Influencer ${assignment.placeholderName}`
                : `${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
            {/* {event.assignment.influencer?.firstName} {event.assignment.influencer?.lastName} */}
        </Grid>
    );
}
