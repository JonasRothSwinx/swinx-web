import { Event, Events } from "@/app/ServerFunctions/types";
import { dayjs, Dayjs } from "@/app/utils";

export type groupBy = "day" | "week";

// export type GroupedEvent = {
//     type: TimelineEvent.eventType;
//     dateGroupStart: Dayjs;
//     dateGroupEnd: Dayjs;
//     events: TimelineEvent.TimelineEvent[];
// };
// //v2
// export type EventGroup = {
//     dateGroupStart: Dayjs;
//     dateGroupEnd: Dayjs;
//     events: TypedEventGroup[];
// };

// export type TypedEventGroup = {
//     type: timelineEventTypesType;
//     events: TimelineEvent.TimelineEvent[];
// };

export type TypedEventGroup = {
    type: Events.EventType;
    events: groupableEvent[];
};

export type EventGroup = {
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TypedEventGroup[];
};
type groupableEvent = Event;

export function groupEvents(events: groupableEvent[], groupBy: groupBy = "week") {
    let eventGroups: EventGroup[] = [];
    switch (groupBy) {
        case "day":
            eventGroups = events.reduce((groups: EventGroup[], event: groupableEvent) => {
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
                                type: event.type,
                                events: [event],
                            } satisfies TypedEventGroup,
                        ],
                    } satisfies EventGroup,
                ];
            }, []);
            break;
        case "week": {
            eventGroups = events.reduce((groups: EventGroup[], event: groupableEvent) => {
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
                                type: event.type,
                                events: [event],
                            } satisfies TypedEventGroup,
                        ],
                    } satisfies EventGroup,
                ];
            }, []);
            break;
        }
    }
    //sort events in each typedEventGroup by date
    eventGroups = eventGroups
        .map((group) => {
            return {
                ...group,
                events: group.events
                    .map((typedGroup) => {
                        return {
                            ...typedGroup,
                            events: typedGroup.events.sort(
                                (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
                            ),
                        } satisfies TypedEventGroup;
                    })
                    .sort((a, b) => a.type.localeCompare(b.type)),
            } satisfies EventGroup;
        })
        .sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());
    // //sort TypedEventGroups by type, then sort eventgroups by ascending startdate
    // eventGroups = eventGroups.map((group) => {
    //     return {
    //         ...group,
    //         events: group.events.sort((a, b) => a.type.localeCompare(b.type)),
    //     } satisfies EventGroup;
    // });
    // eventGroups.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());

    return eventGroups;
}

// function sortIntoTypedGroup(group: EventGroup, event: TimelineEvent.Event) {
//     // console.log("sortIntoTypedGroup", group, event);
//     const typedGroup = group.events.find((typedGroup) => typedGroup.type === event.type);
//     if (typedGroup) {
//         typedGroup.events.push(event);
//         return group;
//     }
//     return {
//         ...group,
//         events: [
//             ...group.events,
//             {
//                 type: event.type,
//                 events: [event],
//             } satisfies TypedEventGroup,
//         ],
//     } satisfies EventGroup;
// }
function getEventType(event: groupableEvent) {
    switch (true) {
        case Events.isTimelineEvent(event):
            return event.type;
    }
}

function sortIntoTypedGroup(group: EventGroup, event: groupableEvent) {
    const typedGroup = group.events.find((typedGroup) => typedGroup.type === getEventType(event));
    if (typedGroup) {
        typedGroup.events.push(event);
        return group;
    }
    const dataOut: EventGroup = {
        ...group,
        events: [
            ...group.events,
            {
                type: event.type,
                events: [event],
            } satisfies TypedEventGroup,
        ],
    };

    return dataOut;
}
