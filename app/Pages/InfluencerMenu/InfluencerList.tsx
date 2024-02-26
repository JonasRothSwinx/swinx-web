import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { randomId, randomName, randomUserName } from "@mui/x-data-grid-generator";
import { Button, TextField, ThemeProvider, createTheme } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import Influencer from "@/app/ServerFunctions/types/influencer";
import InfluencerDialog from "../Dialogs/InfluencerDialog";

import { deDE } from "@mui/x-data-grid";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { deDE as coreDeDE } from "@mui/material/locale";
import { DialogOptions, DialogConfig } from "@/app/Definitions/types";
import dbInterface, { influencers } from "@/app/ServerFunctions/dbInterface";
import { range } from "@/app/Definitions/utility";
import { InfluencerDataNew, updateInfluencer } from "@/app/ServerFunctions/database/influencers";
import { uniqueNamesGenerator, Config, animals, names, colors } from "unique-names-generator";

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
    initiateUpdate: (props: updateInfluencerProps) => void;
    setRows: (rows: Influencer.InfluencerFull[]) => void;
}
function EditToolbar(props: EditToolbarProps) {
    const { setIsOpen, initiateUpdate, setRows } = props;
    function handleClick() {
        setIsOpen(true);
    }
    function createRandom() {
        const amount = parseInt(prompt("Anzahl Influencer") ?? "");
        for (const _ of range(amount)) {
            const influencer: InfluencerDataNew = {
                firstName: uniqueNamesGenerator({ dictionaries: [names], length: 1 }),
                lastName: uniqueNamesGenerator({ dictionaries: [names, animals, colors], length: 2, separator: "" }),
                email: "jonasroth1@gmail.com",
            };
            dbInterface.influencer.create({ data: influencer });
            console.log(influencer);
        }
        initiateUpdate({ setInfluencers: setRows });
    }
    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Neuer Influencer
            </Button>
            <Button color="primary" startIcon={<AddIcon />} onClick={createRandom}>
                Erstelle Influencer
            </Button>
        </GridToolbarContainer>
    );
}
// const selectionSet = ["id", "details.id", "details.email"] as const;
interface updateInfluencerProps {
    setInfluencers: (influencers: Influencer.InfluencerFull[]) => void;
}
function updateInfluencers(props: updateInfluencerProps) {
    dbInterface.influencer.list().then((result) => {
        props.setInfluencers(result);
    });
}
function InfluencerList(props: {}) {
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [rows, setRows] = useState<Influencer.InfluencerFull[] | undefined>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isOpen, setIsOpen] = useState(false);
    const [editingData, setEditingData] = useState<Influencer.InfluencerFull>();

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
                return row.details.email;
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
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={"deleteAction"}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    const [dialogOtions, setDialogOptions] = useState<DialogOptions>({});

    const [dialogProps, setDialogProps] = useState<DialogConfig<Influencer.InfluencerFull[]>>({
        parent: rows ?? [],
        setParent: setRows,
        onClose: () => {
            setIsOpen(false);
            setEditingData(undefined);
            influencers.list().then((items) =>
                setRows((prev) => {
                    console.log("ChangingRows", { prev, items });
                    return items;
                })
            );
        },
    });

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    const [groups, setGroups] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        updateInfluencers({ setInfluencers: setRows });
        return () => {};
    }, []);

    useEffect(() => {
        const dialogPropsNew = { ...dialogProps };
        dialogPropsNew.parent = rows ?? [];
        setDialogProps(dialogPropsNew);

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));
        return () => {};
    }, [user]);
    function handleEditClick(id: GridRowId) {
        return () => {
            const editingData = rows?.find((x) => x.id === id);
            if (!editingData) return;
            setIsOpen(true);
            setDialogOptions({ editing: true });
            setEditingData(editingData);
        };
        // return () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }

    function handleDeleteClick(id: GridRowId) {
        return () => {
            const entity = rows?.find((x) => x.id === id);
            if (!entity) return;
            console.log({ entity });
            const { id: publicId } = entity;
            const { id: privateId } = entity.details;
            if (!(publicId && privateId)) return;
            influencers.delete({
                publicId,
                privateId,
            });
            setRows(rows?.filter((row) => row.id !== id));
        };
    }
    return (
        <>
            {isOpen && (
                <InfluencerDialog
                    {...dialogOtions}
                    {...dialogProps}
                    // isOpen={true}
                    editingData={editingData}
                />
            )}
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
                        toolbar: { setIsOpen, initiateUpdate: updateInfluencers, setRows },
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
