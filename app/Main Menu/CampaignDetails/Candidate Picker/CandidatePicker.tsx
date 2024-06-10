import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Nullable } from "@/app/Definitions/types";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Button, Dialog, IconButton, Skeleton, Tabs, Tab, Tooltip, Typography, SxProps, Box } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import EmailPreview from "../Components/EmailPreview/EmailPreview";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import dataClient from "@/app/ServerFunctions/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtonsOpenDialog } from "../Components/OpenInfluencerDetails/components/InfluencerDetailsButtons";
import InfluencerTable from "./InfluencerTable";
import CandidateResponses from "./CandidateResponses";

// eslint-disable-next-line
interface CandidatePickerProps {
    influencers: Influencer.Full[];
    assignment: Assignment.Assignment;
    setAssignment: (assignment: Assignment.Assignment, updatedValues?: Partial<Assignment.Assignment>) => void;
    onClose: (hasChanged?: boolean, newDialog?: InfluencerDetailsButtonsOpenDialog) => void;
}

type openDialog = "none" | "emailPreview";

// export default function CandidatePicker(props: CandidatePickerProps) {
//     const { setAssignment } = props;
//     const queryClient = useQueryClient();

//     const influencers = useQuery({
//         queryKey: ["influencers"],
//         queryFn: () => dataClient.influencer.list(),
//     });

//     const assignment = useQuery({
//         queryKey: ["assignment", props.assignment.id],
//         queryFn: () => dataClient.assignment.get(props.assignment.id),
//     });

//     const [openDialog, setOpenDialog] = useState<openDialog>("none");
//     const candidatesAfterChange = useMemo(() => {
//         return (
//             (assignment.data?.candidates?.length ?? 0) +
//             changedCandidates.added.length -
//             changedCandidates.removed.length
//         );
//     }, [assignment.data, changedCandidates]);

//     if (!influencers.data || !assignment.data) return <Dialog open>loading</Dialog>;
//     const EventHandlers = {
//         onClose: (submit = true) => {
//             if (submit) {
//                 console.log("submitCandidates before closing");
//                 EventHandlers.submitCandidates();
//             }
//             props.onClose();
//             setChangedCandidates({ removed: [], added: [] });
//         },
//         dialogClose: () => {
//             setOpenDialog("none");
//         },
//         assignInfluencer: (candidate: Candidates.Candidate) => {
//             const newAssignment: Assignment.Assignment = {
//                 ...assignment.data,
//                 candidates: [...(assignment.data.candidates ?? []), candidate],
//             };
//             dataClient.assignment.update(
//                 {
//                     id: assignment.data.id,
//                     candidates: [],
//                     influencer: candidate.influencer,
//                     isPlaceholder: false,
//                 },
//                 assignment.data
//             );
//             props.onClose();
//             console.log("assignInfluencer");
//         },
//         submitCandidates: async () => {
//             const tasks: Promise<unknown>[] = [];
//             // delete removed candidates
//             if (changedCandidates.removed.length === 0 && changedCandidates.added.length === 0) {
//                 console.log("no changes");
//                 return;
//             }
//             console.log("submitCandidates", {
//                 removed: changedCandidates.removed,
//                 added: changedCandidates.added,
//             });
//             tasks.push(
//                 ...changedCandidates.removed.map((candidate) => {
//                     if (!candidate.id) throw new Error("candidate.id is null");
//                     return dataClient.candidate.delete(candidate.id, assignment.data.id);
//                 })
//             );
//             const addedCandidates = changedCandidates.added.filter((influencer) => {
//                 return !assignment.data.candidates?.find((candidate) => candidate.influencer.id === influencer.id);
//             });
//             const diff = changedCandidates.added.length - addedCandidates.length;
//             if (diff > 0 && process.env.NODE_ENV === "development")
//                 console.log(`removed ${diff} duplicates from addedCandidates`);
//             //create new candidates
//             tasks.push(
//                 ...addedCandidates.map((candidate) => dataClient.candidate.create(candidate, assignment.data.id))
//             );

//             await Promise.all(tasks);
//             //refetch assignment
//             queryClient.invalidateQueries({ queryKey: ["assignment", assignment.data.id] });
//             queryClient.refetchQueries({ queryKey: ["assignment", assignment.data.id] });
//             // EventHandlers.onClose(false);
//         },
//         openDialog: async (dialog: openDialog) => {
//             switch (dialog) {
//                 case "none": {
//                     break;
//                 }
//                 case "emailPreview": {
//                     if (candidatesAfterChange === 0) {
//                         alert("Keine Influencer ausgewählt");
//                         return;
//                     }

//                     await EventHandlers.submitCandidates();
//                 }
//             }

//             setOpenDialog(dialog);
//         },
//     };
//     const dialogs: { [state in openDialog]: () => JSX.Element | null } = {
//         none: () => null,
//         emailPreview: () => <EmailPreview onClose={EventHandlers.dialogClose} assignmentId={assignment.data.id} />,
//     } as const;

