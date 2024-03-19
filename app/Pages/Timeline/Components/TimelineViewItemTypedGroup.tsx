import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import stylesExporter from "../../styles/stylesExporter";
import { TypedEventGroup_v2 as TypedEventGroup, groupBy } from "../Functions/groupEvents";
import { Event } from "./EventDisplay";
import { randomId } from "@mui/x-data-grid-generator";

interface TypedEventGroupDisplayProps {
    eventGroup: TypedEventGroup;
    groupBy: groupBy;
    highlightedEventIds: string[];
}
export default function TypedEventGroupDisplay(props: TypedEventGroupDisplayProps) {
    const { eventGroup, groupBy, highlightedEventIds } = props;
    return (
        <div className={stylesExporter.timeline.typedEventGroup}>
            <GroupTitle type={eventGroup.type} />
            <GroupContent
                events={eventGroup.events}
                groupBy={groupBy}
                highlightedEventIds={highlightedEventIds}
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
    highlightedEventIds?: string[];
}

function GroupContent(props: GroupContentProps) {
    const { events, groupBy, highlightedEventIds = [] } = props;
    return (
        <>
            {events.map((event, index) => {
                return (
                    <Event
                        key={event.id ?? randomId()}
                        event={event}
                        groupBy={groupBy}
                        highlighted={highlightedEventIds.includes(event.id ?? "")}
                    />
                );
            })}
        </>
    );
}
