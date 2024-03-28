import { timelineEventTypesType } from "@/amplify/data/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs from "@/app/configuredDayJs";
import { CircularProgress, Unstable_Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TimeLineEventSingleDialog from "../Dialogs/TimelineEvent/TimelineEventSingleDialog";
import stylesExporter from "../styles/stylesExporter";
import TimelineControls from "./Components/TimelineControls";
import TimelineViewItem from "./Components/TimelineViewItem";
import { useWhatChanged } from "@simbathesailor/use-what-changed";

import { groupBy, EventGroup as EventGroup, groupEvents as groupEvents } from "./Functions/groupEvents";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import QueryDebugDisplay from "../../Components/QueryDebugDisplay";
import dbInterface from "@/app/ServerFunctions/database/.dbInterface";

const dialogStyles = stylesExporter.dialogs;
const timelineStyles = stylesExporter.timeline;

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
    influencers: Influencer.InfluencerFull[];
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
    const [groupBy, setGroupBy] = useState<groupBy>(props.groupBy ?? "week");
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => {
            return props.influencers;
        },
        placeholderData: [],
    });
    const [campaign, setCampaign] = useState<Campaign.Campaign>(props.campaign);
    const events = useQuery({
        queryKey: ["events", campaign.id],
        queryFn: async () => {
            const events = await dbInterface.timelineEvent.listByCampaign(campaign.id);
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
    // const [groups, setGroups] = useState<EventGroup[]>([]);
    const [editingDialogOpen, setEditingDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent.Event>();
    const [controlsPositionState, setControlsPosition] = useState<controlsPosition>(controlsPosition);
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => {
            return getUserGroups();
        },
        placeholderData: [],
    });

    // useWhatChanged([events, groupBy, campaign, controlsPosition], "events.data, groupBy, campaign, controlsPosition");
    useEffect(() => {
        console.log("Events changed, updating groups");
        queryClient.invalidateQueries({ queryKey: ["groups", campaign.id], refetchType: "all" });
        groups.refetch();
        // console.log("Events changed, updating groups");
        return () => {};
    }, [events.data, groupBy, campaign]);

    useEffect(() => {
        // console.log("Campaign changed, updating events");

        return () => {};
    }, [campaign]);

    useEffect(() => {
        setControlsPosition(controlsPosition);
        return () => {};
    }, [controlsPosition]);

    function onDialogClose(hasChanged?: boolean) {
        // console.log("Hi");
        setEditingDialogOpen(false);
        // setGroups(groupEvents(events, groupBy));
    }
    const EventHandlers = {
        onDialogClose: (hasChanged?: boolean) => {
            setEditingDialogOpen(false);
        },
        onDataChange: () => {
            console.log("Data changed");
            queryClient.invalidateQueries({ queryKey: ["groups", campaign.id], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["events", campaign.id], refetchType: "all" });
            groups.refetch();
            events.refetch();
            queryClient.refetchQueries();
        },
    };

    if (events.isLoading || groups.isLoading || influencers.isLoading) {
        return <Placeholder />;
    }
    if (!events.data || !groups.data || !influencers.data) {
        return <div>Keine Daten</div>;
    }
    if (events.isError || groups.isError || influencers.isError) {
        return <div>Error</div>;
    }
    // if (events.isFetching || groups.isFetching || influencers.isFetching) {
    //     return <Placeholder />;
    // }

    return (
        <>
            {/* Dialogs */}
            {/* <>
                {editable && (
                    <TimeLineEventDialog
                        parent={campaign}
                        setParent={setParent}
                        isOpen={editingDialogOpen}
                        onClose={onDialogClose}
                        editing={true}
                        editingData={editingEvent}
                        influencers={influencers.data ?? []}
                    />
                )}
            </> */}

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
            </Grid>
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
