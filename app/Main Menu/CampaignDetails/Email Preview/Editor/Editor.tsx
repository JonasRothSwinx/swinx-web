import { Candidates } from "@/app/ServerFunctions/types";
import { EmailTriggers } from "@/app/ServerFunctions/types";
import {
    Box,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

interface EditorProps {
    selectedCandidate: Candidates.Candidate;
    setSelectedCandidate: (candidate: Candidates.Candidate) => void;
    candidates: Candidates.Candidate[];
}
export default function Editor({
    candidates,
    selectedCandidate,
    setSelectedCandidate,
}: EditorProps) {
    return (
        <Box
            flex={1}
            padding={"10px"}
        >
            <TextField
                fullWidth
                select
                name="influencer"
                label="Zeige für Influencer'"
                value={selectedCandidate.id}
                size="medium"
                required
                SelectProps={{
                    // sx: { minWidth: "15ch" },
                    value: selectedCandidate.id,
                    onChange: ({ target: { value } }) => {
                        console.log(value);
                        const candidate = candidates.find((x) => x.id === value);
                        if (!candidate) return;
                        setSelectedCandidate(candidate);
                    },
                }}
            >
                {candidates.map((candidate, i) => {
                    return (
                        <MenuItem
                            key={candidate.id ?? ""}
                            value={candidate.id ?? ""}
                        >
                            {`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}
                        </MenuItem>
                    );
                })}
            </TextField>
            {/* <br />
            <br />
            <br />
            <Typography>TODO: Email Editor</Typography> */}
            <RecipientTable candidates={candidates} />
        </Box>
    );
}

interface RecipientTableProps {
    candidates: Candidates.Candidate[];
}
function RecipientTable({ candidates }: RecipientTableProps) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell
                            colSpan={2}
                            sx={{ textAlign: "center" }}
                        >
                            {candidates.length} Empfänger
                        </TableCell>
                        <TableCell>template</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {candidates.map((candidate) => {
                        const emailLevel = EmailTriggers.getDisplayName(
                            candidate.influencer.emailLevel ?? "new",
                        );
                        return (
                            <TableRow key={candidate.id}>
                                <TableCell>{`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}</TableCell>
                                <TableCell>{`${candidate.influencer.email}`}</TableCell>
                                <TableCell>{`${emailLevel}`}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
