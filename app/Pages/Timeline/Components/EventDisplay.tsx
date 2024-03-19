import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Unstable_Grid2 as Grid, GridSize } from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";

interface EventProps {
    event: TimelineEvent.TimelineEvent;
    groupBy: groupBy;
    totalColumns?: number;
    highlighted?: boolean;
}
export function Event(props: EventProps) {
    const { event, groupBy, totalColumns = 12, highlighted = false } = props;
    const dateColumns = groupBy === "day" ? 0 : 1;
    return (
        <Grid sx={{ paddingLeft: "10px", backgroundColor: highlighted ? "yellow" : undefined }} container>
            {dateColumns > 0 && <EventDate date={event.date ?? ""} groupBy={groupBy} columnSize={dateColumns} />}
            <EventContent event={event} columnSize={totalColumns - dateColumns} />
        </Grid>
    );
}

interface EventDateProps {
    columnSize?: number | GridSize;
    date: string;
    groupBy: groupBy;
}
function EventDate(props: EventDateProps) {
    const { date, groupBy, columnSize = 2 } = props;
    const processedDate = dayjs(date);
    const dateDisplay: { [key in groupBy]: JSX.Element } = {
        day: <>{processedDate.format("h:mm")}</>,
        week: <>{processedDate.format("ddd")}</>,
    };

    return <Grid xs={columnSize}>{dateDisplay[groupBy]}</Grid>;
}

interface EventContentProps {
    event: TimelineEvent.TimelineEvent;
    columnSize?: number | GridSize;
}
function EventContent(props: EventContentProps) {
    const { event, columnSize = 10 } = props;
    const EventElement: { [key in timelineEventTypesType]: JSX.Element } = {
        Invites: <InviteEventContent event={event} />,
        Post: <PostEventContent event={event} />,
        Webinar: <WebinarEventContent event={event} />,
        Generic: <GenericEventContent event={event} />,
        Video: <VideoEventContent event={event} />,
    };

    return (
        <Grid sx={{ paddingLeft: "10px" }} xs={columnSize}>
            {EventElement[event.timelineEventType as timelineEventTypesType] ?? <></>}
        </Grid>
    );
}

function InviteEventContent(props: EventContentProps) {
    const { event } = props;
    if (!TimelineEvent.isInviteEvent(event)) return <></>;
    return (
        <Grid container>
            <Grid xs>
                <ItemName event={event} />
            </Grid>
            <Grid xs={2} sx={{ textAlign: "end", paddingInlineEnd: "2px" }}>
                <div>{event.inviteEvent?.invites}</div>
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

function GenericEventContent(props: EventContentProps) {
    const { event } = props;
    return <></>;
}

function WebinarEventContent(props: EventContentProps) {
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
        <Grid xs>
            <ItemName event={event} />
        </Grid>
    );
}

interface ItemNameProps {
    event: TimelineEvent.TimelineEvent;
}
function ItemName(props: ItemNameProps) {
    const { event } = props;
    return (
        <Grid xs>
            {event.assignment.isPlaceholder
                ? `Influencer ${event.assignment.placeholderName}`
                : `${event.assignment.influencer?.firstName} ${event.assignment.influencer?.lastName}`}
            {/* {event.assignment.influencer?.firstName} {event.assignment.influencer?.lastName} */}
        </Grid>
    );
}
