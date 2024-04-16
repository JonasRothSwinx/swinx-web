import { CheckBoxIcon } from "@/app/Definitions/Icons";
import { Nullable } from "@/app/Definitions/types";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Button, Dialog, IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EmailPreview from "../EmailPreview/EmailPreview";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import dataClient from "@/app/ServerFunctions/database";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InfluencerDetailsButtonsOpenDialog } from "./components/InfluencerDetailsButtons";

// eslint-disable-next-line
interface CandidatePickerProps {
    influencers: Influencer.Full[];
    assignment: Assignment.Assignment;
    setAssignment: (
        assignment: Assignment.Assignment,
        updatedValues?: Partial<Assignment.Assignment>,
    ) => void;
    onClose: (hasChanged?: boolean, newDialog?: InfluencerDetailsButtonsOpenDialog) => void;
}
function getClassByResponse(response: Nullable<string>) {
    switch (response) {
        case "accepted": {
            return stylesExporter.campaignDetails.green;
        }
        case "pending": {
            return stylesExporter.campaignDetails.yellow;
        }
        case "rejected": {
            return stylesExporter.campaignDetails.red;
        }
        default: {
            return "";
        }
    }
}
type openDialog = "none" | "emailPreview";

type changedCandidates = {
    removed: Candidates.Candidate[];
    added: Influencer.Full[];
};

export default function CandidatePicker(props: CandidatePickerProps) {
    const { setAssignment } = props;
    const queryClient = useQueryClient();

    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
    });

    const assignment = useQuery({
        queryKey: ["assignment", props.assignment.id],
        queryFn: () => dataClient.assignment.get(props.assignment.id),
    });

    const [changedCandidates, setChangedCandidates] = useState<changedCandidates>({
        removed: [],
        added: [],
    });

    const [openDialog, setOpenDialog] = useState<openDialog>("none");

    if (!influencers.data || !assignment.data) return <Dialog open>loading</Dialog>;
    const EventHandlers = {
        onClose: (submit = true) => {
            if (submit) {
                console.log("submitCandidates before closing");
                EventHandlers.submitCandidates();
            }
            props.onClose();
            setChangedCandidates({ removed: [], added: [] });
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
                assignment.data,
            );
            props.onClose();
            console.log("assignInfluencer");
        },
        submitCandidates: async () => {
            const tasks: Promise<unknown>[] = [];
            // delete removed candidates
            console.log("submitCandidates", {
                removed: changedCandidates.removed,
                added: changedCandidates.added,
            });
            tasks.push(
                ...changedCandidates.removed.map((candidate) => {
                    if (!candidate.id) throw new Error("candidate.id is null");
                    return dataClient.candidate.delete(candidate.id, assignment.data.id);
                }),
            );

            //create new candidates
            tasks.push(
                ...changedCandidates.added.map((candidate) =>
                    dataClient.candidate.create(candidate, assignment.data.id),
                ),
            );

            await Promise.all(tasks);
            //refetch assignment
            queryClient.invalidateQueries({ queryKey: ["assignment", assignment.data.id] });
            queryClient.refetchQueries({ queryKey: ["assignment", assignment.data.id] });
            // EventHandlers.onClose(false);
        },
        openDialog: async (dialog: openDialog) => {
            await EventHandlers.submitCandidates();
            setOpenDialog(dialog);
        },
    };
    const dialogs: { [state in openDialog]: JSX.Element | null } = {
        none: null,
        emailPreview: (
            <EmailPreview
                onClose={EventHandlers.dialogClose}
                // templateName="CampaignInvite"
                // variables={{
                //     honorar: "0.50€",
                //     assignments: [
                //         { assignmentDescription: "Krebs heilen" },
                //         { assignmentDescription: "Weltfrieden sichern" },
                //     ],
                // }}
                assignment={assignment.data}
                candidates={assignment.data.candidates ?? []}
            />
        ),
    } as const;

    return (
        <Dialog
            open
            onClose={() => EventHandlers.onClose()}
            fullWidth
            sx={{ margin: "0", "& .MuiPaper-root": { maxWidth: "75%" } }}
        >
            <>{dialogs[openDialog]}</>
            <Grid container sx={{ maxHeight: "90vh", overflow: "hidden" }}>
                <Grid xs={6} sx={{ "&": { maxHeight: "90vh", overflowY: "auto" } }}>
                    <InfluencerPicker
                        influencers={influencers.data}
                        assignmentId={assignment.data.id}
                        candidates={assignment.data.candidates ?? []}
                        changedCandidates={changedCandidates}
                        setChangedCandidates={setChangedCandidates}
                    />
                </Grid>
                <Grid xs={6} sx={{ padding: "10px" }}>
                    <CandidateList
                        candidates={assignment.data.candidates ?? []}
                        assignInfluencer={EventHandlers.assignInfluencer}
                    />
                    <Buttons
                        setOpenDialog={EventHandlers.openDialog}
                        candidates={assignment.data.candidates ?? []}
                    />
                </Grid>
            </Grid>
        </Dialog>
    );
}

