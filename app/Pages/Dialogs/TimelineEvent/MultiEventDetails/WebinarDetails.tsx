import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogContent, TextField } from "@mui/material";

interface WebinarDetailsProps {
    onChange: (data: Partial<TimelineEvent.Webinar>) => void;
    data: Partial<TimelineEvent.Webinar>;
}

export default function WebinarDetails(props: WebinarDetailsProps): JSX.Element {
    const { onChange, data } = props;

    const EventHandlers = {};

    return (
        <DialogContent>
            <TextField
                label="Webinartitel"
                fullWidth
                value={data.eventTitle ?? ""}
                onChange={(e) => onChange({ eventTitle: e.target.value })}
            />
            <TextField
                label="Anzahl Speaker"
                type="number"
                fullWidth
                value={data.eventAssignmentAmount ?? 1}
                onChange={(e) => onChange({ eventAssignmentAmount: Number(e.target.value) })}
            />
        </DialogContent>
    );
}
