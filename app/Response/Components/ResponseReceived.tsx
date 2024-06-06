import { Candidates } from "@/app/ServerFunctions/types/candidates";
import sleep from "@/app/utils/sleep";
import { Box, Button, CircularProgress, SxProps, Typography } from "@mui/material";
import { useState } from "react";

//MARK: Response Received
interface ResponseReceivedProps {
    response: Candidates.candidateResponse;
    resetResponse: () => Promise<void>;
}
export function ResponseReceived({ response, resetResponse }: ResponseReceivedProps) {
    const [resetting, setResetting] = useState(false);
    const styles: SxProps = {
        "&": {
            "&#ResponseReceivedContainer": {
                // padding: "40px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",
                border: "1px solid black",

                //Text
                ".MuiTypography-root": {
                    fontSize: "30px",
                    margin: "10px",
                    textAlign: "center",
                },

                //Reset Response Button
                ".MuiButton-root": {
                    margin: "10px",
                },

                //Confirm Reset Container
                "#ConfirmResetContainer": {
                    display: "flex",
                    flexDirection: "row",
                    "@media (max-width: 600px)": {
                        flexDirection: "column-reverse",
                    },
                },

                //Circular Progress
                ".MuiCircularProgress-root": {
                    margin: "10px",
                },
            },
        },
    };
    const EventHandlers = {
        resetResponse: async () => {
            setResetting(true);
            await resetResponse();
            // await sleep(50000);
            setResetting(false);
        },
    };
    if (resetting) {
        return (
            <Box id="ResponseReceivedContainer" sx={styles}>
                <Typography>
                    {" "}
                    Ihre Antwort wird zurückgesetzt.
                    <br /> Bitte warten Sie...
                </Typography>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box id="ResponseReceivedContainer" sx={styles}>
            <Content response={response} />
            <ResetButton resetResponse={EventHandlers.resetResponse} />
        </Box>
    );
}

interface ContentProps {
    response: Candidates.candidateResponse;
}
function Content({ response }: ContentProps) {
    switch (response) {
        case "accepted":
            return (
                <>
                    <Typography>
                        Ihre Antwort wurde erfolgreich übermittelt. Vielen Dank für Ihre
                        Rückmeldung.
                    </Typography>
                    <Typography>Wir werden Sie über die Auswahl des Kunden informieren.</Typography>
                </>
            );
        case "rejected":
            return (
                <Typography>
                    Vielen Dank für Ihr Feedback. Wir bedauern, dass Sie nicht interessiert sind,
                    mit uns zusammenzuarbeiten. Wir werden Ihre Entscheidung an unseren Kunden
                    weiterleiten.
                </Typography>
            );
        default:
            return <Typography>Diese Seite sollte nicht angezeit werden.</Typography>;
    }
}
interface ResetButtonProps {
    resetResponse: () => Promise<void>;
}
function ResetButton({ resetResponse }: ResetButtonProps) {
    const [confirmReset, setConfirmReset] = useState(false);
    const EventHandlers = {
        confirmClick: () => {
            setConfirmReset(true);
        },
        cancelReset: () => {
            setConfirmReset(false);
        },
    };
    if (confirmReset) {
        return (
            <Box id="ConfirmResetContainer">
                <Button color="error" onClick={EventHandlers.cancelReset}>
                    Abbrechen
                </Button>
                <Button id="ResetResponseButton" onClick={resetResponse} variant="contained">
                    Entscheidung wirklich zurücksetzen?
                </Button>
            </Box>
        );
    }
    return (
        <Button id="ResetResponseButton" onClick={EventHandlers.confirmClick} variant="outlined">
            Ich möchte meine Entscheidung ändern
        </Button>
    );
}
