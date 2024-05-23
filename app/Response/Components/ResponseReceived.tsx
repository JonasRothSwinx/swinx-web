import { Candidates } from "@/app/ServerFunctions/types/candidates";
import { Box, Typography } from "@mui/material";

//MARK: Response Received
interface ResponseReceivedProps {
    response: Candidates.candidateResponse;
}
export function ResponseReceived({ response }: ResponseReceivedProps) {
    if (response === "rejected") {
        return (
            <Box id="ResponseReceivedContainer">
                <Typography>
                    Vielen Dank für Ihr Feedback. Wir bedauern, dass Sie nicht interessiert sind,
                    mit uns zusammenzuarbeiten. Wir werden Ihre Entscheidung an unseren Kunden
                    weiterleiten.
                </Typography>
            </Box>
        );
    }
    return (
        <Box id="ResponseReceivedContainer">
            <Typography>
                Ihre Antwort wurde erfolgreich übermittelt. Vielen Dank für Ihre Rückmeldung.
            </Typography>
            <Typography>Wir werden Sie über die Auswahl des Kunden informieren.</Typography>
        </Box>
    );
}
