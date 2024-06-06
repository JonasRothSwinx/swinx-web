import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, Button, CircularProgress, SxProps, TextField, Typography } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useRef, useState } from "react";
import useGetFeedback from "./useGetFeedback";

interface ResponseButtonProps {
    processResponse: (response: Candidates.candidateResponse, feedback?: string) => void;
}
export default function ResponseButtons({ processResponse }: ResponseButtonProps) {
    const [responseProcessing, setResponseProcessing] = useState(false);
    const [feedback, setFeedback] = useState("");
    const feedbackRef = useRef(feedback);

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
        getFeedback: async () => {
            await confirm({
                title: "Feedback",
                dialogProps: { id: "feedbackDialog", sx: feedbackDialogStyles },
                titleProps: { id: "feedbackTitle" },
                content: (
                    <FeedbackInterface
                        feedback={feedback}
                        setFeedback={EventHandlers.setFeedback}
                    />
                ),
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
                    // console.log(feedback);
                    // return feedback;
                })
                .catch(() => {
                    setFeedback("");
                });
            return feedbackRef.current;
        },
        processFeedback: () => {
            console.log("Processing Feedback: ", { feedback, feedbackRef: feedbackRef.current });
            // await new Promise((resolve) => setTimeout(resolve, 2000));
            // setResponseProcessing(false);
            // processResponse("accepted");
        },
        setFeedback: (feedback: string) => {
            // console.log("ReceivedInput: ", feedback);
            setFeedback((prev) => {
                // console.log("Previous: ", prev);
                return feedback;
            });
        },
        processResponse: async (response: Candidates.candidateResponse) => {
            const feedback = await EventHandlers.getFeedback();
            // console.log("State feedback: ", feedback);
            // console.log({ response, feedback: feedbackReturn });
            setResponseProcessing(true);
            processResponse(response, feedback);
        },
    };
    useEffect(() => {
        feedbackRef.current = feedback;
    }, [feedback]);
    const styles: SxProps = {
        "&": {
            // boxSizing: "border-box",
            // position: "absolute",
            // bottom: "0",
            // right: "0",
            // backgroundColor: "red",
            float: "right",
            alignSelf: "flex-end",
            display: "flex",
            flexWrap: "wrap",
            // flexDirection: "column",
            justifyContent: "right",
            alignItems: "end",
            // width: "max-content",
            width: "100%",
            maxWidth: "100%",
            flex: 1,
            borderTop: "1px solid black",

            "& button": {
                width: "fit-content",
                margin: "10px",
            },
            "#submitButton": {
                backgroundColor: "primary",
            },
            "#rejectButton": {
                backgroundColor: "secondary",
            },
            "@media (max-width: 600px)": {
                width: "100%",
                justifyContent: "center",

                button: {
                    // maxHeight: "20px",
                    fontSize: "10px",
                    width: "100%",
                    // margin: "5px",
                },
            },
        },
    };
    if (responseProcessing) {
        return <ResponseProcessing />;
    }
    return (
        <Box id="ButtonContainer" sx={styles}>
            <Button
                id="submitButton"
                variant="contained"
                color="primary"
                onClick={() => {
                    // processResponse("accepted");
                    EventHandlers.processResponse("accepted");
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
                    EventHandlers.processResponse("rejected");
                    // setReceived(true);
                }}
            >
                Ich möchte nicht an der Kampagne teilnehmen
            </Button>
            {/* <Typography id="feedback">{feedback}</Typography> */}
        </Box>
    );
}

function ResponseProcessing() {
    const styles: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            "& .MuiCircularProgress-root": {
                margin: "5px",
            },
        },
    };
    return (
        <Box id="responseProcessing" sx={styles}>
            <Typography>
                Bitte warten...
                <br />
                Ihre Antwort wird verarbeitet
            </Typography>
            <CircularProgress />
        </Box>
    );
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
