import { timelineEventTypesType } from "@/amplify/data/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs from "@/app/configuredDayJs";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TimeLineEventDialog from "../Dialogs/TimelineEventDialog";
import stylesExporter from "../styles/stylesExporter";
import TimelineControls from "./Components/TimelineControls";
import TimelineViewItem from "./Components/TimelineViewItem";

import groupEvents, {
    EventGroup,
    GroupedEvent,
    groupBy,
    groupEvents_v2,
} from "./Functions/groupEvents";

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
    highlightedEvent?: TimelineEvent.TimelineEvent;
    influencers: Influencer.InfluencerFull[];
}

export default function TimelineView(props: TimelineViewProps) {
    const {
        maxItems,
        orientation = "vertical",
        controlsPosition = "none",
        setCampaign: setParent,
    } = props;
    const [influencers, setInfluencers] = useState(props.influencers);

    const [campaign, setCampaign] = useState<Campaign.Campaign>(props.campaign);
    const [events, setEvents] = useState(campaign?.campaignTimelineEvents ?? []);
    const [groups, setGroups] = useState<EventGroup[]>([]);
    const [editingDialogOpen, setEditingDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent.TimelineEvent>();
    const [controlsPositionState, setControlsPosition] =
        useState<controlsPosition>(controlsPosition);
    const [groupBy, setGroupBy] = useState<groupBy>(props.groupBy ?? "week");
    const [editable, setEditable] = useState(props.editable ?? false);
    const [highlightedEvent, setHighlightedEvent] = useState(props.highlightedEvent);

    useEffect(() => {
        // console.log("Events changed, updating groups");
        const newGroups = groupEvents_v2(events, groupBy);
        console.log("new groups:", newGroups);
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
