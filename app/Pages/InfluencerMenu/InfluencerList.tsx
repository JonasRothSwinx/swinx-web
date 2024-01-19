import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
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
import { randomId } from "@mui/x-data-grid-generator";
import { Button, TextField } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import {
    createNewInfluencer,
    deleteInfluencer,
    getUserGroups,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";

const client = generateClient<Schema>();

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}
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
function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;
    const id = 1;
    function handleClick() {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                firstName: "",
                lastName: "",
                email: "",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "firstName" },
        }));
    }
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
        </GridToolbarContainer>
    );
}
type RowDataInfluencer = Schema["InfluencerPrivate"] &
    Schema["InfluencerPublic"] & { isNew: boolean };

function InfluencerList(props: {}) {
    const [influencer, setInfluencer] = useState<Schema["InfluencerPublic"][]>([]);
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [rows, setRows] = useState<RowDataInfluencer[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const [groups, setGroups] = useState<string[]>([]);
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
            editable: true,
            type: "string",
        },
        {
            field: "lastName",
            headerName: "Nachname",
            flex: 2,

            headerAlign: "center",
            align: "center",
            editable: true,
            type: "string",
        },
        {
            field: "email",
            headerName: "E-Mail",
            flex: 3,

            headerAlign: "center",
            align: "center",
            editable: true,
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                const hasError = !String(params.props.value).match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                );
                return { ...params.props, error: hasError };
            },
            // renderEditCell: (params: GridRenderEditCellParams) => (
            //     <TextField
            //         id="email"
            //         name="email"
            //         // className={styles.TextField}
            //         // label="E-Mail"
            //         type="email"
            //         defaultValue={params.value}
            //         required
            //     />
            // ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Aktionen",
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    function handleEditClick(id: GridRowId) {
        return () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }

    function handleSaveClick(id: GridRowId) {
        return () => {
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
            const entry = rows.find((x) => x.id === id);
            console.log({ entry });
        };
    }

    function handleDeleteClick(id: GridRowId) {
        return () => {
            const entity = rows.find((x) => x.id === id);
            if (!entity) return;
            console.log({ entity });
            const { id: publicId, influencerPublicDetailsId: privateId } = entity;
            if (!(publicId && privateId)) return;
            deleteInfluencer({
                publicId,
                privateId,
            });
            setRows(rows.filter((row) => row.id !== id));
        };
    }
    function handleCancelClick(id: GridRowId) {
        return () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });

            const editedRow = rows.find((row) => row.id === id);
            if (editedRow!.isNew) {
                setRows(rows.filter((row) => row.id !== id));
            }
        };
    }
    async function processRowUpdate(newRow: RowDataInfluencer, oldRow: RowDataInfluencer) {
        // debugger;
        const { firstName, lastName, email, id } = newRow;
        console.log(newRow);
        if (newRow.isNew) {
            console.log({ firstName, lastName, email, id });
            console.log([firstName, lastName, email].some((x) => x === ""));
            if ([firstName, lastName, email].some((x) => x === "")) {
                setRows(rows.filter((row) => row.id !== id));
                throw id;
            }
            await createNewInfluencer({
                data: { firstName: `${firstName}`, lastName: `${lastName}`, email: `${email}` },
            });
        }
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        updateInfluencer({
            data: {
                id: `$${id}`,
                firstName: `${firstName}`,
                lastName: `${lastName}`,
                email: `${email}`,
            },
        });
        return updatedRow;
    }
    function handleProcessRowUpdateError(error: any) {
        console.log(error);
    }

    function handleRowModesModelChange(newRowModesModel: GridRowModesModel) {
        setRowModesModel(newRowModesModel);
    }
    function handleRowEditStop(props: GridRowParams) {
        // console.log(props);
        const { id } = props;
        const entry = rows.find((x) => x.id === id);
        console.log({ entry });
        if (!entry) return;
        const { firstName, lastName, email } = entry;
    }
    // const { tokens } =
    useEffect(() => {
        console.log("subscribing to updates");
        let sub: Subscription;
        try {
            if (authStatus !== "authenticated") return;
            sub = client.models.InfluencerPublic?.observeQuery().subscribe(async ({ items }) => {
                console.log(items);
                const details = await Promise.all(
                    items.map(async (x) => {
                        const { data: details } = await x.details();
                        const influencer = { ...x, email: details?.email, isNew: false };
                        return influencer;
                    }),
                );
                console.log(details);
                setRows([...details]);
                setInfluencer([...items]);
            });
            console.log(sub);
        } catch (error) {
            console.log("error", error);
        }

        return () => sub?.unsubscribe();
    }, [client]);

    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, [user]);

    if (influencer.length === 0) return <span>Keine Influenzerdaten vorhanden</span>;
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{
                toolbar: EditToolbar,
            }}
            slotProps={{
                toolbar: { setRows, setRowModesModel },
            }}
            autoHeight={true}
            sx={{
                m: 2,
                background: "lightgray",
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
