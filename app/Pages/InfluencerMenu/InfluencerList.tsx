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
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
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
import CreateInfluencerDialog from "./CreateNewInfluencer";

import { deDE } from "@mui/x-data-grid";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { deDE as coreDeDE } from "@mui/material/locale";
import { DialogOptions, DialogProps, RowDataInfluencer } from "@/app/Definitions/types";

const client = generateClient<Schema>();
const theme = createTheme({}, { deDE, pickersDeDE, coreDeDE });

interface EditToolbarProps {
    setDialogOptions: (props: DialogOptions<RowDataInfluencer>) => any;
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
    const { setDialogOptions } = props;
    function handleClick() {
        setDialogOptions({ open: true });
    }
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Neuer Influencer
            </Button>
        </GridToolbarContainer>
    );
}

function InfluencerList(props: {}) {
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [rows, setRows] = useState<RowDataInfluencer[]>();
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

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
    const [dialogOtions, setDialogOptions] = useState<DialogOptions<RowDataInfluencer>>({
        open: false,
    });

    const [dialogProps, setDialogProps] = useState<DialogProps<RowDataInfluencer>>({
        rows: rows ?? [],
        setRows,
        onClose: () => setDialogOptions({ open: false }),
        columns,
        excludeColumns: ["id"],
    });

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const [groups, setGroups] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);

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
                        const influencer = { ...x, email: details?.email ?? "", isNew: false };
                        return influencer;
                    }),
                );
                console.log(details);
                setRows([...details]);
            });
            console.log(sub);
        } catch (error) {
            console.log("error", error);
        }

        return () => sub?.unsubscribe();
    }, [client]);
    useEffect(() => {
        const dialogPropsNew = { ...dialogProps };
        dialogPropsNew.rows = rows ?? [];
        setDialogProps(dialogPropsNew);

        return () => {};
    }, [rows]);

    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, [user]);
    function handleEditClick(id: GridRowId) {
        return () => {
            const editingData = rows?.find((x) => x.id === id);
            if (!editingData) return;
            setDialogOptions({ open: true, editing: true, editingData });
        };
        // return () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }

    function handleDeleteClick(id: GridRowId) {
        return () => {
            const entity = rows?.find((x) => x.id === id);
            if (!entity) return;
            console.log({ entity });
            const { id: publicId, influencerPublicDetailsId: privateId } = entity;
            if (!(publicId && privateId)) return;
            deleteInfluencer({
                publicId,
                privateId,
            });
            setRows(rows?.filter((row) => row.id !== id));
        };
    }
    return (
        <>
            {<CreateInfluencerDialog {...dialogOtions} {...dialogProps} />}
            <ThemeProvider theme={theme}>
                <DataGrid
                    localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                    rows={rows ?? []}
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
                        toolbar: { setDialogOptions },
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
