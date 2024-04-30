import Assignment from "@/app/ServerFunctions/types/assignment";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogContent, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { AssignmentSelector } from "./AssignmentSelector";
import { Nullable } from "@/app/Definitions/types";

interface EventTypeSelectorProps {
    event: Partial<TimelineEvent.Event>;
    editing: boolean;
    campaignId: string;
    targetAssignment?: Assignment.AssignmentMin;
    onInfluencerChange: (e: SelectChangeEvent<unknown>) => void;
    onTypeChange: (e: SelectChangeEvent<unknown>) => void;
}

export function GeneralDetails(props: EventTypeSelectorProps) {
    const { event: timelineEvent, onInfluencerChange, onTypeChange, editing, targetAssignment, campaignId } = props;
    const AssignmentSelectorCreator: {
        [key in TimelineEvent.eventType | "none"]: (
            props: Parameters<typeof AssignmentSelector>[0]
        ) => Nullable<JSX.Element>;
    } = {
        Invites: (props) => <AssignmentSelector {...props} />,
        Post: (props) => <AssignmentSelector {...props} />,
        Video: (props) => <AssignmentSelector {...props} />,
        WebinarSpeaker: (props) => <AssignmentSelector {...props} />,
        Webinar: (props) => null,
        none: (props) => null,
    };
    return (
        <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
            <TextField
                select
                disabled={editing}
                name="timelineEventType"
                label="Ereignistyp"
                // value={timelineEvent.type ?? ""}
                size="medium"
                required
                SelectProps={{
                    // sx: { minWidth: "15ch" },
                    value: timelineEvent.type ?? "",
                    onChange: onTypeChange,
                }}
                error={timelineEvent.type === undefined}
                variant="standard"
            >
                {TimelineEvent.singleEventValues.map((x, i) => {
                    return (
                        <MenuItem key={`eventtype${i}`} value={x}>
                            {x}
                        </MenuItem>
                    );
                })}
            </TextField>
            {AssignmentSelectorCreator[timelineEvent.type ?? "none"]({
                timelineEvent,
                targetAssignment,
                campaignId,
                onAssignmentChange: onInfluencerChange,
            })}
        </DialogContent>
    );
}
