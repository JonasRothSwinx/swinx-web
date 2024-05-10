import { Box, Button, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { dataClient } from "../Functions/Database";

export default function ResponseLanding() {
    const params = useSearchParams();
    const [received, setReceived] = useState(false);

    const dataParams = params.get("data");
    const decodedParams: CampaignInviteEncodedData = JSON.parse(atob(dataParams ?? btoa("{}")));

    const { assignmentId, candidateId, candidateFullName, campaignId } = decodedParams;
    const candidate = useQuery({
        enabled: !!candidateId,
        queryKey: ["candidate", candidateId],
        queryFn: () => {
            return dataClient.getCandidate({ id: candidateId });
        },
    });

    const assignmentData = useQuery({
        enabled: !!assignmentId,
        queryKey: ["assignment", assignmentId],
        queryFn: () => {
            return dataClient.getAssignmentData({ id: assignmentId });
        },
    });

    const eventData = useQuery({
        enabled: !!assignmentId,
        queryKey: ["events", assignmentId],
        queryFn: () => {
            return dataClient.getEventsByAssignment({ id: assignmentId });
        },
    });

    const CampaignData = useQuery({
        enabled: !!campaignId,
        queryKey: ["campaign", campaignId],
        queryFn: () => {
            return dataClient.getCampaignInfo({ id: campaignId });
        },
    });

    if (!assignmentId || !candidateId || !candidateFullName) {
        return <Typography id="ErrorText">Ungültige Daten empfangen</Typography>;
    }

    return (
        <Box id="ResponseLandingContainer">
            <Button
                onClick={() => {
                    candidate.refetch();
                    assignmentData.refetch();
                }}
                variant="contained"
            >
                Refresh
            </Button>
            <Typography variant="h4">
                Hallo {candidateFullName},<br />
            </Typography>
            <Grid container columns={5} rowGap={"10px"}>
                {/* <Grid xs={5}>{params.toString()}</Grid> */}
                <Grid xs={1}>Assignment Id:</Grid>
                <Grid xs={4}>{assignmentId}</Grid>
                <Grid xs={1}>Candidate Id</Grid>
                <Grid xs={4}>{candidateId}</Grid>
            </Grid>
            <Typography whiteSpace={"pre-wrap"}>
                {JSON.stringify(decodedParams, null, "\t")}
            </Typography>

            {received ? (
                <Typography>Antwort erhalten</Typography>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => {
                        // processResponse(decodedParams.id, decodedParams.response);
                        // setReceived(true);
                    }}
                >
                    Antwort bestätigen
                </Button>
            )}
        </Box>
    );
}
async function processResponse(candidateId: string, response: string) {
    // const { errors } = await publicProcessResponse({ id: candidateId, response });
    // console.log({ errors });
}
