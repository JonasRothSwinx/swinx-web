import { Button, CircularProgress } from "@mui/material";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { useState } from "react";

interface ButtonProps {
    newCandidates: number;
    // canProceed: boolean;
    processInvitations: () => Promise<void>;
    invitationsProcessing: boolean;
}
export default function Buttons({
    // canProceed,
    processInvitations,
    newCandidates,
    invitationsProcessing: processing,
}: ButtonProps) {
    const Clickhandlers = {
        processInvitations: () => {
            processInvitations();
        },
        send: async () => {},
    };

    if (processing)
        return (
            <Button id="SendInvitations" variant="outlined" disabled>
                {newCandidates > 0
                    ? `${newCandidates} Einladung${newCandidates > 1 ? "en" : ""} verschicken`
                    : "Einladungen verschicken"}
                <CircularProgress id="ButtonProcessingOverlay" />
            </Button>
        );
    return (
        <Button
            id="SendInvitations"
            onClick={Clickhandlers.processInvitations}
            disabled={newCandidates === 0}
            variant={newCandidates > 0 ? "contained" : "outlined"}
        >
            {newCandidates > 0
                ? `${newCandidates} Einladung${newCandidates > 1 ? "en" : ""} verschicken`
                : "Einladungen verschicken"}
        </Button>
    );
}
