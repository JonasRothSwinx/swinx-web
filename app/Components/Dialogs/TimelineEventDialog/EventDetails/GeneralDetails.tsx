import { Assignment, Assignments, Event, Events } from "@/app/ServerFunctions/types";
import { DialogContent, MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { AssignmentSelector } from "./AssignmentSelector";
import { Nullable } from "@/app/Definitions/types";
import { TextFieldWithTooltip } from "@/app/Components/Dialogs/Components";

const AssignmentSelectorCreator: {
    [key in Events.eventType | "none"]: (props: Parameters<typeof AssignmentSelector>[0]) => Nullable<JSX.Element>;
} = {
    ImpulsVideo: (props) => <AssignmentSelector {...props} />,
    Invites: (props) => <AssignmentSelector {...props} />,
    Post: (props) => <AssignmentSelector {...props} />,
    Video: (props) => <AssignmentSelector {...props} />,
    WebinarSpeaker: (props) => <AssignmentSelector {...props} />,
    Webinar: (props) => null,
    none: (props) => null,
};

function getAllowedEventTypes(targetAssignment?: Assignments.Min) {
    if (!targetAssignment) return Events.multiEventValues;
    return Events.singleEventValues;
}
interface EventTypeSelectorProps {
    event: Partial<Event>;
    editing: boolean;
    campaignId: string;
    targetAssignment?: Assignments.Min;
    onInfluencerChange: (e: SelectChangeEvent<unknown>) => void;
    onTypeChange: (e: SelectChangeEvent<unknown>) => void;
}
export function GeneralDetails(props: EventTypeSelectorProps) {
    const { event: timelineEvent, onInfluencerChange, onTypeChange, editing, targetAssignment, campaignId } = props;

    const allowedTypes = getAllowedEventTypes(targetAssignment).toSorted((a, b) => {
        const displayNameA = Events.getDisplayName(a);
        const displayNameB = Events.getDisplayName(b);
        return displayNameA.localeCompare(displayNameB);
    });
    return (
        <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
            <TextFieldWithTooltip
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
                tooltipProps={{
                    title: "Welches Ereignis soll erstellt werden?",
                }}
            >
                {allowedTypes.map((x, i) => {
                    return (
                        <MenuItem key={`eventtype${i}`} value={x}>
                            {Events.getDisplayName(x)}
                        </MenuItem>
                    );
                })}
            </TextFieldWithTooltip>
            {/* {AssignmentSelectorCreator[timelineEvent.type ?? "none"]({
                timelineEvent,
                targetAssignment,
                campaignId,
                onAssignmentChange: onInfluencerChange,
            })} */}
        </DialogContent>
    );
}
