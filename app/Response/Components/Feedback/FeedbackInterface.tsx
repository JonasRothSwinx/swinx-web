import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, TextField, Typography } from "@mui/material";

interface FeedbackInterfaceProps {
    feedback: string;
    setFeedback: (feedback: string) => void;
    response: Candidates.candidateResponse;
}
export default function FeedbackInterface({ setFeedback, feedback, response }: FeedbackInterfaceProps) {
    return (
        <Box id="feedbackInterface">
            {FeedbackDescription[response]()}
            <TextField
                id="feedbackInput"
                label="Feedback"
                focused
                multiline
                minRows={2}
                variant="outlined"
                // value={feedback}
                defaultValue={feedback}
                onChange={(event) => {
                    // console.log({ event, target: event.target, value: event.target.value });
                    setFeedback(event.target.value);
                }}
            />
        </Box>
    );
}

const FeedbackDescription: { [key in Candidates.candidateResponse]: () => JSX.Element } = {
    accepted: () => (
        <Typography id="feedbackDescription">
            Vielen Dank für ihr Interesse.
            <br />
            Wir würden uns freuen, wenn sie uns an dieser Stelle ein kurzes Feedback zu unserem neuen Einladungsprozess
            geben würden.
        </Typography>
    ),
    rejected: () => (
        <Typography id="feedbackDescription">
            Schade, dass sie nicht mit uns an diesem Projekt arbeiten möchten.
            <br />
            Wir würden uns freuen, wenn sie uns hier den Grund für ihre Absage mitteilen würden.
        </Typography>
    ),
    pending: () => <Typography id="FeedbackDescription">Dieser Text sollte nie angezeigt werden</Typography>,
};
