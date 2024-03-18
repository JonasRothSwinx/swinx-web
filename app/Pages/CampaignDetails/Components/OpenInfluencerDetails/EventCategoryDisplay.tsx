import { timelineEventTypesType } from "@/amplify/data/types";
import { CheckIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Accordion, AccordionSummary, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { EventCategory } from "./functions/categorizeEvents";
import dayjs from "dayjs";

interface EventCategoryDisplayProps {
    category: EventCategory;
    setHighlightedEvent: setHighlightedEventFunction;
}

type setHighlightedEventFunction = (event?: TimelineEvent.TimelineEvent) => void;

export default function EventCategoryDisplay(props: EventCategoryDisplayProps) {
    const {
        category: { type: groupType, events },
        setHighlightedEvent,
    } = props;
    // console.log("EventCategoryDisplay", groupType, events);
    const CategoryTitle: { [key in timelineEventTypesType]: JSX.Element } = {
        Invites: <InviteEventsDisplayTitle events={events} />,
        Post: <PostEventsDisplayTitle events={events} />,
        Webinar: <WebinarEventsDisplayTitle events={events} />,
        Generic: <GenericEventsDisplayTitle events={events} />,
        Video: <VideoEventsDisplayTitle events={events} />,
    };
    const CategoryDetails: { [key in timelineEventTypesType]: JSX.Element } = {
        Invites: <InviteEventsDetails events={events} setHighlightedEvent={setHighlightedEvent} />,
        Post: <PostEventsDetails events={events} setHighlightedEvent={setHighlightedEvent} />,
        Webinar: <WebinarEventsDisplay events={events} setHighlightedEvent={setHighlightedEvent} />,
        Generic: <GenericEventsDisplay events={events} setHighlightedEvent={setHighlightedEvent} />,
        Video: <VideoEventsDisplay events={events} setHighlightedEvent={setHighlightedEvent} />,
    };
    return (
        <Accordion>
            {CategoryTitle[groupType as timelineEventTypesType]}
            {CategoryDetails[groupType as timelineEventTypesType]}
        </Accordion>
    );
}
function EventDate(props: { date: string }) {
    const date = dayjs(props.date);
    if (!date.isValid()) {
        return <div>Invalid Date</div>;
    }
    return <div>{date.format("DD.MM.YYYY")}</div>;
}

function EventDateRelative(props: { date: string }) {
    const date = dayjs(props.date);
    if (!date.isValid()) {
        return <div>Invalid Date</div>;
    }
    return <>({date.fromNow()})</>;
}

function EventFinished(props: { date: string }) {
    const date = dayjs(props.date);
    if (!date.isValid()) {
        return <div>Invalid Date</div>;
    }
    return (
        <div style={{ maxHeight: ".8em", overflow: "visible" }}>
            {date.isBefore(dayjs()) ? <CheckIcon color={"success"} sx={{ overflow: "hidden" }} /> : <></>}
        </div>
    );
}
const eventTypeColumnWidth = 5;
//#region InviteEvents
function InviteEventsDisplayTitle(props: { events: TimelineEvent.TimelineEvent[] }) {
    const totalInvites = props.events.reduce((acc, event) => {
        if (TimelineEvent.isInviteEvent(event) && event.inviteEvent?.invites) {
            return acc + event.inviteEvent.invites;
        }
        return acc;
    }, 0);
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Invites</Grid>
                <Grid xs>
                    {totalInvites} über {props.events.length} Termine
                </Grid>
            </Grid>
        </AccordionSummary>
    );
}
function InviteEventsDetails(props: {
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { events, setHighlightedEvent } = props;
    return (
        <>
            {events.map((event) => (
                <InviteEventItem key={event.id} event={event} setHighlightedEvent={setHighlightedEvent} />
            ))}
        </>
    );
}
function InviteEventItem(props: {
    event: TimelineEvent.TimelineEvent;
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { event, setHighlightedEvent } = props;
    if (!TimelineEvent.isInviteEvent(event)) return <>Error</>;
    return (
        <div onClick={() => setHighlightedEvent(event)}>
            <Grid container columnGap={"10px"}>
                <Grid xs={4} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs>
                    <Typography>{event.inviteEvent?.invites}</Typography>
                </Grid>
                <Grid xs={1} sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}>
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion InviteEvents

//#region PostEvents
function PostEventsDisplayTitle(props: { events: TimelineEvent.TimelineEvent[] }) {
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Textbeiträge</Grid>
                <Grid xs>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}
function PostEventsDetails(props: {
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    return (
        <>
            {props.events.map((event) => (
                <PostEventItem key={event.id} event={event} setHighlightedEvent={props.setHighlightedEvent} />
            ))}
        </>
    );
}
function PostEventItem(props: {
    event: TimelineEvent.TimelineEvent;
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div onClick={() => setHighlightedEvent(event)}>
            <Grid container columnGap={"10px"}>
                <Grid xs={4} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs />
                <Grid xs={1} sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}>
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion PostEvents

//#region WebinarEvents
function WebinarEventsDisplayTitle(props: { events: TimelineEvent.TimelineEvent[] }) {
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Webinare</Grid>
                <Grid xs>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function WebinarEventsDisplay(props: {
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    return (
        <>
            {props.events.map((event) => (
                <WebinarEventItem key={event.id} event={event} setHighlightedEvent={props.setHighlightedEvent} />
            ))}
        </>
    );
}

function WebinarEventItem(props: {
    event: TimelineEvent.TimelineEvent;
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div onClick={() => setHighlightedEvent(event)}>
            <Grid container columnGap={"10px"}>
                <Grid xs={4} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs />
                <Grid xs={1} sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}>
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion WebinarEvents

//#region GenericEvents
function GenericEventsDisplayTitle(props: { events: TimelineEvent.TimelineEvent[] }) {
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Generisch</Grid>
                <Grid xs>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function GenericEventsDisplay(props: {
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    return (
        <>
            {props.events.map((event) => (
                <GenericEventItem key={event.id} event={event} setHighlightedEvent={props.setHighlightedEvent} />
            ))}
        </>
    );
}

function GenericEventItem(props: {
    event: TimelineEvent.TimelineEvent;
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div onClick={() => setHighlightedEvent(event)}>
            <Grid container columnGap={"10px"}>
                <Grid xs={3} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={1} sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}>
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion GenericEvents

//#region VideoEvents
function VideoEventsDisplayTitle(props: { events: TimelineEvent.TimelineEvent[] }) {
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Videos</Grid>
                <Grid xs>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function VideoEventsDisplay(props: {
    events: TimelineEvent.TimelineEvent[];
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    return (
        <>
            {props.events.map((event) => (
                <VideoEventItem key={event.id} event={event} setHighlightedEvent={props.setHighlightedEvent} />
            ))}
        </>
    );
}

function VideoEventItem(props: {
    event: TimelineEvent.TimelineEvent;
    setHighlightedEvent: setHighlightedEventFunction;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div onClick={() => setHighlightedEvent(event)}>
            <Grid container columnGap={"10px"} width={"100%"}>
                <Grid xs={4} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs />
                <Grid xs={1} sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}>
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion VideoEvents