interface CandidateListProps {
    candidates: Candidates.Candidate[];
    assignInfluencer: (influencer: Candidates.Candidate) => void;
}
function CandidateList(props: CandidateListProps) {
    const { candidates } = props;
    const EventHandlers = {
        assignInfluencer: (candidate: Candidates.Candidate) => {
            props.assignInfluencer(candidate);
        },
    };
    return (
        <div style={{ width: "100%" }}>
            <Grid container columns={9} width={"100%"}>
                <Grid xs={4}>Name</Grid>
                <Grid xs={4}>Antwort</Grid>
            </Grid>
            {candidates.map((candidate) => {
                return (
                    <Grid container columns={9} key={candidate.influencer.id}>
                        <Grid xs={4}>
                            <Typography>{`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}</Typography>
                        </Grid>

                        <Grid xs={4} display={"flex"} flexDirection={"row"}>
                            <Typography className={getClassByResponse(candidate.response)}>
                                {`${candidate.response}`}
                            </Typography>
                            <IconButton onClick={() => EventHandlers.assignInfluencer(candidate)}>
                                <Tooltip title="Zuweisen">
                                    <CheckBoxIcon sx={{ color: "green" }} />
                                </Tooltip>
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}
        </div>
    );
}
interface InfluencerPickerProps {
    assignmentId: string;
    candidates: Candidates.Candidate[];
    influencers: Influencer.Full[];
    changedCandidates: changedCandidates;
    setChangedCandidates: (changedCandidates: changedCandidates) => void;
}

function InfluencerPicker(props: InfluencerPickerProps) {
    const { influencers, changedCandidates, setChangedCandidates, candidates } = props;
    // const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>();
    const [isLoading, setIsLoading] = useState(false);
    // useEffect(() => {
    //     if (!influencers) {
    //         setIsLoading(true);
    //     }
    //     listInfluencers().then((result) => {
    //         setIsLoading(false);
    //         setInfluencers(result);
    //     });

    //     return () => {};
    // }, []);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([
        ...candidates.map((x) => x.influencer.id),
    ]);

    //reset rowSelectionModel when element closes
    useEffect(() => {
        setRowSelectionModel([...candidates.map((x) => x.influencer.id)]);
    }, [candidates]);

    const columns: GridColDef[] = [
        // {
        //     field: "id",
        //     headerName: "ID",
        //     // width: 100,
        //     // flex: 1,
        //     type: "string",
        // },
        {
            field: "name",
            headerName: "Name",
            maxWidth: 300,
            flex: 1,
            minWidth: 100,
            type: "string",
            valueGetter({ row }: { row: Influencer.Full }) {
                // console.log(params);
                return `${row.firstName} ${row.lastName}`;
            },
        },
        {
            field: "industry",
            headerName: "Branche",
            flex: 1,
            minWidth: 100,
            type: "string",
            valueGetter({ row }: { row: Influencer.Full }) {
                return row.industry;
            },
        },
        {
            field: "topic",
            headerName: "Themen",
            flex: 1,
            minWidth: 100,
            type: "string",
            valueGetter({ row }: { row: Influencer.Full }) {
                return row.topic?.join(", ") ?? "";
            },
        },
    ];
    const Eventhandlers = {
        selectionChange: (selected: GridRowSelectionModel) => {
            setRowSelectionModel(selected);
            const selectedInfluencers =
                influencers?.filter((influencer) => selected.includes(influencer.id)) ?? [];
            const removedInfluencers: Candidates.Candidate[] = props.candidates.filter(
                (x) => !selectedInfluencers.find((influencer) => influencer.id === x.influencer.id),
            );

            const addedInfluencers: Influencer.Full[] = selectedInfluencers.filter(
                (x) => !props.candidates.find((candidate) => candidate.influencer.id === x.id),
            );

            setChangedCandidates({ removed: removedInfluencers, added: addedInfluencers });
            console.log({
                selectedInfluencers,
                candidates: props.candidates,
                removedInfluencers,
                addedInfluencers,
            });
            // const removedInfluencers = props.candidates.filter((x) => !selected.includes(x.influencer.id));

            // removedInfluencers.map((x) => database.candidate.delete(x));

            // const addedInfluencers = selected.filter(
            //     (x) => !props.candidates.find((candidate) => candidate.influencer.id === x)
            // );

            // console.log({ selectedInfluencers, removedInfluencers, addedInfluencers });
            // // return;
            // const candidates: Candidates.Candidate[] = props.candidates.filter(
            //     (candidate) =>
            //         !removedInfluencers.find((influencer) => influencer.influencer.id === candidate.influencer.id)
            // );

            // const newCandidates = (influencers ?? [])
            //     .filter((x) => addedInfluencers.includes(x.id))
            //     .map((influencer) => {
            //         const candidate: Candidates.Candidate = {
            //             influencer,
            //             id: "",
            //             response: "pending",
            //         };
            //         return candidate;
            //     });
            // console.log({ remainingCandidates: candidates, newCandidates });
            // if (removedInfluencers.length > 0) {
            //     Promise.all(
            //         removedInfluencers.map((candidate) => {
            //             return database.candidate.delete(candidate);
            //         })
            //     );
            // }
            // if (addedInfluencers.length > 0) {
            //     Promise.all(newCandidates.map((x) => database.candidate.create(x, props.assignmentId))).then((res) => {
            //         const idPairs = res.map((data) => data.data);
            //         const updatedCandidates = idPairs.map((x) => {
            //             const updated = newCandidates.find((candidate) => candidate.influencer.id === x.influencerId);
            //             return { ...updated, id: x.id };
            //         }) as Candidates.Candidate[];
            //         const newValues = [...candidates.filter((x) => x.id !== null), ...updatedCandidates];
            //         console.log({ candidates, filtered: candidates.filter((x) => x.id !== null) });
            //         console.log({ newValues });
            //         props.setSelectedInfluencers(newValues);
            //     });
            // }
            // console.log(newCandidates);
            // props.setSelectedInfluencers([...candidates, ...newCandidates]);
        },
    };
    return (
        <>
            {isLoading ? (
                <Skeleton height={600} width={400} variant="rounded" />
            ) : (
                <DataGrid
                    columns={columns}
                    rows={influencers ?? []}
                    checkboxSelection
                    slots={{ toolbar: GridToolbarQuickFilter }}
                    slotProps={{
                        toolbar: {
                            // showQuickFilter: true,
                        },
                    }}
                    rowSelectionModel={rowSelectionModel}
                    onRowSelectionModelChange={Eventhandlers.selectionChange}
                ></DataGrid>
            )}
        </>
    );
}
interface ButtonProps {
    candidates: Candidates.Candidate[];
    setOpenDialog: (dialog: openDialog) => Promise<void>;
}
function Buttons(props: ButtonProps) {
    const [userGroups, setUserGroups] = useState<string[]>([]);
    useEffect(() => {
        getUserGroups().then((groups) => {
            setUserGroups(groups);
            console.log(groups);
        });

        return () => {
            setUserGroups([]);
        };
    }, []);

    const Clickhandlers = {
        openPreview: () => {
            props.setOpenDialog("emailPreview");
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
            <Button onClick={Clickhandlers.openPreview}>Anfrage verfassen</Button>
        </div>
    );
}
