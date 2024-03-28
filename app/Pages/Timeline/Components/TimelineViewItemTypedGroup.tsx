import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import stylesExporter from "../../styles/stylesExporter";
import { TypedEventGroup as TypedEventGroup, groupBy } from "../Functions/groupEvents";
import { Event } from "./EventDisplay";
import { randomId } from "@mui/x-data-grid-generator";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { highlightData } from "@/app/Definitions/types";

interface TypedEventGroupDisplayProps {
    eventGroup: TypedEventGroup;
    groupBy: groupBy;
    editing: boolean;
    campaignId: string;
}
export default function TypedEventGroupDisplay(props: TypedEventGroupDisplayProps) {
    const { eventGroup, groupBy, editing, campaignId } = props;
    const queryClient = useQueryClient();
    const highlightedEventIds = useQuery({
        queryKey: ["highlightedEvents"],
        queryFn: async () => {
            return queryClient.getQueryData<highlightData[]>(["highlightedEvents"]) ?? [];
        },
        placeholderData: [],
    });
    if (eventGroup.type === "WebinarSpeaker") return <></>;
    return (
        <div className={stylesExporter.timeline.typedEventGroup}>
            <GroupTitle type={eventGroup.type} />
            <GroupContent
                events={eventGroup.events}
                groupBy={groupBy}
                highlightedEventData={highlightedEventIds.data ?? []}
                editing={editing}
                campaignId={campaignId}
            />
        </div>
    );
}

interface GroupTitleProps {
    type: string;
}
function GroupTitle(props: GroupTitleProps) {
    return (
        <>
            <div className={stylesExporter.timeline.groupTitle}>{props.type}</div>
        </>
    );
}

interface GroupContentProps {
    events: TimelineEvent.Event[];
    groupBy: groupBy;
    highlightedEventData: highlightData[];
    editing: boolean;
    campaignId: string;
}

function GroupContent(props: GroupContentProps) {
    const { events, groupBy, highlightedEventData, editing, campaignId } = props;
    return (
        <>
            {events.map((event, index) => {
                return (
                    <Event
                        key={event.id ?? randomId()}
                        event={event}
                        groupBy={groupBy}
                        highlightData={highlightedEventData.find((x) => x.id === event.id)}
                        editing={editing}
                        campaignId={campaignId}
                    />
                );
            })}
        </>
    );
}
