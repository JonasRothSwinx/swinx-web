import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Nullable } from "@/app/Definitions/types";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import {
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    SxProps,
} from "@mui/material";
import stylesExporter from "@/app/Main Menu/styles/stylesExporter";
import { useQuery } from "@tanstack/react-query";
import dataClient from "@/app/ServerFunctions/database";
import { useMemo } from "react";
import Components from "./Components";

interface CandidateResponsesProps {
    assignmentId: string;
    assignInfluencer: (influencer: Candidates.Candidate) => void;
}
export default function CandidateResponses({ assignmentId, assignInfluencer }: CandidateResponsesProps) {
    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => dataClient.assignment.get(assignmentId),
    });
    const candidates = useMemo(() => {
        return assignment.data?.candidates ?? [];
    }, [assignment]);
    const EventHandlers = {
        assignInfluencer: (candidate: Candidates.Candidate) => {
            assignInfluencer(candidate);
        },
    };
    const styles: SxProps = {
        "&": {
            "#CandidateResponsesTable": {
                border: "1px solid black",
                borderRadius: "10px",
                borderCollapse: "unset",
                overflow: "hidden",
            },
            "#CandidateResponsesHeader": {
                backgroundColor: "var(--swinx-blue)",
                // border: "1px solid black",
                // borderTopLeftRadius: "10px",
                // borderTopRightRadius: "10px",
                color: "white",
                textAlign: "center",
                "*": {
                    textAlign: "center",
                    fontWeight: "bold",
                },
            },
            "#CandidateResponsesTableBody": {
                // borderBottomRadiusLeft: "10px",
                // borderBottomRadiusRight: "10px",
                // border: "1px solid black",
            },
        },
    };
    return (
        <Box id="CandidateResponsesContainer" sx={styles}>
            <Table id="CandidateResponsesTable">
                <TableHead id="CandidateResponsesHeader">
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Antwort</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody id="CandidateResponsesTableBody">
                    {candidates.map((candidate) => {
                        return (
                            <Components.CandidateTableRow
                                key={candidate.influencer.id}
                                candidate={candidate}
                                assignInfluencer={EventHandlers.assignInfluencer}
                            />
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
        // <div style={{ width: "100%" }}>
        //     <Grid container columns={9} width={"100%"}>
        //         <Grid xs={4}>Name</Grid>
        //         <Grid xs={4}>Antwort</Grid>
        //     </Grid>
        //     {candidates.map((candidate) => {
        //         return (
        //             <Grid container columns={9} key={candidate.influencer.id}>
        //                 <Grid xs={4}>
        //                     <Typography>{`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}</Typography>
        //                 </Grid>

        //                 <Grid xs={4} display={"flex"} flexDirection={"row"}>
        //                     <Typography className={getClassByResponse(candidate.response)}>
        //                         {`${candidate.response}`}
        //                     </Typography>
        //                     <IconButton onClick={() => EventHandlers.assignInfluencer(candidate)}>
        //                         <Tooltip title="Zuweisen">
        //                             <CheckBoxIcon sx={{ color: "green" }} />
        //                         </Tooltip>
        //                     </IconButton>
        //                 </Grid>
        //             </Grid>
        //         );
        //     })}
        // </div>
    );
}

//MARK: - Helper Functions
