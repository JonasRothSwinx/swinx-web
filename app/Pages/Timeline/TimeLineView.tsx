import { timelineEventTypesType } from "@/amplify/data/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs from "@/app/configuredDayJs";
import { CircularProgress, Unstable_Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TimeLineEventSingleDialog from "../Dialogs/TimelineEvent/SingleEvent/TimelineEventSingleDialog";
import stylesExporter from "../styles/stylesExporter";
import TimelineControls from "./Components/TimelineControls";
import TimelineViewItem from "./Components/TimelineViewItem";
import { useWhatChanged } from "@simbathesailor/use-what-changed";

import {
    groupBy,
    EventGroup as EventGroup,
    groupEvents as groupEvents,
} from "./Functions/groupEvents";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import QueryDebugDisplay from "../../Components/QueryDebugDisplay";
import database from "@/app/ServerFunctions/database/dbOperations/.database";
import CustomErrorBoundary from "@/app/Components/CustomErrorBoundary";
import TimelineEventMultiDialog from "../Dialogs/TimelineEvent/TimelineEventMultiDialog";
import { general as styles } from "../styles/stylesExporter";

const dialogStyles = stylesExporter.dialogs;
const timelineStyles = stylesExporter.timeline;

type orientation = "horizontal" | "vertical";
type controlsPosition = "before" | "after" | "none";
type openDialog = "none" | "editor";
export interface TimelineViewProps {
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    influencers: Influencer.Full[];
}

export default function TimelineView(props: TimelineViewProps) {
    const queryClient = useQueryClient();
    const {
        maxItems,
        orientation = "vertical",
        controlsPosition = "none",
        setCampaign: setParent,
        editable = false,
    } = props;

    //############################################
    //#region States
    // const [groups, setGroups] = useState<EventGroup[]>([]);
    const [groupBy, setGroupBy] = useState<groupBy>(props.groupBy ?? "week");
    const [editingEvent, setEditingEvent] = useState<TimelineEvent.Event>();
    const [controlsPositionState, setControlsPosition] =
        useState<controlsPosition>(controlsPosition);
    const [campaign, setCampaign] = useState<Campaign.Campaign>(props.campaign);
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    //#endregion States
    //############################################

    //############################################
    //#region Queries
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => {
            return props.influencers;
        },
        placeholderData: [],
    });
    const events = useQuery({
        queryKey: ["events", campaign.id],
        queryFn: async () => {
            const events = await database.timelineEvent.listByCampaign(campaign.id);
            events.map((event) => {
                queryClient.setQueryData(["event", event.id], event);
            });
            return events;
        },
    });

    const highlightedEventIds = useQuery({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData<string[]>(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });

    const groups = useQuery({
        queryKey: ["groups", campaign.id, groupBy],
        enabled: events.isSuccess,
        queryFn: () => {
            return groupEvents(events.data ?? [], groupBy);
        },
        placeholderData: [],
    });

    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => {
            return getUserGroups();
        },
        placeholderData: [],
    });
    //#endregion Queries
    //############################################

    //############################################
    //#region Effects
    // useWhatChanged([events, groupBy, campaign, controlsPosition], "events.data, groupBy, campaign, controlsPosition");
    useEffect(() => {
        console.log("Events changed, updating groups");
        queryClient.invalidateQueries({ queryKey: ["groups", campaign.id], refetchType: "all" });
        groups.refetch();
        // console.log("Events changed, updating groups");
        return () => {};
    }, [events.data, groupBy, campaign]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // console.log("Campaign changed, updating events");

        return () => {};
    }, [campaign]);

    useEffect(() => {
        setControlsPosition(controlsPosition);
        return () => {};
    }, [controlsPosition]);

    //#endregion Effects
    //############################################

    const EventHandlers = {
        onDialogClose: (hasChanged?: boolean) => {
            setOpenDialog("none");
            if (hasChanged) {
                queryClient.invalidateQueries({
                    queryKey: ["events", campaign.id],
                    refetchType: "all",
                });
                queryClient.invalidateQueries({
                    queryKey: ["groups", campaign.id],
                    refetchType: "all",
                });
                groups.refetch();
                events.refetch();
                queryClient.refetchQueries();
            }
        },
        onDataChange: () => {
            console.log("Data changed");
            queryClient.invalidateQueries({
                queryKey: ["groups", campaign.id],
                refetchType: "all",
            });
            queryClient.invalidateQueries({
                queryKey: ["events", campaign.id],
                refetchType: "all",
            });
            groups.refetch();
            events.refetch();
            queryClient.refetchQueries();
        },
        setDialog: (open: openDialog) => {
            setOpenDialog(open);
        },
    };

    const Dialogs: { [key in openDialog]: JSX.Element } = {
        none: <></>,
        editor: (
            <EditEventDialog
                {...{
                    onClose: EventHandlers.onDialogClose,
                    editingEvent,
                    campaign,
                    setCampaign,
                    influencers: influencers.data ?? [],
                }}
            />
        ),
    };

    if (events.isLoading || groups.isLoading || influencers.isLoading) {
        return <Placeholder />;
    }
    if (!events.data || !groups.data || !influencers.data) {
        return <div className={styles.centered}>Keine Daten</div>;
    }
    if (events.data.length === 0 || groups.data.length === 0)
        return <div className={styles.centered}>Keine Events</div>;
    if (events.isError || groups.isError || influencers.isError) {
        return <div className={styles.centered}>Error</div>;
    }
    // if (events.isFetching || groups.isFetching || influencers.isFetching) {
    //     return <Placeholder />;
    // }

    return (
        <>
            {/* Dialogs */}
            {Dialogs[openDialog]}
            {controlsPositionState === "before" && (
                <TimelineControls
                    {...{ groupBy, setGroupBy }}
                    setCampaign={setCampaign}
                    influencers={influencers.data ?? []}
                    campaign={campaign}
                    onDataChange={EventHandlers.onDataChange}
                />
            )}
            {userGroups.data?.includes("admin") && (
                <QueryDebugDisplay
                    data={[
                        { ...events, name: "events" },
                        { ...groups, name: "groups" },
                        { ...highlightedEventIds, name: "highlightedEventIds" },
                        // { ...influencers, name: "influencers" },
                    ]}
                />
            )}
            {/* <Grid
                container
                direction={orientation === "horizontal" ? "row" : "column"}
                // rowSpacing={1}
                rowGap={1}
                // columns={1}
                columnGap={"5px"}
                // columnSpacing={1}
                justifyContent={"space-evenly"}
                sx={{
                    "& > .MuiGrid2-root": {
                        // display: "flex",
                        // flexDirection: "column",
                        // overflowY: "auto",
                        // maxHeight: "90vh",
                        // paddingTop: "60px",
                        width: "100%",
                        // gap: "5px",
                    },
                    // display: "flex",
                    // flexDirection: "column",
                    // overflowY: "auto",
                    // maxHeight: "90vh",
                    // paddingTop: "60px",
                    width: "100%",
                    // gap: "5px",
                }}
            >
                {groups.data.slice(0, maxItems).map((group, i) => {
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
                                campaignId={campaign.id}
                            />
                        </Grid>
                    );
                })}
            </Grid> */}
            <TimelineViewContent
                {...props}
                influencers={influencers.data}
                groups={groups.data}
                setEditingEvent={setEditingEvent}
                setDialog={EventHandlers.setDialog}
            />
            {controlsPositionState === "after" && (
                <TimelineControls
                    {...{ groupBy, setGroupBy }}
                    setCampaign={setParent}
                    influencers={influencers.data}
                    campaign={campaign}
                    onDataChange={EventHandlers.onDataChange}
                />
            )}
        </>
    );
}

