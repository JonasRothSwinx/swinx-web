import { TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { randomDate, randomId } from "@mui/x-data-grid-generator";
import { timelineEventTypesType } from "@/amplify/data/types";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import dayjs, { Dayjs } from "@/app/configuredDayJs";

export interface TimelineViewProps {
    events: TimelineEvent.TimelineEvent[];
    groupBy: groupBy;
}

function makeDebugData() {
    const event: TimelineEvent.TimelineEvent[] = [];
    const now = new Date();
    for (let index = 0; index < 10; index++) {
        const date = randomDate(now, new Date(now.getDate() + 31));
        const debugEvent = {
            id: randomId(),
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
        };
    }
}
const defaultEvents: TimelineEvent.TimelineEvent[] = [];

type GroupedEvent = {
    type: timelineEventTypesType;
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TimelineEvent.TimelineEvent[];
};

export type groupBy = "day" | "week";

function TimelineView(props: TimelineViewProps) {
    const { events, groupBy = "week" } = props;
    const [groups, setGroups] = useState<GroupedEvent[]>([]);

    function groupEvents(groupBy: groupBy = "day") {
        let groupedEvents: GroupedEvent[] = [];
        switch (groupBy) {
            case "day":
                groupedEvents = events.reduce(
                    (groups: GroupedEvent[], event: TimelineEvent.TimelineEvent) => {
                        const eventDate = dayjs(event.date);
                        const group = groups.find((group) => {
                            return (
                                group.type === event.timelineEventType &&
                                eventDate.isBetween(
                                    group.dateGroupStart,
                                    group.dateGroupEnd,
                                    "day",
                                    "[]",
                                )
                            );
                        });
                        if (group) {
                            group.events.push(event);
                            return groups;
                        }
                        return [
                            ...groups,
                            {
                                type: event.timelineEventType as timelineEventTypesType,
                                dateGroupStart: eventDate.hour(0).minute(0),
                                dateGroupEnd: eventDate.hour(23).minute(59),
                                events: [event],
                            } satisfies GroupedEvent,
                        ];
                    },
                    [],
                );
                break;
            case "week":
                groupedEvents = events.reduce(
                    (groups: GroupedEvent[], event: TimelineEvent.TimelineEvent) => {
                        const eventDate = dayjs(event.date);
                        const group = groups.find((group) => {
                            return (
                                group.type === event.timelineEventType &&
                                eventDate.isBetween(
                                    group.dateGroupStart,
                                    group.dateGroupEnd,
                                    "week",
                                    "[)",
                                )
                            );
                        });
                        if (group) {
                            group.events.push(event);
                            group.events.sort(
                                (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
                            );
                            return groups;
                        }
                        const eventWeek = eventDate.week();
                        return [
                            ...groups,
                            {
                                type: event.timelineEventType as timelineEventTypesType,
                                dateGroupStart: eventDate.minute(0).hour(0).week(eventWeek).day(1),
                                dateGroupEnd: eventDate
                                    .minute(59)
                                    .hour(23)
                                    .week(eventWeek + 1)
                                    .day(1),
                                events: [event],
                            } satisfies GroupedEvent,
                        ];
                    },
                    [],
                );
                break;
        }
        console.log({ groupedEvents });
        groupedEvents.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());
        console.log({ groupedEvents });
        return groupedEvents;
    }
    useEffect(() => {
        setGroups(groupEvents(groupBy));
        return () => {};
    }, [events, groupBy]);
    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "5px" }}>
            {groups.map((group, i) => {
                return (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid black",
                            borderRadius: "10px",
                            // padding: "5px",
                            height: "fit-content",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                padding: "5px",
                                paddingBlockEnd: "10px",
                                borderBottom: "1px solid black",
                            }}
                        >
                            {group.type}
                            <br />{" "}
                            {(() => {
                                switch (groupBy) {
                                    case "day":
                                        return (
                                            <>
                                                {dayjs(group.dateGroupStart).format("ddd, DD.MM")} (
                                                {dayjs(group.dateGroupStart).fromNow()})
                                            </>
                                        );
                                    case "week":
                                        return (
                                            <>
                                                KW {dayjs(group.dateGroupStart).week()} (
                                                {dayjs(group.dateGroupStart).format("DD.MM")}
                                                {" - "}
                                                {dayjs(group.dateGroupStart).day(7).format("DD.MM")}
                                                )
                                            </>
                                        );
                                }
                            })()}
                        </div>
                        <div
                            style={{
                                padding: "5px",
                            }}
                        >
                            {group.events.map((event, i) => {
                                switch (groupBy) {
                                    case "day":
                                        return (
                                            <Grid
                                                container
                                                key={i}
                                                style={{ transition: "all 2s" }}
                                            >
                                                <Grid xs item>
                                                    {event.influencer.firstName}{" "}
                                                    {event.influencer.lastName}{" "}
                                                </Grid>
                                                <Grid xs="auto" item>
                                                    {TimelineEvent.isInviteEvent(event) &&
                                                        event.inviteEvent?.invites}
                                                </Grid>
                                            </Grid>
                                        );
                                    case "week":
                                        return (
                                            <Grid
                                                container
                                                key={i}
                                                spacing={0}
                                                style={{ transition: "all 2s" }}
                                            >
                                                <Grid xs={2} item>
                                                    {dayjs(event.date).format("ddd")}
                                                </Grid>
                                                <Grid xs item>
                                                    {event.influencer.firstName}{" "}
                                                    {event.influencer.lastName}{" "}
                                                </Grid>
                                                <Grid xs="auto" item>
                                                    {TimelineEvent.isInviteEvent(event) &&
                                                        event.inviteEvent?.invites}
                                                </Grid>
                                            </Grid>
                                        );
                                }
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TimelineView;
