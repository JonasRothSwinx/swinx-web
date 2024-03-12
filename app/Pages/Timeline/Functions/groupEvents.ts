import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";

export type groupBy = "day" | "week";

export type GroupedEvent = {
    type: timelineEventTypesType;
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TimelineEvent.TimelineEvent[];
};
//v2
export type EventGroup = {
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TypedEventGroup[];
};

export type TypedEventGroup = {
    type: timelineEventTypesType;
    events: TimelineEvent.TimelineEvent[];
};

export default function groupEvents(
    events: TimelineEvent.TimelineEvent[],
    groupBy: groupBy = "day",
) {
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
                        group.events.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
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
    // console.log({ groupedEvents });
    groupedEvents.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());
    // console.log({ groupedEvents });
    return groupedEvents;
}

export function groupEvents_v2(events: TimelineEvent.TimelineEvent[], groupBy: groupBy = "day") {
    let eventGroups: EventGroup[] = [];
    // console.log(
    //     "events",
    //     events.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()),
    // );
    // console.log("grouping by", groupBy);
    switch (groupBy) {
        case "day": {
            eventGroups = events.reduce(
                (groups: EventGroup[], event: TimelineEvent.TimelineEvent) => {
                    const eventDate = dayjs(event.date);
                    const group = groups.find((group) => {
                        return eventDate.isBetween(
                            group.dateGroupStart,
                            group.dateGroupEnd,
                            "day",
                            "[]",
                        );
                    });
                    if (group) {
                        sortIntoTypedGroup(group, event);
                        return groups;
                    }
                    return [
                        ...groups,
                        {
                            dateGroupStart: eventDate.hour(0).minute(0),
                            dateGroupEnd: eventDate.hour(23).minute(59),
                            events: [
                                {
                                    type: event.timelineEventType as timelineEventTypesType,
                                    events: [event],
                                } satisfies TypedEventGroup,
                            ],
                        } satisfies EventGroup,
                    ];
                },
                [],
            );
            break;
        }
        case "week": {
            eventGroups = events.reduce(
                (groups: EventGroup[], event: TimelineEvent.TimelineEvent) => {
                    const eventDate = dayjs(event.date);
                    const group = groups.find((group) => {
                        return eventDate.isBetween(
                            group.dateGroupStart,
                            group.dateGroupEnd,
                            "week",
                            "[)",
                        );
                    });
                    if (group) {
                        const newGroup = sortIntoTypedGroup(group, event);
                        groups = groups.map((group) => {
                            if (group.dateGroupStart.isSame(newGroup.dateGroupStart)) {
                                return newGroup;
                            }
                            return group;
                        });
                        return groups;
                    }
                    const eventWeek = eventDate.week();
                    return [
                        ...groups,
                        {
                            dateGroupStart: eventDate.minute(0).hour(0).week(eventWeek).day(1),
                            dateGroupEnd: eventDate
                                .minute(59)
                                .hour(23)
                                .week(eventWeek + 1)
                                .day(1),
                            events: [
                                {
                                    type: event.timelineEventType as timelineEventTypesType,
                                    events: [event],
                                } satisfies TypedEventGroup,
                            ],
                        } satisfies EventGroup,
                    ];
                },
                [],
            );
            break;
        }
    }
    //sort TypedEventGroups by type, then sort eventgroups by ascending startdate
    eventGroups = eventGroups.map((group) => {
        return {
            ...group,
            events: group.events.sort((a, b) => a.type.localeCompare(b.type)),
        } satisfies EventGroup;
    });
    eventGroups.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());

    return eventGroups;
}

function sortIntoTypedGroup(group: EventGroup, event: TimelineEvent.TimelineEvent) {
    // console.log("sortIntoTypedGroup", group, event);
    const typedGroup = group.events.find(
        (typedGroup) => typedGroup.type === event.timelineEventType,
    );
    if (typedGroup) {
        typedGroup.events.push(event);
        return group;
    }
    return {
        ...group,
        events: [
            ...group.events,
            {
                type: event.timelineEventType as timelineEventTypesType,
                events: [event],
            } satisfies TypedEventGroup,
        ],
    } satisfies EventGroup;
}