interface TimelineViewContentProps {
    campaign: Campaign.Campaign;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    influencers: Influencer.Full[];
    groups: EventGroup[];
    setEditingEvent: (event: TimelineEvent.Event) => void;
    setDialog: (open: openDialog) => void;
}
function TimelineViewContent(props: TimelineViewContentProps) {
    const {
        campaign,
        maxItems,
        orientation,
        groupBy = "week",
        editable = false,
        groups,
        setEditingEvent,
        setDialog,
    } = props;

    const EventHandlers = {
        editEvent: (event: TimelineEvent.Event) => {
            setEditingEvent(event);
            setDialog("editor");
        },
    };

    return (
        <Grid
            container
            direction={orientation === "horizontal" ? "row" : "column"}
            // rowSpacing={1}
            rowGap={1}
            // columns={1}
            columnGap={"5px"}
            // columnSpacing={1}
            justifyContent={"space-evenly"}
            sx={{
                "& > .MuiGrid2-root": {
                    // display: "flex",
                    // flexDirection: "column",
                    // overflowY: "auto",
                    // maxHeight: "90vh",
                    // paddingTop: "60px",
                    width: "100%",
                    // gap: "5px",
                },
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
                            editEvent={EventHandlers.editEvent}
                            editable={editable}
                            campaignId={campaign.id}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}
function Placeholder(): JSX.Element {
    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 999,
                textAlign: "center",
            }}
        >
            <CircularProgress />
            Loading...
        </div>
    );
}

interface EditDialogProps {
    onClose: (hasChanged?: boolean) => void;
    editingEvent: TimelineEvent.Event | undefined;
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
    influencers: Influencer.Full[];
    editable?: boolean;
}

function EditEventDialog(props: EditDialogProps): JSX.Element {
    const { editingEvent, editable = false } = props;
    if (!(editable && editingEvent)) return <></>;
    if (TimelineEvent.isSingleEvent(editingEvent)) {
        return <EditSingleEventDialog {...props} editingEvent={editingEvent} />;
    } else if (TimelineEvent.isMultiEvent(editingEvent)) {
        return <EditMultiEventDialog {...props} editingEvent={editingEvent} />;
    } else {
        throw new Error("Editing event type not recognized");
    }
}

interface EditSingleDialogProps extends EditDialogProps {
    editingEvent: TimelineEvent.SingleEvent;
}
function EditSingleEventDialog(props: EditSingleDialogProps): JSX.Element {
    const { campaign, setCampaign, onClose, influencers, editingEvent } = props;
    const targetAssignment = editingEvent.assignment ?? undefined;
    if (!targetAssignment) throw new Error("Editing event does not have an assignment");
    return (
        <TimeLineEventSingleDialog
            parent={campaign}
            setParent={setCampaign}
            isOpen={true}
            onClose={onClose}
            editing={true}
            editingData={editingEvent}
            influencers={influencers}
            targetAssignment={targetAssignment}
        />
    );
}

interface EditMultiDialogProps extends EditDialogProps {
    editingEvent: TimelineEvent.MultiEvent;
}
function EditMultiEventDialog(props: EditMultiDialogProps): JSX.Element {
    return <TimelineEventMultiDialog {...props} />;
}