//     return (
//         <Dialog
//             open
//             onClose={() => EventHandlers.onClose()}
//             fullWidth
//             sx={{ margin: "0", "& .MuiPaper-root": { maxWidth: "75%" } }}
//         >
//             {/* <>{dialogs[openDialog]()}</>
//             <Grid container sx={{ maxHeight: "90vh", overflow: "hidden" }}>
//                 <Grid xs={6} sx={{ "&": { maxHeight: "90vh", overflowY: "auto" } }}>
//                     <InfluencerPicker
//                         influencers={influencers.data}
//                         assignmentId={assignment.data.id}
//                         candidates={assignment.data.candidates ?? []}
//                         changedCandidates={changedCandidates}
//                         setChangedCandidates={setChangedCandidates}
//                     />
//                 </Grid>
//                 <Grid xs={6} sx={{ padding: "10px" }}>
//                     <CandidateList
//                         candidates={assignment.data.candidates ?? []}
//                         assignInfluencer={EventHandlers.assignInfluencer}
//                     />
//                     <Buttons setOpenDialog={EventHandlers.openDialog} canProceed={candidatesAfterChange > 0} />
//                 </Grid>
//             </Grid> */}
//         </Dialog>
//     );
// }
export function CandidatePickerTabs(props: CandidatePickerProps) {
    const { setAssignment } = props;
    const queryClient = useQueryClient();
    const assignmentId = props.assignment.id; //TODO: change props to only require assignmentId, get asignemnt by query

    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
    });

    const assignment = useQuery({
        queryKey: ["assignment", props.assignment.id],
        queryFn: () => dataClient.assignment.get(props.assignment.id),
    });

    const [openDialog, setOpenDialog] = useState<openDialog>("none");

    const [tabValue, setTabValue] = useState("1");
    if (!influencers.data || !assignment.data) return <Dialog open>loading</Dialog>;
    const EventHandlers = {
        onClose: (submit = true) => {
            if (submit) {
                console.log("submitCandidates before closing");
                // EventHandlers.submitCandidates();
            }
            props.onClose();
            // setChangedCandidates({ removed: [], added: [] });
        },
        dialogClose: () => {
            setOpenDialog("none");
        },
        assignInfluencer: (candidate: Candidates.Candidate) => {
            const newAssignment: Assignment.Assignment = {
                ...assignment.data,
                candidates: [...(assignment.data.candidates ?? []), candidate],
            };
            dataClient.assignment.update(
                {
                    id: assignment.data.id,
                    candidates: [],
                    influencer: candidate.influencer,
                    isPlaceholder: false,
                },
                assignment.data
            );
            props.onClose();
            console.log("assignInfluencer");
        },

        openDialog: async (dialog: openDialog) => {
            switch (dialog) {
                case "none": {
                    break;
                }
                case "emailPreview": {
                    // if (candidatesAfterChange === 0) {
                    //     alert("Keine Influencer ausgewählt");
                    //     return;
                    // }
                    // await EventHandlers.submitCandidates();
                }
            }

            setOpenDialog(dialog);
        },
        handleTabChange: (event: React.SyntheticEvent, newValue: string) => {
            console.log({ event, newValue });
            setTabValue(newValue);
        },
    };
    const dialogs: { [state in openDialog]: () => JSX.Element | null } = {
        none: () => null,
        emailPreview: () => <EmailPreview onClose={EventHandlers.dialogClose} assignmentId={assignment.data.id} />,
    } as const;
    const styles: SxProps = {
        "&": {
            margin: "0",
            "& .MuiPaper-root": { maxWidth: "75%" },
        },
    };
    return (
        <Dialog open onClose={() => EventHandlers.onClose()} fullWidth sx={styles}>
            <>{dialogs[openDialog]()}</>
            <TabContext value={tabValue}>
                <Box id="TabListContainer">
                    <TabList onChange={EventHandlers.handleTabChange} aria-label="tab list" variant="fullWidth">
                        <Tab label="Influencer einladen" value={"1"} />
                        <Tab label="Antworten" value={"2"} />
                    </TabList>
                </Box>
                <TabPanel value={"1"}>
                    <InfluencerTable assignmentId={assignmentId} />
                </TabPanel>
                <TabPanel value={"2"}>
                    <CandidateResponses assignmentId={assignmentId} assignInfluencer={EventHandlers.assignInfluencer} />
                </TabPanel>
            </TabContext>
        </Dialog>
    );
}

interface ButtonProps {
    canProceed: boolean;
    setOpenDialog: (dialog: openDialog) => Promise<void>;
}
function Buttons({ canProceed, setOpenDialog }: ButtonProps) {
    const Clickhandlers = {
        openPreview: () => {
            setOpenDialog("emailPreview");
        },
        send: async () => {
            // const response = await sendTestMail();
            // const response = await sendTestTemplate();
            // const response = await emailClient.invites.sendBulk({ candidates: props.candidates });
            // console.log(response);
        },
    };

    return (
        <div style={{ position: "absolute", bottom: "0", right: "0" }}>
            {/* {userGroups.includes("admin") && <Button onClick={updateTemplates}>UpdateTemplates</Button>} */}
            <Button onClick={Clickhandlers.openPreview} disabled={!canProceed}>
                Anfrage verfassen
            </Button>
        </div>
    );
}
