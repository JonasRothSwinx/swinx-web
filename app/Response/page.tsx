"use client";
import { Button, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useSearchParams } from "next/navigation";
import { publicProcessResponse } from "../ServerFunctions/database/dbOperations/candidate";
import { Suspense, useState } from "react";

async function processResponse(candidateId: string, response: string) {
    const { errors } = await publicProcessResponse({ id: candidateId, response });
    console.log({ errors });
}
function SearchParams() {
    const params = useSearchParams();
    const decodedParams = JSON.parse(atob(params.get("q") ?? ""));
    const [received, setReceived] = useState(false);
    console.log({ params, decodedParams });
    return (
        <>
            <h1>
                Hallo {decodedParams.firstName ?? "Vorname"} {decodedParams.lastName ?? "Nachname"}
            </h1>
            <Grid2 container columns={5} rowGap={"10px"}>
                {/* <Grid2 xs={5}>{params.toString()}</Grid2> */}
                <Grid2 xs={1}>Assignment Id:</Grid2>
                <Grid2 xs={4}>{decodedParams.id}</Grid2>
                <Grid2 xs={1}>Response:</Grid2>
                <Grid2 xs={4}>{decodedParams.response}</Grid2>
            </Grid2>
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

export default function Page() {
    return (
        <div style={{ padding: "50px" }}>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParams />
            </Suspense>
        </div>
    );
}
