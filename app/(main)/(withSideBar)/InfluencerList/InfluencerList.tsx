import { Schema } from "@/amplify/data/resource";
import { InfluencerDialog } from "@/app/Components";
import { LoadingElement } from "@/app/Components/Loading";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { Influencers } from "@/app/ServerFunctions/types";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Add as AddIcon, DeleteOutlined as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Box, Button, CircularProgress, SxProps, ThemeProvider, Typography, createTheme } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
    GridRowModesModel,
    GridToolbar,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { generateClient } from "aws-amplify/api";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { range } from "@/app/Definitions/utility";
import { dataClient } from "@dataClient";
import { deDE as coreDeDE } from "@mui/material/locale";
import { deDE } from "@mui/x-data-grid/locales";
import { deDE as pickersDeDE } from "@mui/x-date-pickers/locales";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { animals, colors, names, uniqueNamesGenerator } from "unique-names-generator";
import { GridToolbarDensitySelector } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

const theme = createTheme({}, { deDE, pickersDeDE, coreDeDE });

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides extends EditToolbarProps {
        _: "";
    }
}

interface EditToolbarProps {
    setOpenDialog: Dispatch<SetStateAction<dialogType>>;
    initiateUpdate: () => void;
    setRows: (rows: Influencers.Full[]) => void;
    queryClient: QueryClient;
    isPending?: boolean;
}
function EditToolbar(props: EditToolbarProps) {
    const { setOpenDialog, initiateUpdate, setRows, queryClient, isPending } = props;
    function handleClick() {
        setOpenDialog("influencer");
    }
    const sx: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            "#filterButton": { marginLeft: "auto" },
        },
    };
    return (
        <GridToolbarContainer sx={sx}>
            <Button id="addInfluencer" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Neuer Influencer
            </Button>
            {/* <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => createRandomInfluencers(queryClient)}
                >
                Erstelle Influencer
                </Button> */}
            {isPending && <CircularProgress id="loading" />}
            <GridToolbarFilterButton slotProps={{ button: { id: "filterButton" } }} />
        </GridToolbarContainer>
    );
}

type dialogType = "influencer" | "none";

function InfluencerList() {
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const queryClient = useQueryClient();
    const [rows, setRows] = useState<Influencers.Full[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [openDialog, setOpenDialog] = useState<dialogType>("none");
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
                setOpenDialog("influencer");
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
    const Dialogs: { [key in dialogType]: () => React.JSX.Element | null } = {
        influencer: () => (
            <InfluencerDialog
                parent={rows}
                setParent={setRows}
                editing={editing}
                onClose={() => {
                    setOpenDialog("none");
                    setEditingData(undefined);
                    influencers.refetch();
                }}
                editingData={editingData}
            />
        ),
        none: () => <></>,
    };

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
            flex: 1,
            type: "string",
            hideable: true,
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
            // valueGetter: (value: Influencers.Full, row, params, apiRef) => {
            //     // console.log({ value, row, params, apiRef });
            //     const influencer = row as Influencers.Full;
            //     return row.email;
            // },
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
    const { data } = useDemoData({
        dataSet: "Employee",
        rowLength: 100,
        maxColumns: 6,
    });
    const sx: SxProps = {
        "&": {
            m: 2,
            background: "white",
            flex: 1,

            ".MuiDataGrid-main": {
                height: "100%",
                maxHeight: "100%",
            },
            ".MuiDataGrid-cell": {
                // color: "primary.main",
                borderLeft: "1px solid black",
            },
            ".MuiDataGrid-cell:first-of-type": {
                // color: "primary.main",
                borderLeft: "none",
            },
            ".MuiDataGrid-cell--editing:has(.Mui-error)": {
                border: "1px solid red",
                backgroundColor: "red",
                color: "#ff4343",
            },
        },
    };
    if (influencers.isLoading) return LoadingElement({ textMessage: "Lade Influencer", hideLogo: true });
    return (
        <Box id="influencerListContainer" sx={sx}>
            {Dialogs[openDialog]()}
            <ThemeProvider theme={theme}>
                <DataGrid
                    localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                    rows={influencers.data ?? []}
                    columns={columns}
                    // {...data}

                    // rowModesModel={rowModesModel}
                    // onRowModesModelChange={handleRowModesModelChange}
                    // onRowEditStop={handleRowEditStop}
                    // processRowUpdate={processRowUpdate}
                    // onProcessRowUpdateError={handleProcessRowUpdateError}
                    slots={{
                        // toolbar: CustomToolbar,
                        // toolbar: GridToolbar,
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: {
                            setOpenDialog,
                            initiateUpdate: influencers.refetch,
                            setRows,
                            queryClient,
                            isPending: influencers.isFetching,
                        },
                    }}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                    // pageSizeOptions={[5, 10, 20, 50, 100]}
                    autoPageSize
                    // autoHeight={true}
                />
            </ThemeProvider>
        </Box>
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
