import StaticEvent from "@/app/ServerFunctions/types/staticEvents";
import { DialogContent, TextField } from "@mui/material";

interface WebinarDetailsProps {
    onChange: (data: Partial<StaticEvent.Webinar>) => void;
    data: Partial<StaticEvent.Webinar>;
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
