import { Campaign, Event, Influencer, Influencers } from "@/app/ServerFunctions/types";
import { Box, CircularProgress, Grid2 as Grid, SxProps, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import TimelineControls from "./Components/TimelineControls";
import TimelineViewItem from "./Components/TimelineViewItem";

import database from "@/app/ServerFunctions/database/dbOperations";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { general as styles } from "../styles/stylesExporter";
import { EventGroup, groupBy, groupEvents } from "./Functions/groupEvents";
import { TimelineEventDialog, QueryDebugDisplay } from "@/app/Components";

const dialogStyles = stylesExporter.dialogs;
const timelineStyles = stylesExporter.timeline;

type orientation = "horizontal" | "vertical";
type controlsPosition = "before" | "after" | "none";
type openDialog = "none" | "editor";
export interface TimelineViewProps {
    campaign: Campaign;
    setCampaign: (data: Campaign) => void;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    influencers: Influencers.Full[];
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
    const [editingEvent, setEditingEvent] = useState<Event>();
    const [controlsPositionState, setControlsPosition] =
        useState<controlsPosition>(controlsPosition);
    const [campaign, setCampaign] = useState<Campaign>(props.campaign);
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    //#endregion States
    //############################################

    //############################################
    //#region Queries
    const influencers = useQuery({
        queryKey: ["influencers", props.influencers],
        queryFn: () => {
            return props.influencers;
        },
        placeholderData: [],
    });
    const events = useQuery({
        queryKey: [campaign.id, "events"],
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
        queryKey: ["groups", events.data, campaign.id, groupBy],
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
        // console.log("Events changed, updating groups");
        // queryClient.invalidateQueries({ queryKey: ["groups", campaign.id] });
        // groups.refetch();
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

    const Dialogs: { [key in openDialog]: () => JSX.Element } = {
        none: () => <></>,
        editor: () => (
            <TimelineEventDialog
                onClose={EventHandlers.onDialogClose}
                editing={true}
                editingData={editingEvent}
                campaignId={campaign.id}
                targetAssignment={editingEvent?.assignments[0] ?? undefined}
            />
        ),
    };

    const styles: SxProps = useMemo(() => {
        return {
            "&": {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",

                "#StatusState": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                    width: "100%",
                },
                "#TimelineViewContent": {
                    width: "100%",
                    "& > .MuiGrid2-root": {
                        // display: "flex",
                        // flexDirection: "column",
                        // overflowY: "auto",
                        // maxHeight: "90vh",
                        // paddingTop: "60px",
                        width: "100%",
                        // gap: "5px",
                    },
                },
            },
        };
    }, []);

    if (events.isLoading || groups.isLoading || influencers.isLoading) {
        return <Placeholder />;
    }
    if (!events.data || !groups.data || !influencers.data) {
        return (
            <Box>
                <Typography id="StatusState">Keine Daten</Typography>
            </Box>
        );
    }
    if (events.data.length === 0 || groups.data.length === 0)
        return (
            <Box sx={styles}>
                {controlsPositionState === "before" && (
                    <TimelineControls
                        {...{ groupBy, setGroupBy }}
                        setCampaign={setCampaign}
                        influencers={influencers.data ?? []}
                        campaign={campaign}
                        onDataChange={EventHandlers.onDataChange}
                    />
                )}
                <div id="StatusState">Keine Events</div>;
                {controlsPositionState === "after" && (
                    <TimelineControls
                        {...{ groupBy, setGroupBy }}
                        setCampaign={setParent}
                        influencers={influencers.data}
                        campaign={campaign}
                        onDataChange={EventHandlers.onDataChange}
                    />
                )}
            </Box>
        );
    if (events.isError || groups.isError || influencers.isError) {
        return (
            <Box sx={styles}>
                <Typography id="StatusState">Error</Typography>
            </Box>
        );
    }
    // if (events.isFetching || groups.isFetching || influencers.isFetching) {
    //     return <Placeholder />;
    // }

    return (
        <Box
            sx={styles}
            id="TimelineViewContainer"
        >
            {/* Dialogs */}
            {Dialogs[openDialog]()}
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
        </Box>
    );
}

interface TimelineViewContentProps {
    campaign: Campaign;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    influencers: Influencers.Full[];
    groups: EventGroup[];
    setEditingEvent: (event: Event) => void;
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
        editEvent: (event: Event) => {
            setEditingEvent(event);
            setDialog("editor");
        },
    };

    return (
        <Grid
            id="TimelineViewContent"
            container
            direction={orientation === "horizontal" ? "row" : "column"}
            // rowSpacing={1}
            rowGap={1}
            // columns={1}
            columnGap={"5px"}
            // columnSpacing={1}
            justifyContent={"space-evenly"}
        >
            {groups.slice(0, maxItems).map((group, i) => {
                return (
                    // <Grid key={i} xs={orientation === "horizontal" ? 5 : 16}>
                    // </Grid>
                    <TimelineViewItem
                        key={i}
                        keyValue={i}
                        group={group}
                        groupedBy={groupBy}
                        editEvent={EventHandlers.editEvent}
                        editable={editable}
                        campaignId={campaign.id}
                    />
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
