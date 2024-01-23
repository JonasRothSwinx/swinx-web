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
import CampaignDialog from "./CampaignDialog";
import {
    DialogOptions,
    DialogProps,
    RowDataInfluencer,
    WebinarCampaign,
} from "@/app/Definitions/types";
import { deDE } from "@mui/x-data-grid";

const client = generateClient<Schema>();

type DialogType = WebinarCampaign;

interface EditToolbarProps {
    setDialogOptions: (props: DialogOptions<DialogType>) => any;
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
                Neue Kampagne
            </Button>
        </GridToolbarContainer>
    );
}

function WebinarList(props: {}) {
    const [influencers, setInfluencers] = useState<RowDataInfluencer[]>([]);
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [rows, setRows] = useState<DialogType[]>();
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
            field: "customer",
            headerName: "Kunde",
            flex: 2,
            headerAlign: "center",
            align: "center",
            type: "string",
        },
        {
            field: "influencers",
            headerName: "Influencer",
            flex: 2,

            headerAlign: "center",
            align: "center",
            type: "string",
        },
        {
            field: "nextSteps",
            headerName: "Nächste Schritte",
            flex: 3,

            headerAlign: "center",
            align: "center",
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
                    // <GridActionsCellItem
                    //     icon={<DeleteIcon />}
                    //     label="Delete"
                    //     onClick={handleDeleteClick(id)}
                    //     color="inherit"
                    // />,
                ];
            },
        },
    ];
    const [dialogOtions, setDialogOptions] = useState<DialogOptions<DialogType>>({
        open: false,
    });

    const [dialogProps, setDialogProps] = useState<DialogProps<DialogType>>({
        rows: rows ?? [],
        setRows,
        onClose: () => setDialogOptions({ open: false }),
        columns,
        excludeColumns: ["id"],
    });

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    // const [groups, setGroups] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        console.log("subscribing to influencer updates");
        let sub: Subscription;
        try {
            if (authStatus !== "authenticated") return;
            sub = client.models.InfluencerPublic?.observeQuery().subscribe(async ({ items }) => {
                console.log(items);
                const details = await Promise.all(
                    items.map(async (x) => {
                        const { data: details } = await x.details();
                        const influencer: RowDataInfluencer = {
                            ...x,
                            email: details?.email ?? "",
                            isNew: false,
                        };
                        return influencer;
                    }),
                );
                console.log(details);
                setInfluencers([...details]);
            });
            console.log(sub);
        } catch (error) {
            console.log("error", error);
        }

        return () => sub?.unsubscribe();
    }, [client]);
    useEffect(() => {
        console.log("subscribing to camapign updates");
        let sub: Subscription;
        try {
            if (authStatus !== "authenticated") return;
            sub = client.models.Webinar?.observeQuery().subscribe(async ({ items }) => {
                console.log(items);
                const details = await Promise.all(
                    items.map(async (x) => {
                        return x;
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

    // useEffect(() => {
    //     getUserGroups().then((result) => setGroups(result));
    //     return () => {};
    // }, [user]);
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
            // const entity = rows?.find((x) => x.id === id);
            // if (!entity) return;
            // console.log({ entity });
            // const { id: publicId, influencerPublicDetailsId: privateId } = entity;
            // if (!(publicId && privateId)) return;
            // deleteInfluencer({
            //     publicId,
            //     privateId,
            // });
            // setRows(rows.filter((row) => row.id !== id));
        };
    }
    // const { tokens } =

    // if (influencers.length === 0) return <span>Keine Influenzerdaten vorhanden</span>;
    return (
        <>
            {<CampaignDialog {...dialogOtions} {...dialogProps} />}
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

export default WebinarList;
