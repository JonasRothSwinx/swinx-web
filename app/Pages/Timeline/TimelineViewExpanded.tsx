import { TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import { Dialog } from "@mui/material";
import TimelineView from "./TimeLineView";
import { TimelineEventDialogProps } from "../Dialogs/TimelineEventDialog";

interface TimelineViewExpandedProps {
    isOpen: boolean;
    events: TimelineEvent.TimelineEvent[];
    dialogProps: TimelineEventDialogProps;
    onClose: () => void;
}
function TimelineViewExpanded(props: TimelineViewExpandedProps) {
    const { isOpen, events, dialogProps } = props;
    return (
        <Dialog open={isOpen}>
            <TimelineView eventDialogProps={dialogProps} events={events} groupBy="week" />
        </Dialog>
    );
}
export default TimelineViewExpanded;
