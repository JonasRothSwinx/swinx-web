import { Candidate, Candidates } from "@/app/ServerFunctions/types";
import { Button } from "@mui/material";

interface AssignButtonProps {
    assignInfluencer: (candidate: Candidate) => void;
    candidate: Candidate;
}

export function AssignButton({ assignInfluencer, candidate }: AssignButtonProps) {
    const candidateResponse = candidate.response
        ? (candidate.response as Candidates.candidateResponse)
        : null;
    if (!candidateResponse) return null;
    switch (candidateResponse) {
        case "accepted":
            return (
                <Button
                    variant="contained"
                    onClick={() => assignInfluencer(candidate)}
                >
                    Zuweisen
                </Button>
            );
        case "pending":
            return (
                <Button
                    variant="outlined"
                    onClick={() => assignInfluencer(candidate)}
                >
                    Zuweisen
                </Button>
            );
        case "rejected":
            return null;
    }
}
