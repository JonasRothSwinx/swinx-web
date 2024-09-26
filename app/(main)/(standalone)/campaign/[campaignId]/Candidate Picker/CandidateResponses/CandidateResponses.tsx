import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Nullable } from "@/app/Definitions/types";
import { Candidates } from "@/app/ServerFunctions/types";
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
    Button,
} from "@mui/material";
import stylesExporter from "@/app/(main)/styles/stylesExporter";
import { useQuery } from "@tanstack/react-query";
import { dataClient } from "@/app/ServerFunctions/database";
import { useMemo } from "react";
import Components from "./Components";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";

interface CandidateResponsesProps {
    assignmentId: string;
    assignInfluencer: (influencer: Candidates.Candidate) => void;
}
export default function CandidateResponses({
    assignmentId,
    assignInfluencer,
}: CandidateResponsesProps) {
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
    const userGroups = useQuery({
        queryKey: ["userGroups"],
        queryFn: () => getUserGroups(),
    });
    const styles: SxProps = {
        "&#CandidateResponsesContainer": {
            display: "flex",
            flexDirection: "row",
            "#CandidateResponsesTable": {
                border: "1px solid black",
                borderRadius: "10px",
                borderCollapse: "unset",
                overflow: "hidden",
                "&:not(:first-child)": {
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                },
            },
            "#CandidateResponsesHeader": {
                backgroundColor: "var(--swinx-blue)",
                // border: "1px solid black",
                // borderTopLeftRadius: "10px",
                // borderTopRightRadius: "10px",
                color: "white",
                textAlign: "center",
                "*": {
                    color: "white",
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
        <Box
            id="CandidateResponsesContainer"
            sx={styles}
        >
            {userGroups.data?.includes("admin") && <AdminPanel candidates={candidates} />}
            <Table id="CandidateResponsesTable">
                <colgroup>
                    <col style={{ width: "100px" }} />
                    <col width="100px" />
                    <col style={{ flex: 1 }} />
                    <col style={{ width: "40px" }} />
                </colgroup>
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
    );
}

//MARK: - SubComponents
interface AdminPanelProps {
    candidates: Candidates.Candidate[];
}
function AdminPanel({ candidates }: AdminPanelProps) {
    const EventHandler = {
        printObjects: () => {
            console.log(candidates);
        },
    };
    const styles: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "stretch",
            minWidth: "100px",
            borderRadius: "10px 0px 0px 10px",
            border: "1px solid black",
            borderRight: "none",
            overflow: "hidden",

            ".MuiTypography-root": {
                backgroundColor: "var(--swinx-blue)",
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingBlock: "5px",
                borderBottom: "1px solid black",
                width: "100%",
            },
            "#AdminPanelContent": {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "stretch",
                gap: "5px",
                width: "100%",
                padding: "2px",
            },
            ".MuiButton-root": {
                padding: "5px 2px",
                width: "100%",
                fontSize: "0.5rem",
            },
        },
    };
    return (
        <Box sx={styles}>
            <Typography>Admin Panel</Typography>
            <Box id="AdminPanelContent">
                <Button
                    onClick={() => EventHandler.printObjects()}
                    variant="outlined"
                >
                    Print Objects
                </Button>
            </Box>
        </Box>
    );
}

//MARK: - Helper Functions
