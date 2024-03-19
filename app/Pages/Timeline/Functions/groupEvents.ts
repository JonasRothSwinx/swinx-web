import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import StaticEvent from "@/app/ServerFunctions/types/staticEvents";

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

export type TypedEventGroup_v2 = {
    type: TimelineEvent.eventType | StaticEvent.eventType;
    events: groupableEvent[];
};

export type EventGroup_v2 = {
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TypedEventGroup_v2[];
};
type groupableEvent = TimelineEvent.Event | StaticEvent.StaticEvent;

// export default function groupEvents(
//     events: TimelineEvent.TimelineEvent[],
//     groupBy: groupBy = "day",
// ) {
//     let groupedEvents: GroupedEvent[] = [];
//     switch (groupBy) {
//         case "day":
//             groupedEvents = events.reduce(
//                 (groups: GroupedEvent[], event: TimelineEvent.TimelineEvent) => {
//                     const eventDate = dayjs(event.date);
//                     const group = groups.find((group) => {
//                         return (
//                             group.type === event.type &&
//                             eventDate.isBetween(
//                                 group.dateGroupStart,
//                                 group.dateGroupEnd,
//                                 "day",
//                                 "[]",
//                             )
//                         );
//                     });
//                     if (group) {
//                         group.events.push(event);
//                         return groups;
//                     }
//                     return [
//                         ...groups,
//                         {
//                             type: event.type as timelineEventTypesType,
//                             dateGroupStart: eventDate.hour(0).minute(0),
//                             dateGroupEnd: eventDate.hour(23).minute(59),
//                             events: [event],
//                         } satisfies GroupedEvent,
//                     ];
//                 },
//                 [],
//             );
//             break;
//         case "week":
//             groupedEvents = events.reduce(
//                 (groups: GroupedEvent[], event: TimelineEvent.TimelineEvent) => {
//                     const eventDate = dayjs(event.date);
//                     const group = groups.find((group) => {
//                         return (
//                             group.type === event.type &&
//                             eventDate.isBetween(
//                                 group.dateGroupStart,
//                                 group.dateGroupEnd,
//                                 "week",
//                                 "[)",
//                             )
//                         );
//                     });
//                     if (group) {
//                         group.events.push(event);
//                         group.events.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
//                         return groups;
//                     }
//                     const eventWeek = eventDate.week();
//                     return [
//                         ...groups,
//                         {
//                             type: event.type as timelineEventTypesType,
//                             dateGroupStart: eventDate.minute(0).hour(0).week(eventWeek).day(1),
//                             dateGroupEnd: eventDate
//                                 .minute(59)
//                                 .hour(23)
//                                 .week(eventWeek + 1)
//                                 .day(1),
//                             events: [event],
//                         } satisfies GroupedEvent,
//                     ];
//                 },
//                 [],
//             );
//             break;
//     }
//     // console.log({ groupedEvents });
//     groupedEvents.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());
//     // console.log({ groupedEvents });
//     return groupedEvents;
// }

