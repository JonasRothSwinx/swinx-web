import { Campaign, Event, Influencer, Influencers } from "@/app/ServerFunctions/types";
import { Box, CircularProgress, Grid2 as Grid, SxProps, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import TimelineControls from "./Components/TimelineControls";
import TimelineViewItem from "./Components/TimelineViewItem";

import { dataClient } from "@dataClient";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventGroup, groupBy, groupEvents } from "./Functions/groupEvents";
import { TimelineEventDialog, QueryDebugDisplay } from "@/app/Components";
import { queryKeys } from "../queryClient/keys";

type orientation = "horizontal" | "vertical";
type controlsPosition = "before" | "after" | "none";
type openDialog = "none" | "editor";
export interface TimelineViewProps {
    campaignId: string;
    // setCampaign: (data: Campaign) => void;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    // influencers: Influencers.Full[];
}

export default function TimelineView({
    // maxItems,
    // setCampaign: setParent,
    // editable = false,
    campaignId,
    orientation = "vertical",
    controlsPosition = "none",
    groupBy: groupByInit = "week",
}: TimelineViewProps) {
    const queryClient = useQueryClient();

    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });

    //############################################
    //#region States
    // const [groups, setGroups] = useState<EventGroup[]>([]);
    const [groupBy, setGroupBy] = useState<groupBy>(groupByInit);
    const [editingEvent, setEditingEvent] = useState<Event>();
    const [controlsPositionState, setControlsPosition] =
        useState<controlsPosition>(controlsPosition);
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    //#endregion States
    //############################################

    //############################################
    //#region Queries

    const events = useQueries({
        queries:
            campaign.data?.events.map((event) => ({
                queryKey: queryKeys.event.one(event.id),
                queryFn: () => dataClient.event.get(event.id),
            })) ?? [],
    });

    const highlightedEventIds = useQuery({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData<string[]>(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });

    const groups = useMemo(() => {
        const eventsData = events.map((event) => event.data).filter((data) => data !== undefined);
        return groupEvents(eventsData, groupBy);
    }, [events, groupBy]);

    const userGroups = useQuery({
        queryKey: queryKeys.currentUser.userGroups(),
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
        setControlsPosition(controlsPosition);
        return () => {};
    }, [controlsPosition]);

    //#endregion Effects
    //############################################

    const EventHandlers = {
        onDialogClose: (hasChanged?: boolean) => {
            setOpenDialog("none");
            if (hasChanged) {
                campaign.data?.events.forEach((event) => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.event.one(event.id) });
                });
            }
        },
        onDataChange: () => {
            console.log("Data changed");
            campaign.data?.events.forEach((event) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.event.one(event.id) });
            });
        },
        setDialog: (open: openDialog) => {
            setOpenDialog(open);
        },
    };

    const Dialogs: { [key in openDialog]: () => React.JSX.Element } = {
        none: () => <></>,
        editor: () => (
            <TimelineEventDialog
                onClose={EventHandlers.onDialogClose}
                editing={true}
                editingData={editingEvent}
                campaignId={campaignId}
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

    if (events.some((event) => event.isLoading)) {
        return <Placeholder />;
    }

    if (events.length === 0 || groups.length === 0)
        return (
            <Box sx={styles}>
                {controlsPositionState === "before" && (
                    <TimelineControls
                        {...{ groupBy, setGroupBy }}
                        campaignId={campaignId}
                        onDataChange={EventHandlers.onDataChange}
                    />
                )}
                <div id="StatusState">Keine Events</div>;
                {controlsPositionState === "after" && (
                    <TimelineControls
                        {...{ groupBy, setGroupBy }}
                        campaignId={campaignId}
                        onDataChange={EventHandlers.onDataChange}
                    />
                )}
            </Box>
        );
    if (events.some((event) => event.isError)) {
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
                    campaignId={campaignId}
                    onDataChange={EventHandlers.onDataChange}
                />
            )}
            <TimelineViewContent
                campaignId={campaignId}
                groups={groups}
                setEditingEvent={setEditingEvent}
                setDialog={EventHandlers.setDialog}
            />
            {controlsPositionState === "after" && (
                <TimelineControls
                    {...{ groupBy, setGroupBy }}
                    campaignId={campaignId}
                    onDataChange={EventHandlers.onDataChange}
                />
            )}
        </Box>
    );
}

interface TimelineViewContentProps {
    campaignId: string;
    maxItems?: number;
    // eventDialogProps: TimelineEventDialogProps;
    orientation?: orientation;
    controlsPosition?: controlsPosition;
    groupBy?: groupBy;
    editable?: boolean;
    groups: EventGroup[];
    setEditingEvent: (event: Event) => void;
    setDialog: (open: openDialog) => void;
}

function TimelineViewContent({
    campaignId,
    maxItems,
    orientation,
    groupBy = "week",
    editable = false,
    groups,
    setEditingEvent,
    setDialog,
}: TimelineViewContentProps) {
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
                        campaignId={campaignId}
                    />
                );
            })}
        </Grid>
    );
}
function Placeholder(): React.JSX.Element {
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
