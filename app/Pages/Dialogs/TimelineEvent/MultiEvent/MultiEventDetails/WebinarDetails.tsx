import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogContent, TextField } from "@mui/material";
import AudienceTargetFilter from "../AudienceTargetFilter";

interface WebinarDetailsProps {
    onChange: (data: Partial<TimelineEvent.Webinar>) => void;
    data: Partial<TimelineEvent.Webinar>;
}

export default function WebinarDetails(props: WebinarDetailsProps): JSX.Element {
    const { onChange, data } = props;

    const EventHandlers = {
        targetAudienceChange: (newData: Partial<TimelineEvent.Event["targetAudience"]>) => {
            onChange({
                targetAudience: { ...{ industry: [], cities: [], country: [] }, ...data.targetAudience, ...newData },
            });
        },
    };

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
            <AudienceTargetFilter targetAudience={data.targetAudience} onChange={EventHandlers.targetAudienceChange} />
        </DialogContent>
    );
}
