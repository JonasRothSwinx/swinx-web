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
        console.log("Feedback: ", feedback);
        return feedback;
    }
    return getFeedback;
}
