import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { randomDate, randomId } from "@mui/x-data-grid-generator";
import { timelineEventTypesType } from "@/amplify/data/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Grid, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import stylesExporter from "../styles/stylesExporter";
import TimeLineEventDialog, { TimelineEventDialogProps } from "../Dialogs/TimelineEventDialog";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import TimelineEventDialog from "../Dialogs/TimelineEventDialog";

const dialogStyles = stylesExporter.dialogs;
const timelineStyles = stylesExporter.timeline;

type GroupedEvent = {
    type: timelineEventTypesType;
    dateGroupStart: Dayjs;
    dateGroupEnd: Dayjs;
    events: TimelineEvent.TimelineEvent[];
};

export type groupBy = "day" | "week";
type orientation = "horizontal" | "vertical";
type controlsPosition = "before" | "after" | "none";
export interface TimelineViewProps {
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    highlightedEvent?: TimelineEvent.TimelineEvent;
    influencers: Influencer.InfluencerFull[];
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
    const {
        maxItems,
        orientation = "vertical",
        controlsPosition = "none",
        setCampaign: setParent,
    } = props;
    const [influencers, setInfluencers] = useState(props.influencers);

    const [campaign, setCampaign] = useState<Campaign.Campaign>(props.campaign);
    const [events, setEvents] = useState(campaign?.campaignTimelineEvents ?? []);
    const [groups, setGroups] = useState<GroupedEvent[]>([]);
    const [editingDialogOpen, setEditingDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent.TimelineEvent>();
    const [controlsPositionState, setControlsPosition] =
        useState<controlsPosition>(controlsPosition);
    const [groupBy, setGroupBy] = useState<groupBy>(props.groupBy ?? "week");
    const [editable, setEditable] = useState(props.editable ?? false);
    const [highlightedEvent, setHighlightedEvent] = useState(props.highlightedEvent);

    useEffect(() => {
        // console.log("Events changed, updating groups");
        const newGroups = groupEvents(events, groupBy);
        // console.log("new groups:", newGroups);
        setGroups([...newGroups]);
        return () => {};
    }, [events, groupBy]);

    useEffect(() => {
        // console.log("Campaign changed, updating events");

        setEvents(campaign?.campaignTimelineEvents ?? []);

        return () => {};
    }, [campaign]);

    // useEffect(() => {
    //     console.log("prop campaign changed, updating campaign", props.campaign);

    //     setCampaign(props.campaign);

    //     return () => {};
    // }, [props.campaign]);

    useEffect(() => {
        setControlsPosition(controlsPosition);
        return () => {};
    }, [controlsPosition]);

    useEffect(() => {
        // console.log({ props });
        setGroupBy(props.groupBy ?? "week");
        setEditable(props.editable ?? false);
        setHighlightedEvent(props.highlightedEvent);
        setInfluencers(props.influencers);
        setCampaign(props.campaign);

        return () => {};
    }, [props]);

    function onDialogClose(hasChanged?: boolean) {
        // console.log("Hi");
        setEditingDialogOpen(false);
        // setGroups(groupEvents(events, groupBy));
    }
    return (
        <>
            {/* Dialogs */}
            <>
                {editable && (
                    <TimeLineEventDialog
                        parent={campaign}
                        setParent={setParent}
                        isOpen={editingDialogOpen}
                        onClose={onDialogClose}
                        editing={true}
                        editingData={editingEvent}
                        influencers={influencers}
                    />
                )}
            </>

            {controlsPositionState === "before" && (
                <TimelineControls
                    {...{ groupBy, setGroupBy }}
                    setCampaign={setCampaign}
                    influencers={influencers}
                    campaign={campaign}
                />
            )}
            <Grid
                container
                direction={orientation === "horizontal" ? "row" : "column"}
                // rowSpacing={1}
                rowGap={1}
                // columns={1}
                columnGap={"5px"}
                // columnSpacing={1}
                justifyContent={"space-evenly"}
                style={{
                    // display: "flex",
                    // flexDirection: "column",
                    // overflowY: "auto",
                    // maxHeight: "90vh",
                    // paddingTop: "60px",
                    width: "100%",
                    // gap: "5px",
                }}
            >
                {groups.slice(0, maxItems).map((group, i) => {
                    return (
                        <Grid key={i} xs={orientation === "horizontal" ? 5 : 16}>
                            <TimelineViewItem
                                key={i}
                                keyValue={i}
                                group={group}
                                groupedBy={groupBy}
                                setEditingEvent={setEditingEvent}
                                openDialog={() => setEditingDialogOpen(true)}
                                editable={editable}
                                highlightedEvent={highlightedEvent}
                            />
                        </Grid>
                    );
                })}
            </Grid>
            {controlsPositionState === "after" && (
                <TimelineControls
                    {...{ groupBy, setGroupBy }}
                    setCampaign={setParent}
                    influencers={influencers}
                    campaign={campaign}
                />
            )}
        </>
    );
}

export default TimelineView;
interface TimelineViewItemProps {
    keyValue: string | number;
    group: GroupedEvent;
    groupedBy: groupBy;
    editable: boolean;
    highlightedEvent?: TimelineEvent.TimelineEvent;
    setEditingEvent: (e: TimelineEvent.TimelineEvent) => void;
    openDialog: () => void;
}
function TimelineViewItem(props: TimelineViewItemProps) {
    const { keyValue, group, groupedBy, setEditingEvent, openDialog, highlightedEvent } = props;
    const [editing, setEditing] = useState(false);
    const [editable, setEditable] = useState(props.editable);
    return (
        <Grid
            item
            // xs={16}
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
                <div className={dialogStyles.cellActionSplit}>
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
                    {editable && (
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
                    )}
                </div>
            </div>
            <div
                style={{
                    padding: "5px",
                }}
            >
                {group.events.map((event, i) => {
                    // console.log(event.date, event.influencer.lastName);
                    return (
                        <Grid
                            container
                            key={i}
                            spacing={0}
                            className={
                                event.id === highlightedEvent?.id ? timelineStyles.highlighted : ""
                            } /* style={{ transition: "all 2s" }} */
                        >
                            {groupedBy === "day" && (
                                <>
                                    <TimelineViewItemName event={event} />
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
                                    <TimelineViewItemName event={event} />
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
                                            // debugger;
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

interface TimelineViewItemNameProps {
    event: TimelineEvent.TimelineEvent;
}
function TimelineViewItemName(props: TimelineViewItemNameProps) {
    const { event } = props;
    return (
        <Grid xs item>
            {event.assignment.isPlaceholder
                ? `Influencer ${event.assignment.placeholderName}`
                : `${event.assignment.influencer?.firstName} ${event.assignment.influencer?.lastName}`}
            {/* {event.assignment.influencer?.firstName} {event.assignment.influencer?.lastName} */}
        </Grid>
    );
}

interface TimelineControlsProps {
    campaign: Campaign.Campaign;
    setCampaign: (campaign: Campaign.Campaign) => void;
    groupBy: groupBy;
    setGroupBy: Dispatch<SetStateAction<groupBy>>;
    influencers: Influencer.InfluencerFull[];
}
type openDialog = "None" | "Timeline";
function TimelineControls(props: TimelineControlsProps) {
    const { groupBy, setGroupBy, campaign, influencers, setCampaign: setRows } = props;
    const [openDialog, setOpenDialog] = useState<openDialog>("None");
    const DialogOptions: DialogOptions = {
        campaignId: campaign.id,
    };
    const DialogConfig: DialogConfig<Campaign.Campaign> = {
        onClose: onDialogClose,
        parent: campaign,
        setParent: setRows,
    };

    const ClickHandlers = {
        addTimeline: () => () => {
            setOpenDialog("Timeline");
        },
    };
    function onDialogClose(hasChanged?: boolean) {
        setOpenDialog("None");
    }
    return (
        <>
            {/* Dialogs */}
            <>
                {/* <TimelineEventDialog
                    {...DialogOptions}
                    {...DialogConfig}
                    influencers={influencers}
                    isOpen={openDialog === "Timeline"}
                /> */}
            </>
            <div
                style={{
                    // position: "fixed",
                    // top: "40px",
                    // right: "20px",
                    marginBlock: "10px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                    height: "60px",
                    alignContent: "stretch",
                    padding: "5px",
                    background: "white",
                    zIndex: 999,
                }}
            >
                <TextField
                    select
                    label={"Gruppieren nach"}
                    SelectProps={{
                        sx: { minWidth: "15ch" },
                        onChange: (e) => {
                            setGroupBy(e.target.value as groupBy);
                        },
                        value: groupBy,
                    }}
                >
                    <MenuItem value={"day"}>Tag</MenuItem>
                    <MenuItem value={"week"}>Woche</MenuItem>
                </TextField>
                {/* <Button
                    style={{ height: "100%" }}
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.addTimeline()}
                >
                    <AddIcon />
                    <Typography variant="body1">Ereignis</Typography>
                </Button> */}
            </div>
        </>
    );
}
