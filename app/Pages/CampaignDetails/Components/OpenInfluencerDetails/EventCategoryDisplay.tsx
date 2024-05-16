import { timelineEventTypesType } from "@/amplify/data/types";
import { CheckIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Unstable_Grid2 as Grid,
    Typography,
} from "@mui/material";
import { EventCategory } from "./functions/categorizeEvents";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { highlightData } from "@/app/Definitions/types";

interface EventCategoryDisplayProps {
    category: EventCategory;
}

type setHighlightedEventFunction = (event?: TimelineEvent.Event) => void;

export default function EventCategoryDisplay(props: EventCategoryDisplayProps) {
    const {
        category: { type: groupType, events },
        // setHighlightedEvent,
    } = props;
    const queryClient = useQueryClient();

    function randomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function setHighlightedEvent(event?: TimelineEvent.Event) {
        const id = event?.id;
        if (!id) return;

        queryClient.setQueryData<highlightData[]>(["highlightedEvents"], (prev) => {
            let color = randomColor();
            if (!prev) return [{ id, color }];
            //reroll color until unique in prev
            while (prev.find((e) => e.color === color)) {
                color = randomColor();
            }
            if (prev.find((e) => e.id === id)) {
                return prev.filter((e) => e.id !== id);
            }
            return [...prev, { id, color }];
        });
        // queryClient.setQueryData(["highlightedEvents"], [id]);
        queryClient.refetchQueries({ queryKey: ["highlightedEvents"] });
    }
    const highlightData = useQuery({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData<highlightData[]>(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });
    // console.log("EventCategoryDisplay", groupType, events);
    const CategoryTitle: { [key in TimelineEvent.singleEventType]: JSX.Element } = {
        Invites: <InviteEventsDisplayTitle events={events} />,
        Post: <PostEventsDisplayTitle events={events} />,
        Video: <VideoEventsDisplayTitle events={events} />,
        WebinarSpeaker: <WebinarSpeakerEventsDisplayTitle events={events} />,
    };
    const CategoryDetails: { [key in TimelineEvent.singleEventType]: JSX.Element } = {
        Invites: (
            <InviteEventsDetails
                events={events}
                setHighlightedEvent={setHighlightedEvent}
                highlightData={highlightData.data ?? []}
            />
        ),
        Post: (
            <PostEventsDetails
                events={events}
                setHighlightedEvent={setHighlightedEvent}
                highlightData={highlightData.data ?? []}
            />
        ),
        Video: (
            <VideoEventsDisplay
                events={events}
                setHighlightedEvent={setHighlightedEvent}
                highlightData={highlightData.data ?? []}
            />
        ),
        WebinarSpeaker: (
            <WebinarEventsDisplay
                events={events}
                setHighlightedEvent={setHighlightedEvent}
                highlightData={highlightData.data ?? []}
            />
        ),
    };

    return (
        <Accordion>
            {CategoryTitle[groupType as TimelineEvent.singleEventType]}
            {CategoryDetails[groupType as TimelineEvent.singleEventType]}
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
            {date.isBefore(dayjs()) ? (
                <CheckIcon color={"success"} sx={{ overflow: "hidden" }} />
            ) : (
                <></>
            )}
        </div>
    );
}
const eventTypeColumnWidth = 5;
//#region InviteEvents
function InviteEventsDisplayTitle(props: { events: TimelineEvent.Event[] }) {
    const totalInvites = props.events.reduce((acc, event) => {
        if (TimelineEvent.isInviteEvent(event) && event.eventTaskAmount) {
            return acc + event.eventTaskAmount;
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
    events: TimelineEvent.Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    const { events, setHighlightedEvent } = props;
    return (
        <AccordionDetails>
            {events.map((event) => {
                return (
                    <InviteEventItem
                        key={event.id}
                        event={event}
                        setHighlightedEvent={setHighlightedEvent}
                        highlightData={props.highlightData?.find((x) => x.id === event.id)}
                    />
                );
            })}
        </AccordionDetails>
    );
}
function InviteEventItem(props: {
    event: TimelineEvent.Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    if (!TimelineEvent.isInviteEvent(event)) return <>Error</>;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid container columnGap={"10px"}>
                <Grid xs={4} paddingRight="5px" display={"flex"} justifyContent={"flex-end"}>
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid xs={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid xs>
                    <Typography>{event.eventTaskAmount}</Typography>
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
function PostEventsDisplayTitle(props: { events: TimelineEvent.Event[] }) {
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
    events: TimelineEvent.Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    return (
        <AccordionDetails>
            {props.events.map((event) => (
                <PostEventItem
                    key={event.id}
                    event={event}
                    setHighlightedEvent={props.setHighlightedEvent}
                    highlightData={props.highlightData?.find((x) => x.id === event.id)}
                />
            ))}
        </AccordionDetails>
    );
}
function PostEventItem(props: {
    event: TimelineEvent.Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
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
function WebinarSpeakerEventsDisplayTitle(props: { events: TimelineEvent.Event[] }) {
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container sx={{ width: "100%" }}>
                <Grid xs={eventTypeColumnWidth}>Webinar Speaker</Grid>
                <Grid xs>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function WebinarEventsDisplay(props: {
    events: TimelineEvent.Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    return (
        <AccordionDetails>
            {props.events.map((event) => (
                <WebinarEventItem
                    key={event.id}
                    event={event}
                    setHighlightedEvent={props.setHighlightedEvent}
                    highlightData={props.highlightData?.find((x) => x.id === event.id)}
                />
            ))}
        </AccordionDetails>
    );
}

function WebinarEventItem(props: {
    event: TimelineEvent.Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
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

//#region VideoEvents
function VideoEventsDisplayTitle(props: { events: TimelineEvent.Event[] }) {
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
    events: TimelineEvent.Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    return (
        <AccordionDetails>
            {props.events.map((event) => (
                <VideoEventItem
                    key={event.id}
                    event={event}
                    setHighlightedEvent={props.setHighlightedEvent}
                    highlightData={props.highlightData?.find((x) => x.id === event.id)}
                />
            ))}
        </AccordionDetails>
    );
}

function VideoEventItem(props: {
    event: TimelineEvent.Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
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
