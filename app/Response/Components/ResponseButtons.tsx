import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, Button, CircularProgress, SxProps, TextField, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";

interface ResponseButtonProps {
    processResponse: (response: Candidates.candidateResponse) => void;
}
export default function ResponseButtons({ processResponse }: ResponseButtonProps) {
    const [responseProcessing, setResponseProcessing] = useState(false);
    const [feedback, setFeedback] = useState("");
    const confirm = useConfirm();

    const feedbackDialogStyles: SxProps = {
        "&": {
            border: "1px solid black",
            "#feedbackTitle": {
                textAlign: "center",
                backgroundColor: "var(--swinx-blue)",
                color: "white",
            },
        },
    };
    const EventHandlers = {
        getFeedback: () => {
            confirm({
                title: "Feedback",
                dialogProps: { id: "feedbackDialog", sx: feedbackDialogStyles },
                titleProps: { id: "feedbackTitle" },
                content: <FeedbackInterface setFeedback={setFeedback} />,
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
            })
                .then(() => {
                    // processResponse("accepted");
                    console.log("Feedback: ", feedback);
                })
                .catch(() => {
                    // processResponse("rejected");
                    // setResponseProcessing(true);
                    console.log("Feedback: ", feedback);
                });
        },
    };
    if (responseProcessing) {
        return <ResponseProcessing />;
    }
    return (
        <Box id="ButtonContainer">
            <Button
                id="submitButton"
                variant="contained"
                color="primary"
                onClick={() => {
                    // processResponse("accepted");
                    EventHandlers.getFeedback();
                    // setReceived(true);
                }}
            >
                Ich möchte an der Kampagne teilnehmen
            </Button>
            <Button
                id="rejectButton"
                variant="outlined"
                color="info"
                onClick={() => {
                    processResponse("rejected");
                    // setReceived(true);
                }}
            >
                Ich möchte nicht an der Kampagne teilnehmen
            </Button>
        </Box>
    );
}

function ResponseProcessing() {
    return (
        <Box id="responseProcessing">
            <Typography>
                Bitte warten...
                <br />
                Antwort wird verarbeitet
            </Typography>
            <CircularProgress />
        </Box>
    );
}

interface FeedbackInterfaceProps {
    setFeedback: (feedback: string) => void;
}
export function FeedbackInterface({ setFeedback }: FeedbackInterfaceProps) {
    return (
        <Box id="feedbackInterface">
            <Typography>Feedback:</Typography>
            <TextField>
                <TextField
                    id="feedback"
                    label="Feedback"
                    multiline
                    minRows={2}
                    variant="outlined"
                    onChange={(event) => setFeedback(event.target.value)}
                />
            </TextField>
        </Box>
    );
}
