import { Button, Unstable_Grid2 as Grid, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResponseLanding() {
    const params = useSearchParams();
    const decodedParams = JSON.parse(atob(params.get("q") ?? ""));
    const [received, setReceived] = useState(false);
    console.log({ params, decodedParams });
    return (
        <>
            <h1>
                Hallo {decodedParams.firstName ?? "Vorname"} {decodedParams.lastName ?? "Nachname"}
            </h1>
            <Grid container columns={5} rowGap={"10px"}>
                {/* <Grid xs={5}>{params.toString()}</Grid> */}
                <Grid xs={1}>Assignment Id:</Grid>
                <Grid xs={4}>{decodedParams.id}</Grid>
                <Grid xs={1}>Response:</Grid>
                <Grid xs={4}>{decodedParams.response}</Grid>
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
                        processResponse(decodedParams.id, decodedParams.response);
                        setReceived(true);
                    }}
                >
                    Antwort bestätigen
                </Button>
            )}
        </>
    );
}
async function processResponse(candidateId: string, response: string) {
    // const { errors } = await publicProcessResponse({ id: candidateId, response });
    // console.log({ errors });
}
