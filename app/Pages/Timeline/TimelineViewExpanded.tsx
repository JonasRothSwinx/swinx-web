import { Dialog } from "@mui/material";

interface TimelineViewExpandedProps {
    isOpen: boolean;
    onClose: () => any;
}
function TimelineViewExpanded(props: TimelineViewExpandedProps) {
    const { isOpen } = props;
    return <Dialog open={isOpen}></Dialog>;
}
export default TimelineViewExpanded;
