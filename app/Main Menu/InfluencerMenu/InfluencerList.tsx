import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowModes,
    GridRowModesModel,
    GridRowsProp,
    GridRowProps,
    GridValueGetterParams,
    GridRowId,
    GridRowModel,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowParams,
    GridRenderEditCellParams,
    GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import { randomId, randomName, randomUserName } from "@mui/x-data-grid-generator";
import { Button, CircularProgress, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Influencer, Influencers } from "@/app/ServerFunctions/types";
import { InfluencerDialog } from "@/app/Components";

import { deDE } from "@mui/x-data-grid";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { deDE as coreDeDE } from "@mui/material/locale";
import { range } from "@/app/Definitions/utility";
import { uniqueNamesGenerator, Config, animals, names, colors } from "unique-names-generator";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataClient } from "@/app/ServerFunctions/database";

const client = generateClient<Schema>();
const theme = createTheme({}, { deDE, pickersDeDE, coreDeDE });

function InitInfluencer(props: { id: string }) {
    const { id } = props;
    const influencerData = {
        id,
        firstName: "",
        lastName: "",
        email: "",
        isNew: true,
    };
    return influencerData;
}
interface EditToolbarProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    initiateUpdate: () => void;
    setRows: (rows: Influencers.Full[]) => void;
    queryClient: QueryClient;
    isPending?: boolean;
}
async function createRandomInfluencers(queryClient: QueryClient) {
    const amount = parseInt(prompt("Anzahl Influencer") ?? "");
    if (!amount) return;
    const promises: Promise<unknown>[] = [];
    for (const _ of range(amount)) {
        const influencer: Influencers.Full = {
            id: "null",
            firstName: uniqueNamesGenerator({ dictionaries: [names], length: 1 }),
            lastName: uniqueNamesGenerator({
                dictionaries: [names, animals, colors],
                length: 2,
                separator: "",
            }),
            email: "jonasroth1@gmail.com",
        };
        promises.push(dataClient.influencer.create(influencer));
        console.log(influencer);
    }
    await Promise.all(promises);
}
function EditToolbar(props: EditToolbarProps) {
    const { setIsOpen, initiateUpdate, setRows, queryClient, isPending } = props;
    function handleClick() {
        setIsOpen(true);
    }
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Neuer Influencer
            </Button>
            {/* <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => createRandomInfluencers(queryClient)}
            >
                Erstelle Influencer
            </Button> */}
            {isPending && <CircularProgress />}
        </GridToolbarContainer>
    );
}
// const selectionSet = ["id", "details.id", "details.email"] as const;
interface updateInfluencerProps {
    setInfluencers: (influencers: Influencers.Full[]) => void;
}

function InfluencerList() {
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const queryClient = useQueryClient();
    const [rows, setRows] = useState<Influencers.Full[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isOpen, setIsOpen] = useState(false);
    const [editingData, setEditingData] = useState<Influencers.Full>();
    const [editing, setEditing] = useState(false);
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dataClient.influencer.list(),
    });
    // const [dialogOtions, setDialogOptions] = useState<DialogOptions>({});

    // const [dialogProps, setDialogProps] = useState<DialogConfig<Influencers.Full[]>>({
    //     parent: rows ?? [],
    //     setParent: setRows,
    //     onClose: () => {
    //         setIsOpen(false);
    //         setEditingData(undefined);
    //         influencers.refetch();
    //     },
    // });

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const groups = useQuery({ queryKey: ["groups"], queryFn: () => getUserGroups() });
    const [showDialog, setShowDialog] = useState(false);

    // useEffect(() => {
    //     updateInfluencers({ setInfluencers: setRows });
    //     return () => {};
    // }, []);

    // useEffect(() => {

    //     return () => {};
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [influencers.data]);

    useEffect(() => {
        groups.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const Eventhandlers = {
        handleEditClick: (id: GridRowId) => {
            return () => {
                // debugger;
                const editingData = influencers.data?.find((x) => x.id === id);
                if (!editingData) return;
                setIsOpen(true);
                setEditing(true);
                setEditingData(editingData);
            };
        },
        handleDeleteClick: (id: GridRowId) => {
            return () => {
                if (!influencers.data) return;
                const entity = influencers.data?.find((x) => x.id === id);
                if (!entity) return;
                console.log({ entity });
                const { id: entityId } = entity;
                if (!entityId) return;
                dataClient.influencer.delete(entityId);
                // influencers.data = influencers.data?.filter((x) => x.id !== id);
                influencers.refetch();
            };
        },
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
            flex: 1,
            type: "string",
        },
        {
            field: "firstName",
            headerName: "Vorname",
            flex: 2,
            headerAlign: "center",
            align: "center",
            type: "string",
        },
        {
            field: "lastName",
            headerName: "Nachname",
            flex: 2,

            headerAlign: "center",
            align: "center",
            type: "string",
        },
        {
            field: "email",
            headerName: "E-Mail",
            flex: 3,

            headerAlign: "center",
            align: "center",
            valueGetter: ({ row }) => {
                row = row as Influencers.Full;
                return row.email;
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Aktionen",
            cellClassName: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        key={"editAction"}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={Eventhandlers.handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={"deleteAction"}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={Eventhandlers.handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    return (
        <>
            {/* {groups.data}
            {groups.data?.includes("admin") && (
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["influencers"] })}
                >
                    Update
                </button>
            )} */}
            {isOpen && (
                <InfluencerDialog
                    isOpen={isOpen}
                    parent={influencers.data ?? []}
                    setParent={setRows}
                    editing={editing}
                    onClose={() => {
                        setIsOpen(false);
                        setEditingData(undefined);
                        influencers.refetch();
                    }}
                    editingData={editingData}
                />
            )}
            <ThemeProvider theme={theme}>
                {influencers.isLoading ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Typography variant="h3">Lade Influencer</Typography>
                        <CircularProgress />
                    </div>
                ) : (
                    <DataGrid
                        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                        rows={influencers.data ?? []}
                        columns={columns}
                        // rowModesModel={rowModesModel}
                        // onRowModesModelChange={handleRowModesModelChange}
                        // onRowEditStop={handleRowEditStop}
                        // processRowUpdate={processRowUpdate}
                        // onProcessRowUpdateError={handleProcessRowUpdateError}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                setIsOpen,
                                initiateUpdate: influencers.refetch,
                                setRows,
                                queryClient,
                                isPending: influencers.isFetching,
                            },
                        }}
                        autoHeight={true}
                        sx={{
                            m: 2,
                            background: "white",
                            "& .MuiDataGrid-cell": {
                                // color: "primary.main",
                                borderLeft: "1px solid black",
                            },
                            "& .MuiDataGrid-cell:first-of-type": {
                                // color: "primary.main",
                                borderLeft: "none",
                            },
                            "& .MuiDataGrid-cell--editing:has(.Mui-error)": {
                                border: "1px solid red",
                                backgroundColor: "red",
                                color: "#ff4343",
                            },
                        }}
                    />
                )}
            </ThemeProvider>
        </>
    );
    // return (
    //     <ul>
    //         <span>Groups: {groups}</span>
    //         {influencer.map((influencer, idx) => (
    //             <li key={influencer.id}>
    //                 {influencer.firstName} {influencer.lastName} {/* {details[idx].email ?? ""} */}
    //                 {
    //                     /* groups.includes("admin") &&  */ <button onClick={() => deleteInfluencer(influencer)}>
    //                         Löschen
    //                     </button>
    //                 }
    //             </li>
    //         ))}
    //     </ul>
    // );
}

export default InfluencerList;
