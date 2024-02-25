import Assignment from "@/app/ServerFunctions/types/assignment";
import { Box, Button, Dialog, Skeleton } from "@mui/material";
import { randomAddress } from "@mui/x-data-grid-generator";
import Grid from "@mui/material/Unstable_Grid2";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { useEffect, useMemo, useState } from "react";
import { listInfluencers } from "@/app/ServerFunctions/database/influencers";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
    GridToolbarProps,
    GridToolbarQuickFilter,
    GridToolbarQuickFilterProps,
} from "@mui/x-data-grid";
import dbInterface from "@/app/ServerFunctions/dbInterface";

// eslint-disable-next-line
interface CandidatePickerProps {
    assignment: Assignment.Assignment;
    setAssignment: (
        assignment: Assignment.Assignment,
        updatedValues?: Partial<Assignment.Assignment>,
    ) => void;
    onClose: () => void;
}

export default function CandidatePicker(props: CandidatePickerProps) {
    const { assignment, setAssignment } = props;
    function setSelectedCandidates(candidates: Influencer.Candidate[]) {
        const newAssignment: Assignment.Assignment = { ...assignment, candidates: candidates };
        // console.log(newAssignment);
        // return;
        setAssignment(newAssignment, { candidates });
    }
    return (
        <Dialog
            open
            onClose={props.onClose}
            fullWidth
            sx={{ margin: "0", "& .MuiPaper-root": { maxWidth: "75%" } }}
        >
            <Grid container>
                <Grid xs={8}>
                    <InfluencerPicker
                        assignmentId={assignment.id}
                        candidates={assignment.candidates ?? []}
                        setSelectedInfluencers={setSelectedCandidates}
                    />
                </Grid>
                <Grid xs={4} sx={{ padding: "10px" }}>
                    <CandidateList candidates={assignment.candidates ?? []} />
                    <Buttons />
                </Grid>
            </Grid>
        </Dialog>
    );
}

interface CandidateListProps {
    candidates: Influencer.Candidate[];
}
function CandidateList(props: CandidateListProps) {
    const { candidates } = props;
    return (
        <div style={{ width: "100%" }}>
            <Grid container columns={2} width={"100%"}>
                <Grid xs={1}>Name</Grid>
                <Grid xs={1}>Antwort</Grid>
            </Grid>
            {candidates.map((candidate) => {
                return (
                    <Grid container columns={2} key={candidate.influencer.id}>
                        <Grid xs={1}>
                            {`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}
                        </Grid>

                        <Grid xs={1}>{`${candidate.response}`}</Grid>
                    </Grid>
                );
            })}
        </div>
    );
}
interface InfluencerPickerProps {
    assignmentId: string;
    candidates: Influencer.Candidate[];
    setSelectedInfluencers: (influencers: Influencer.Candidate[]) => void;
}
function InfluencerPicker(props: InfluencerPickerProps) {
    const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        listInfluencers().then((result) => {
            setIsLoading(false);
            setInfluencers(result);
        });

        return () => {};
    }, []);

    useEffect(() => {
        const selected = props.candidates.map((x) => x.influencer.id);
        setRowSelectionModel(selected);
        return () => {};
    }, [props.candidates]);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
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
            valueGetter({ row }: { row: Influencer.InfluencerFull }) {
                // console.log(params);
                return `${row.firstName} ${row.lastName}`;
            },
        },
    ];
    const Eventhandlers = {
        selectionChange: (selected: GridRowSelectionModel) => {
            setRowSelectionModel(selected);
            const selectedInfluencers =
                influencers?.filter((influencer) => selected.includes(influencer.id)) ?? [];

            const removedInfluencers = props.candidates.filter(
                (x) => !selected.includes(x.influencer.id),
            );

            removedInfluencers.map((x) => dbInterface.candidate.delete(x));

            const addedInfluencers = selected.filter(
                (x) => !props.candidates.find((candidate) => candidate.influencer.id === x),
            );

            console.log({ selectedInfluencers, removedInfluencers, addedInfluencers });
            // return;
            const candidates: Influencer.Candidate[] = props.candidates.filter(
                (x) => !removedInfluencers.find((influencer) => influencer.id === x.influencer.id),
            );

            const newCandidates = candidates.filter((x) =>
                addedInfluencers.includes(x.influencer.id),
            );
            Promise.all(
                newCandidates.map((x) => dbInterface.candidate.create(x, props.assignmentId)),
            ).then((res) => {
                const idPairs = res.map((data) => data.data);
                const updatedCandidates = idPairs.map((x) => {
                    const updated = newCandidates.find(
                        (candidate) => candidate.influencer.id === x.influencerId,
                    );
                    return { ...updated, id: x.id };
                }) as Influencer.Candidate[];
                const newValues = [
                    ...candidates.filter((x) => x.id !== null),
                    ...updatedCandidates,
                ];
                console.log({ candidates, filtered: candidates.filter((x) => x.id !== null) });
                console.log({ newValues });
                props.setSelectedInfluencers(newValues);
            });
            console.log(newCandidates);
            props.setSelectedInfluencers([...candidates, ...newCandidates]);
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
function Buttons() {
    return (
        <div style={{ position: "absolute", bottom: "0", right: "0" }}>
            <Button>Anfrage verfassen</Button>
        </div>
    );
}
