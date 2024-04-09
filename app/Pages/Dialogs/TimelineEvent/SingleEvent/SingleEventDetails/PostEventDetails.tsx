import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogContent, TextField } from "@mui/material";
import React from "react";

interface WebinarDetailsProps {
    onChange: React.Dispatch<React.SetStateAction<Partial<TimelineEvent.SingleEvent>>>;
    data: Partial<TimelineEvent.Post>;
}

export default function PostEventDetails(props: WebinarDetailsProps): JSX.Element {
    const { onChange, data } = props;

    const ChangeHandler: { [key in keyof TimelineEvent.EventDetails]: (value: any) => void } = {
        topic: (value) =>
            onChange((prev) => {
                return { ...prev, details: { ...prev.details, topic: value } };
            }),
        maxDuration: (value) => {
            return;
        },
        charLimit: (value) =>
            onChange((prev) => {
                return { ...prev, details: { ...prev.details, charLimit: value } };
            }),
        draftDeadline: (value) =>
            onChange((prev) => {
                return { ...prev, details: { ...prev.details, draftDeadline: value } };
            }),
        instructions: (value) =>
            onChange((prev) => {
                return { ...prev, details: { ...prev.details, instructions: value } };
            }),
    };

    return (
        <DialogContent>
            <TextField
                name="topic"
                label="Thema"
                value={data.details?.topic}
                onChange={(e) => ChangeHandler.topic(e.target.value)}
                // fullWidth
                variant="standard"
            />
            <TextField
                name="charLimit"
                label="Zeichenlimit"
                value={data.details?.charLimit}
                onChange={(e) => ChangeHandler.charLimit(e.target.value)}
                // fullWidth
                variant="standard"
            />
            <TextField
                name="draftDeadline"
                label="Deadline"
                value={data.details?.draftDeadline}
                onChange={(e) => ChangeHandler.draftDeadline(e.target.value)}
                // fullWidth
                variant="standard"
            />
            <TextField
                name="instructions"
                label="Anweisungen"
                value={data.details?.instructions}
                onChange={(e) => ChangeHandler.instructions(e.target.value)}
                fullWidth
                multiline
                variant="standard"
            />
        </DialogContent>
    );
}
