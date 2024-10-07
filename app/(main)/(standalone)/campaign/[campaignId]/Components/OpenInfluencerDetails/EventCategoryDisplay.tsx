import { timelineEventTypesType } from "@/amplify/data/types";
import { CheckIcon, ExpandMoreIcon } from "@/app/Definitions/Icons";
import { Event, Events } from "@/app/ServerFunctions/types";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid2 as Grid,
    Typography,
} from "@mui/material";
import { EventCategory } from "./functions/categorizeEvents";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { highlightData } from "@/app/Definitions/types";
import { randomId } from "@mui/x-data-grid-generator";

//#region config
interface CategoryTitleProps {
    events: Event[];
}
const CategoryTitle: {
    [key in Events.singleEventType]: (props: CategoryTitleProps) => JSX.Element;
} = {
    Invites: (props) => <InviteEventsDisplayTitle {...props} />,
    Post: (props) => <PostEventsDisplayTitle {...props} />,
    Video: (props) => <VideoEventsDisplayTitle {...props} />,
    WebinarSpeaker: (props) => <WebinarSpeakerEventsDisplayTitle {...props} />,
    ImpulsVideo: (props) => <ImpulsVideoEventsDisplayTitle {...props} />,
};

interface CategoryDetailsProps {
    events: Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}
const CategoryDetails: {
    [key in Events.singleEventType]: (props: CategoryDetailsProps) => JSX.Element;
} = {
    Invites: (props) => <InviteEventsDetails {...props} />,
    Post: (props) => <PostEventsDetails {...props} />,
    Video: (props) => <VideoEventsDisplay {...props} />,
    WebinarSpeaker: (props) => <WebinarEventsDisplay {...props} />,
    ImpulsVideo: (props) => <ImpulsVideoEventsDisplay {...props} />,
};
//#endregion config

type setHighlightedEventFunction = (event?: Event) => void;

interface EventCategoryDisplayProps {
    category: EventCategory;
}

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
    function setHighlightedEvent(event?: Event) {
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

    return (
        <Accordion>
            {CategoryTitle[groupType as Events.singleEventType]({ events })}
            {CategoryDetails[groupType as Events.singleEventType]({
                events,
                setHighlightedEvent,
                highlightData: highlightData.data,
            })}
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
                <CheckIcon
                    color={"success"}
                    sx={{ overflow: "hidden" }}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
const eventTypeColumnWidth = 5;
//#region InviteEvents
function InviteEventsDisplayTitle(props: { events: Event[] }) {
    const { events } = props;
    const totalInvites = props.events.reduce((acc, event) => {
        if (Events.isInviteEvent(event) && event.eventTaskAmount) {
            return acc + event.eventTaskAmount;
        }
        return acc;
    }, 0);
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
                container
                sx={{ width: "100%" }}
            >
                <Grid size={eventTypeColumnWidth}>
                    {Events.getDisplayName(events[0].type, events.length > 1 ? "plur" : "sing")}
                </Grid>
                <Grid>
                    {totalInvites} über {props.events.length} Termine
                </Grid>
            </Grid>
        </AccordionSummary>
    );
}
function InviteEventsDetails(props: {
    events: Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    const { events, setHighlightedEvent } = props;
    return (
        <AccordionDetails>
            {events.map((event) => {
                return (
                    <InviteEventItem
                        key={event.id ?? randomId()}
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
    event: Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    if (!Events.isInviteEvent(event)) return <>Error</>;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid
                container
                columnGap={"10px"}
            >
                <Grid
                    size={4}
                    paddingRight="5px"
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid size={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid>
                    <Typography>{event.eventTaskAmount}</Typography>
                </Grid>
                <Grid
                    size={1}
                    sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}
                >
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion InviteEvents

//#region PostEvents
function PostEventsDisplayTitle(props: { events: Event[] }) {
    const { events } = props;
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
                container
                sx={{ width: "100%" }}
            >
                <Grid size={eventTypeColumnWidth}>
                    {Events.getDisplayName(events[0].type, events.length > 1 ? "plur" : "sing")}
                </Grid>
                <Grid>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}
function PostEventsDetails(props: {
    events: Event[];
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
    event: Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid
                container
                columnGap={"10px"}
            >
                <Grid
                    size={4}
                    paddingRight="5px"
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid size={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid />
                <Grid
                    size={1}
                    sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}
                >
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion PostEvents

//#region WebinarEvents
function WebinarSpeakerEventsDisplayTitle(props: { events: Event[] }) {
    const { events } = props;
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
                container
                sx={{ width: "100%" }}
            >
                <Grid size={eventTypeColumnWidth}>
                    {Events.getDisplayName(events[0].type, events.length > 1 ? "plur" : "sing")}
                </Grid>
                <Grid>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function WebinarEventsDisplay(props: {
    events: Event[];
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
    event: Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid
                container
                columnGap={"10px"}
            >
                <Grid
                    size={4}
                    paddingRight="5px"
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid size={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid />
                <Grid
                    size={1}
                    sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}
                >
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion WebinarEvents

//#region VideoEvents
function VideoEventsDisplayTitle(props: { events: Event[] }) {
    const { events } = props;
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
                container
                sx={{ width: "100%" }}
            >
                <Grid size={eventTypeColumnWidth}>
                    {Events.getDisplayName(events[0].type, events.length > 1 ? "plur" : "sing")}
                </Grid>
                <Grid>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function VideoEventsDisplay(props: {
    events: Event[];
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
    event: Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid
                container
                columnGap={"10px"}
                width={"100%"}
            >
                <Grid
                    size={4}
                    paddingRight="5px"
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid size={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid />
                <Grid
                    size={1}
                    sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}
                >
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion VideoEvents

//#region ImpulsVideoEvent
function ImpulsVideoEventsDisplayTitle(props: { events: Event[] }) {
    const { events } = props;
    return (
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
                container
                sx={{ width: "100%" }}
            >
                <Grid size={eventTypeColumnWidth}>
                    {Events.getDisplayName(events[0].type, events.length > 1 ? "plur" : "sing")}
                </Grid>
                <Grid>{props.events.length} Termine</Grid>
            </Grid>
        </AccordionSummary>
    );
}

function ImpulsVideoEventsDisplay(props: {
    events: Event[];
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData[];
}) {
    return (
        <AccordionDetails>
            {props.events.map((event) => (
                <ImpulsVideoEventItem
                    key={event.id}
                    event={event}
                    setHighlightedEvent={props.setHighlightedEvent}
                    highlightData={props.highlightData?.find((x) => x.id === event.id)}
                />
            ))}
        </AccordionDetails>
    );
}

function ImpulsVideoEventItem(props: {
    event: Event;
    setHighlightedEvent: setHighlightedEventFunction;
    highlightData?: highlightData;
}) {
    const { event, setHighlightedEvent } = props;
    return (
        <div
            onClick={() => setHighlightedEvent(event)}
            style={{ backgroundColor: props.highlightData?.color }}
        >
            <Grid
                container
                columnGap={"10px"}
                width={"100%"}
            >
                <Grid
                    size={4}
                    paddingRight="5px"
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <EventDate date={props.event.date ?? ""} />
                </Grid>
                <Grid size={4}>
                    <EventDateRelative date={props.event.date ?? ""} />
                </Grid>
                <Grid />
                <Grid
                    size={1}
                    sx={{ "& .MuiGrid2-root,&": { overflowY: "hidden!important" } }}
                >
                    <EventFinished date={props.event.date ?? ""} />
                </Grid>
            </Grid>
        </div>
    );
}
//#endregion ImpulsVideoEvent
