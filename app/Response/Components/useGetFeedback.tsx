import { Box, SxProps, TextField, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";

interface UseGetFeedbackProps {
    feedback: string;
    setFeedback: (feedback: string) => void;
}
export default function useGetFeedback({ feedback, setFeedback }: UseGetFeedbackProps) {
    const confirm = useConfirm();
    // const [feedback, setFeedback] = useState<string>("");
    useEffect(() => {
        console.log("Feedback in UseEffect: ", feedback);
    }, [feedback]);
    const styles: SxProps = {
        "&": {
            border: "1px solid black",
            "#feedbackTitle": {
                textAlign: "center",
                backgroundColor: "var(--swinx-blue)",
                color: "white",
            },
        },
    };

    async function getFeedback(): Promise<string> {
        await confirm({
            title: "Feedback",
            dialogProps: { id: "feedbackDialog", sx: styles },
            titleProps: { id: "feedbackTitle" },
            content: <FeedbackInterface feedback={feedback} setFeedback={setFeedback} />,
            confirmationButtonProps: {
                id: "feedbackConfirmButton",
                variant: "contained",
                color: "primary",
            },
            cancellationButtonProps: {
                id: "feedbackCancelButton",
                variant: "outlined",
                color: "info",
            },
        }).catch(() => {
            // processResponse("rejected");
            // setResponseProcessing(true);
            return "";
        });
        console.log("Feedback: ", feedback);
        return feedback;
    }
    return getFeedback;
}

interface FeedbackInterfaceProps {
    feedback: string;
    setFeedback: (feedback: string) => void;
}
export function FeedbackInterface({ setFeedback, feedback }: FeedbackInterfaceProps) {
    return (
        <Box id="feedbackInterface">
            <Typography>Feedback:</Typography>
            <TextField
                id="feedback"
                label="Feedback"
                multiline
                minRows={2}
                variant="outlined"
                value={feedback}
                onChange={(event) => {
                    console.log({ event, target: event.target, value: event.target.value });
                    setFeedback(event.target.value);
                }}
            />
        </Box>
    );
}