// export function groupEvents_v2(events: TimelineEvent.TimelineEvent[], groupBy: groupBy = "day") {
//     let eventGroups: EventGroup[] = [];
//     // console.log(
//     //     "events",
//     //     events.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()),
//     // );
//     // console.log("grouping by", groupBy);
//     switch (groupBy) {
//         case "day": {
//             eventGroups = events.reduce(
//                 (groups: EventGroup[], event: TimelineEvent.TimelineEvent) => {
//                     const eventDate = dayjs(event.date);
//                     const group = groups.find((group) => {
//                         return eventDate.isBetween(
//                             group.dateGroupStart,
//                             group.dateGroupEnd,
//                             "day",
//                             "[]",
//                         );
//                     });
//                     if (group) {
//                         sortIntoTypedGroup(group, event);
//                         return groups;
//                     }
//                     return [
//                         ...groups,
//                         {
//                             dateGroupStart: eventDate.hour(0).minute(0),
//                             dateGroupEnd: eventDate.hour(23).minute(59),
//                             events: [
//                                 {
//                                     type: event.type as timelineEventTypesType,
//                                     events: [event],
//                                 } satisfies TypedEventGroup,
//                             ],
//                         } satisfies EventGroup,
//                     ];
//                 },
//                 [],
//             );
//             break;
//         }
//         case "week": {
//             eventGroups = events.reduce(
//                 (groups: EventGroup[], event: TimelineEvent.TimelineEvent) => {
//                     const eventDate = dayjs(event.date);
//                     const group = groups.find((group) => {
//                         return eventDate.isBetween(
//                             group.dateGroupStart,
//                             group.dateGroupEnd,
//                             "week",
//                             "[)",
//                         );
//                     });
//                     if (group) {
//                         const newGroup = sortIntoTypedGroup(group, event);
//                         groups = groups.map((group) => {
//                             if (group.dateGroupStart.isSame(newGroup.dateGroupStart)) {
//                                 return newGroup;
//                             }
//                             return group;
//                         });
//                         return groups;
//                     }
//                     const eventWeek = eventDate.week();
//                     return [
//                         ...groups,
//                         {
//                             dateGroupStart: eventDate.minute(0).hour(0).week(eventWeek).day(1),
//                             dateGroupEnd: eventDate
//                                 .minute(59)
//                                 .hour(23)
//                                 .week(eventWeek + 1)
//                                 .day(1),
//                             events: [
//                                 {
//                                     type: event.type as timelineEventTypesType,
//                                     events: [event],
//                                 } satisfies TypedEventGroup,
//                             ],
//                         } satisfies EventGroup,
//                     ];
//                 },
//                 [],
//             );
//             break;
//         }
//     }
//     //sort TypedEventGroups by type, then sort eventgroups by ascending startdate
//     eventGroups = eventGroups.map((group) => {
//         return {
//             ...group,
//             events: group.events.sort((a, b) => a.type.localeCompare(b.type)),
//         } satisfies EventGroup;
//     });
//     eventGroups.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());

//     return eventGroups;
// }
export function groupEvents_v3(events: groupableEvent[], groupBy: groupBy = "day") {
    let eventGroups: EventGroup_v2[] = [];
    switch (groupBy) {
        case "day":
            eventGroups = events.reduce((groups: EventGroup_v2[], event: groupableEvent) => {
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
                    sortIntoTypedGroup_v2(group, event);
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
                            } satisfies TypedEventGroup_v2,
                        ],
                    } satisfies EventGroup_v2,
                ];
            }, []);
            break;
        case "week": {
            eventGroups = events.reduce((groups: EventGroup_v2[], event: groupableEvent) => {
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
                    const newGroup = sortIntoTypedGroup_v2(group, event);
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
                            } satisfies TypedEventGroup_v2,
                        ],
                    } satisfies EventGroup_v2,
                ];
            }, []);
            break;
        }
    }
    //sort TypedEventGroups by type, then sort eventgroups by ascending startdate
    eventGroups = eventGroups.map((group) => {
        return {
            ...group,
            events: group.events.sort((a, b) => a.type.localeCompare(b.type)),
        } satisfies EventGroup_v2;
    });
    eventGroups.sort((a, b) => a.dateGroupStart.unix() - b.dateGroupStart.unix());

    return eventGroups;
}

function sortIntoTypedGroup(group: EventGroup_v2, event: TimelineEvent.Event) {
    // console.log("sortIntoTypedGroup", group, event);
    const typedGroup = group.events.find((typedGroup) => typedGroup.type === event.type);
    if (typedGroup) {
        typedGroup.events.push(event);
        return group;
    }
    return {
        ...group,
        events: [
            ...group.events,
            {
                type: event.type,
                events: [event],
            } satisfies TypedEventGroup_v2,
        ],
    } satisfies EventGroup_v2;
}
function getEventType(event: groupableEvent) {
    switch (true) {
        case StaticEvent.isStaticEvent(event):
            return event.type;
        case TimelineEvent.isTimelineEvent(event):
            return event.type;
    }
}

function sortIntoTypedGroup_v2(group: EventGroup_v2, event: groupableEvent) {
    const typedGroup = group.events.find((typedGroup) => typedGroup.type === getEventType(event));
    if (typedGroup) {
        typedGroup.events.push(event);
        return group;
    }
    return {
        ...group,
        events: [
            ...group.events,
            {
                type: event.type,
                events: [event],
            } satisfies TypedEventGroup_v2,
        ],
    } satisfies EventGroup_v2;
}
