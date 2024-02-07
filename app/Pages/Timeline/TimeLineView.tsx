import { Campaign, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { randomDate, randomId } from "@mui/x-data-grid-generator";
import { timelineEventTypesType } from "@/amplify/data/types";
import { useEffect, useState } from "react";
import { Button, Grid, IconButton } from "@mui/material";
import {
    Edit as EditIcon,
    Cancel as CancelIcon,
    DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import stylesExporter from "../styles/stylesExporter";
import TimeLineEventDialog, { TimelineEventDialogProps } from "../Dialogs/TimelineEventDialog";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";

const styles = stylesExporter.dialogs;

type GroupedEvent = {
    type: timelineEventTypesType;
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TimelineEvent.TimelineEvent[];
};

export type groupBy = "day" | "week";

export interface TimelineViewProps {
    events: TimelineEvent.TimelineEvent[];
    groupBy: groupBy;
    maxItems?: number;
    eventDialogProps: TimelineEventDialogProps;
}
function groupEvents(events: TimelineEvent.TimelineEvent[], groupBy: groupBy = "day") {
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
function TimelineView(props: TimelineViewProps) {
    const { events, groupBy = "week", maxItems = -1 } = props;
    const dialogConfig: DialogConfig<Campaign.Campaign> = {
        ...props.eventDialogProps,
    };
    const dialogOptions: DialogOptions = props.eventDialogProps;
    const { influencers } = props.eventDialogProps;

    const [groups, setGroups] = useState<GroupedEvent[]>([]);
    const [editingDialogOpen, setEditingDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent.TimelineEvent>();

    useEffect(() => {
        setGroups(groupEvents(events, groupBy));
        return () => {};
    }, [events, groupBy]);

    function onDialogClose(hasChanged?: boolean) {
        console.log("Hi");
        setEditingDialogOpen(false);
    }
    return (
        <>
            <TimeLineEventDialog
                {...dialogConfig}
                {...dialogOptions}
                isOpen={editingDialogOpen}
                onClose={onDialogClose}
                editing={true}
                editingData={editingEvent}
                influencers={influencers}
            />
            <Grid
                container
                direction="row"
                // rowSpacing={1}
                // rowGap={1}
                // columnGap={1}
                // columnSpacing={1}
                justifyContent={"space-evenly"}
                style={{
                    // display: "flex",
                    // flexDirection: "column",

                    width: "100%",
                    // gap: "5px",
                }}
            >
                {groups.slice(0, maxItems).map((group, i) => {
                    return (
                        <TimelineViewItem
                            key={i}
                            keyValue={i}
                            group={group}
                            groupedBy={groupBy}
                            setEditingEvent={setEditingEvent}
                            openDialog={() => setEditingDialogOpen(true)}
                        />
                    );
                })}
            </Grid>
        </>
    );
}

export default TimelineView;
interface TimelineViewItemProps {
    keyValue: string | number;
    group: GroupedEvent;
    groupedBy: groupBy;
    setEditingEvent: (e: TimelineEvent.TimelineEvent) => void;
    openDialog: () => void;
}
function TimelineViewItem(props: TimelineViewItemProps) {
    const { keyValue, group, groupedBy, setEditingEvent, openDialog } = props;
    const [editing, setEditing] = useState(false);
    return (
        <Grid
            item
            xs={5}
            key={keyValue}
            style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid black",
                borderRadius: "10px",
                // padding: "5px",
                height: "fit-content",
            }}
            sx={
                editing
                    ? {
                          "& .MuiGrid-container:hover": {
                              border: "1px solid black",
                              borderRadius: "5px",
                              // color: "gray",
                              backgroundColor: "lightgray",
                          },
                          "& .MuiGrid-container": {
                              alignItems: "center",
                          },
                      }
                    : {
                          "& .MuiGrid-container": {
                              alignItems: "center",
                          },
                      }
            }
        >
            <div
                style={{
                    display: "flex",
                    padding: "5px",
                    paddingBlockEnd: "10px",
                    borderBottom: "1px solid black",
                }}
            >
                <div className={styles.cellActionSplit}>
                    <div>
                        {group.type}
                        <br />{" "}
                        {(() => {
                            switch (groupedBy) {
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
                                            {dayjs(group.dateGroupStart).day(7).format("DD.MM")})
                                        </>
                                    );
                            }
                        })()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {!editing && (
                            <IconButton
                                onClick={() => {
                                    setEditing(true);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                        {editing && (
                            <>
                                <IconButton onClick={() => {}}>
                                    <DeleteForeverIcon color="error" />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        setEditing(false);
                                    }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div
                style={{
                    padding: "5px",
                }}
            >
                {group.events.map((event, i) => {
                    return (
                        <Grid container key={i} spacing={0} /* style={{ transition: "all 2s" }} */>
                            {groupedBy === "day" && (
                                <>
                                    <Grid xs item>
                                        {event.influencer.firstName} {event.influencer.lastName}{" "}
                                    </Grid>
                                    <Grid xs="auto" item>
                                        {TimelineEvent.isInviteEvent(event) &&
                                            event.inviteEvent?.invites}
                                    </Grid>
                                </>
                            )}
                            {groupedBy === "week" && (
                                <>
                                    <Grid xs={2} item>
                                        {dayjs(event.date).format("ddd")}
                                    </Grid>
                                    <Grid xs item>
                                        {event.influencer.firstName} {event.influencer.lastName}{" "}
                                    </Grid>
                                    <Grid xs="auto" item>
                                        {TimelineEvent.isInviteEvent(event) &&
                                            event.inviteEvent?.invites}
                                    </Grid>
                                </>
                            )}
                            {editing && (
                                <Grid>
                                    <IconButton
                                        size={"small"}
                                        onClick={() => {
                                            setEditingEvent(event);
                                            openDialog();
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Grid>
                            )}
                        </Grid>
                    );
                })}
            </div>
        </Grid>
    );
}
