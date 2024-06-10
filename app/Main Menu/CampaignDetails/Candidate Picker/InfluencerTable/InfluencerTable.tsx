import dataClient from "@/app/ServerFunctions/database";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Skeleton } from "@mui/material";
import { GridRowSelectionModel, GridColDef, DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

//#region Definitions
type changedCandidates = {
    removed: Candidates.Candidate[];
    added: Influencer.Full[];
};
//#endregion
interface InfluencerPickerProps {
    assignmentId: string;
    // candidates: Candidates.Candidate[];
    // influencers: Influencer.Full[];
    // changedCandidates: changedCandidates;
    // setChangedCandidates: (changedCandidates: changedCandidates) => void;
}
//MARK: - Main Component
export default function InfluencerTable(props: InfluencerPickerProps) {
    const { assignmentId } = props;
    // const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    //#region Queries
    const assignment = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => dataClient.assignment.get(assignmentId),
    });
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
    });
    //#endregion
    const candidates = useMemo(() => {
        return assignment.data?.candidates ?? [];
    }, [assignment]);
    const [changedCandidates, setChangedCandidates] = useState<changedCandidates>({
        removed: [],
        added: [],
    });
    const candidatesAfterChange = useMemo(() => {
        return (
            (assignment.data?.candidates?.length ?? 0) +
            changedCandidates.added.length -
            changedCandidates.removed.length
        );
    }, [assignment.data, changedCandidates]);
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
                influencers.data?.filter((influencer) => selected.includes(influencer.id)) ?? [];
            const removedInfluencers: Candidates.Candidate[] = candidates.filter(
                (x) => !selectedInfluencers.find((influencer) => influencer.id === x.influencer.id)
            );

            const addedInfluencers: Influencer.Full[] = selectedInfluencers.filter(
                (x) => !candidates.find((candidate) => candidate.influencer.id === x.id)
            );

            setChangedCandidates({ removed: removedInfluencers, added: addedInfluencers });
            console.log({
                selectedInfluencers,
                candidates: candidates,
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
        submitCandidates: async () => {
            const tasks: Promise<unknown>[] = [];
            // delete removed candidates
            if (!assignment.data) throw new Error("assignment.data is null, can't submit candidates");
            if (changedCandidates.removed.length === 0 && changedCandidates.added.length === 0) {
                console.log("no changes");
                return;
            }
            console.log("submitCandidates", {
                removed: changedCandidates.removed,
                added: changedCandidates.added,
            });
            tasks.push(
                ...changedCandidates.removed.map((candidate) => {
                    if (!candidate.id) throw new Error("candidate.id is null");
                    return dataClient.candidate.delete(candidate.id, assignment.data.id);
                })
            );
            const addedCandidates = changedCandidates.added.filter((influencer) => {
                return !assignment.data.candidates?.find((candidate) => candidate.influencer.id === influencer.id);
            });
            const diff = changedCandidates.added.length - addedCandidates.length;
            if (diff > 0 && process.env.NODE_ENV === "development")
                console.log(`removed ${diff} duplicates from addedCandidates`);
            //create new candidates
            tasks.push(
                ...addedCandidates.map((candidate) => dataClient.candidate.create(candidate, assignment.data.id))
            );

            await Promise.all(tasks);
            //refetch assignment
            queryClient.invalidateQueries({ queryKey: ["assignment", assignment.data.id] });
            queryClient.refetchQueries({ queryKey: ["assignment", assignment.data.id] });
            // EventHandlers.onClose(false);
        },
    };
    return (
        <>
            {isLoading ? (
                <Skeleton height={600} width={400} variant="rounded" />
            ) : (
                <DataGrid
                    columns={columns}
                    rows={influencers.data ?? []}
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

//MARK: - Subcomponents
