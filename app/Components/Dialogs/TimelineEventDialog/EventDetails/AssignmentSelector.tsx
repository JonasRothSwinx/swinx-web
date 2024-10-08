import { Assignment, Assignments, Event, Events } from "@/app/ServerFunctions/types";
import { MenuItem, SelectChangeEvent, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { dataClient } from "@dataClient";

interface AssignmentSelectorProps {
    timelineEvent: Partial<Event>;
    campaignId: string;
    targetAssignment?: Assignments.Min;
    onAssignmentChange: (e: SelectChangeEvent<unknown>) => void;
}

export function AssignmentSelector(props: AssignmentSelectorProps) {
    const { targetAssignment, onAssignmentChange, campaignId, timelineEvent } = props;
    const assignedInfluencers = useQuery({
        queryKey: ["assignments", campaignId],
        queryFn: async () => {
            return dataClient.assignment.byCampaign(campaignId);
        },
    });
    if (assignedInfluencers.isLoading) return <div>Loading...</div>;
    if (assignedInfluencers.isError) return <div>Error...</div>;
    if (assignedInfluencers.data === undefined || assignedInfluencers.data.length === 0)
        return <div>Undefined...</div>;
    return (
        <TextField
            id="influencer"
            select
            disabled={targetAssignment !== undefined}
            name="influencer"
            label="Influencer"
            size="medium"
            required
            variant="standard"
            slotProps={{
                select: {
                    value: timelineEvent.assignments?.[0].id ?? "",
                    onChange: onAssignmentChange,
                },
            }}
        >
            {assignedInfluencers.data.map((assignment, i, a) => {
                // debugger;
                if (assignment.isPlaceholder) {
                    return (
                        <MenuItem
                            key={`influencer${assignment.id}`}
                            value={assignment.id}
                        >
                            {`Influencer ${assignment.placeholderName}`}
                        </MenuItem>
                    );
                }
                return (
                    <MenuItem
                        key={`influencer${assignment.id}`}
                        value={assignment.id}
                    >
                        {`${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
                    </MenuItem>
                );
            })}
        </TextField>
    );
}
