import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Candidate, Candidates, Influencers } from "@/app/ServerFunctions/types";
import { IconButton, SxProps, TableCell, TableRow, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { AssignButton } from "./AssignButton";
interface CandidateTableRowProps {
    candidate: Candidate;
    assignInfluencer: (candidate: Candidate) => void;
}

export default function CandidateTableRow({ candidate, assignInfluencer }: CandidateTableRowProps) {
    const { influencer } = candidate;
    const styles: SxProps = useMemo(
        () => ({
            "&": {
                ".MuiTableCell-root": {
                    padding: "5px",
                },
                "#response": {
                    borderRadius: "20px",
                    width: "fit-content",
                    textAlign: "center",
                    backgroundColor:
                        colorByResponse[
                            (candidate.response as Candidates.candidateResponse) ?? "pending"
                        ],
                },
                "#assignIcon": {
                    color: "green",
                },
                "#feedback": {
                    // width: "100px",
                    // whiteSpace: "nowrap",
                    overflow: "auto",
                    textOverflow: "ellipsis",
                },
            },
        }),
        [candidate],
    );
    return (
        <TableRow
            key={candidate.influencer.id}
            sx={styles}
        >
            <TableCell id="name">{Influencers.getFullName(influencer)}</TableCell>
            <TableCell id="response">
                {responseDisplayText[candidate.response as Candidates.candidateResponse]}
            </TableCell>
            <TableCell id="feedback">{candidate.feedback}</TableCell>
            <TableCell>
                {/* <IconButton onClick={() => assignInfluencer(candidate)}>
                    <Tooltip title="Zuweisen">
                        <CheckBoxIcon id="assignIcon" />
                    </Tooltip>
                </IconButton> */}
                <AssignButton
                    assignInfluencer={assignInfluencer}
                    candidate={candidate}
                />
            </TableCell>
        </TableRow>
    );
}

//MARK: - Helper Functions
const colorByResponse: { [key in Candidates.candidateResponse]: string } = {
    accepted: "green",
    rejected: "red",
    pending: "orange",
};

const responseDisplayText: { [key in Candidates.candidateResponse]: string } = {
    accepted: "Angenommen",
    rejected: "Abgelehnt",
    pending: "Ausstehend",
};
