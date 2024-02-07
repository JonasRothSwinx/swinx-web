import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridToolbarContainer,
    GridToolbar,
    GridCellParams,
    GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { Button, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
    Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
    listInfluencers,
    listCampaigns,
    deleteCampaign,
} from "@/app/ServerFunctions/serverActions";
import { Influencer, TimelineEvent, Webinar } from "@/app/ServerFunctions/databaseTypes";
import CampaignDialog from "../Dialogs/CampaignDialog";
import { DialogOptions, DialogConfig } from "@/app/Definitions/types";
import { Campaign, Customer } from "@/app/ServerFunctions/databaseTypes";
import { deDE } from "@mui/x-data-grid";
import CustomerDialog from "../Dialogs/CustomerDialog";
import WebinarDialog from "../Dialogs/WebinarDialog";
import TimeLineEventDialog from "../Dialogs/TimelineEventDialog";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";
import stylesExporter from "../styles/stylesExporter";

const styles = stylesExporter.dialogs;

const client = generateClient<Schema>();

type DialogType = Campaign.Campaign;

interface EditToolbarProps {
    setIsOpen: Dispatch<SetStateAction<DialogState>>;
}
enum Dialogs {
    campaign,
    customer,
    webinar,
    influencer,
}

function EditToolbar(props: EditToolbarProps) {
    const { setIsOpen } = props;
    function handleClick() {
        setIsOpen((prev: DialogState) => ({ ...prev, campaign: true } satisfies DialogState));
    }
    return (
        <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Neue Kampagne
            </Button>
            <GridToolbar />
        </GridToolbarContainer>
    );
}
type DialogState = {
    campaign: boolean;
    customer: boolean;
    webinar: boolean;
    timelineEvent: boolean;
};
type EditableDataTypes = Campaign.Campaign | Customer | Webinar | TimelineEvent.TimelineEvent;
type CampaignListProps = {};

function CampaignList(props: CampaignListProps) {
    const {} = props;
    const [influencers, setInfluencers] = useState<Influencer.InfluencerWithName[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign.Campaign[]>();
    const [editingData, setEditingData] = useState<EditableDataTypes>();
    const [groupBy, setGroupBy] = useState<groupBy>("day");
    const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
    const [isOpen, setIsOpen] = useState<DialogState>({
        campaign: false,
        customer: false,
        webinar: false,
        timelineEvent: false,
    });
    const [dialogConfig, setDialogConfig] = useState<DialogConfig<DialogType>>({
        rows: campaigns ?? [],
        setRows: setCampaigns,
        onClose: onDialogClose,
    });
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            // width: 100,
            // flex: 1,
            type: "string",
        },
        {
            field: "customer",
            headerName: "Kunde",
            flex: 1,
            minWidth: 100,
            headerAlign: "center",
            align: "center",
            type: "string",
            maxWidth: 300,
            valueGetter(params) {
                // console.log(params);
                const customer: Customer = params.row.customer;
                return `${customer.firstName} ${customer.lastName}`;
            },
            renderCell(params) {
                const customer: Customer = params.row.customer;
                return [
                    <div key={params.id} className={styles.cellActionSplit}>
                        <div>
                            <Typography>{customer.company}</Typography>
                            <br />
                            <Typography>{params.value}</Typography>
                            {customer.companyPosition ? (
                                <Typography>({customer.companyPosition})</Typography>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div>
                            <IconButton
                                className="textPrimary"
                                onClick={handleEditClickCustomer(params.id)}
                                color="inherit"
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    </div>,
                ];
            },
        },
        {
            field: "webinar",
            headerName: "Webinar",
            headerAlign: "center",
            type: "dateTime",
            width: 200,
            valueGetter: ({ row }: { row: Campaign.WebinarCampaign }) => {
                const date = new Date(row.webinar.date);
                return date;
            },
            renderCell: (params) => {
                const date: Date = params.value;
                return [
                    <div key={params.id} className={styles.cellActionSplit}>
                        <div>
                            <Typography>{params.row.webinar.title}</Typography>
                            <br />
                            <Typography>{date.toLocaleString()}</Typography>
                        </div>
                        <div>
                            <IconButton
                                className="textPrimary"
                                onClick={handleEditClickWebinar(params.id)}
                                color="inherit"
                            >
                                <EditIcon />
                            </IconButton>
                        </div>
                    </div>,
                ];
            },
        },
        // {
        //     field: "influencers",
        //     headerName: "Influencer",
        //     flex: 2,
        //     headerAlign: "center",
        //     align: "center",
        //     type: "string",
        //     renderCell({ id, row }: { id: GridRowId; row: Campaign.WebinarCampaign }) {
        //         return [
        //             <div key={id} className={styles.cellActionSplit}>
        //                 <div>
        //                     <Typography>{}</Typography>
        //                     <br />
        //                     <Typography>{}</Typography>
        //                 </div>
        //                 <div>
        //                     <GridActionsCellItem
        //                         icon={<AddIcon />}
        //                         label="Edit"
        //                         className="textPrimary"
        //                         onClick={handleAddClickTimeline(id)}
        //                         color="inherit"
        //                     />
        //                 </div>
        //             </div>,
        //         ];
        //     },
        // },
        {
            field: "nextSteps",
            headerName: "Nächste Schritte",
            flex: 3,

            headerAlign: "center",
            align: "center",
            sortable: false,
            disableColumnMenu: true,
            renderHeader: (params: GridColumnHeaderParams) => {
                return (
                    <>
                        <Typography>{params.colDef.headerName}</Typography>
                        <div style={{ width: "10px" }} />
                        <TextField
                            select
                            label={"Gruppieren nach"}
                            SelectProps={{
                                sx: { minWidth: "15ch" },
                                onChange: (e) => {
                                    setGroupBy(e.target.value as groupBy);
                                },
                                value: groupBy,
                            }}
                        >
                            <MenuItem value={"day"}>Tag</MenuItem>
                            <MenuItem value={"week"}>Woche</MenuItem>
                        </TextField>
                    </>
                );
            },

            renderCell: (params: GridCellParams) => {
                const row: Campaign.Campaign = params.row;
                return (
                    <div
                        className={`${styles.cellActionSplit} ${styles.timeline}`}
                        // style={{ display: "flex", flexDirection: "column", flexBasis: "100%" }}
                    >
                        <div>
                            <TimelineView
                                eventDialogProps={{
                                    ...dialogConfig,
                                    ...dialogOptions,
                                    influencers,
                                    isOpen: false,
                                }}
                                maxItems={2}
                                groupBy={groupBy}
                                events={row.campaignTimelineEvents}
                            />
                        </div>
                        {/* <div style={{ justifyContent: "flex-end" }}>
                            <Button variant="outlined" color="inherit" onClick={handleAddClickTimeline(row.id)}>
                                <AddIcon />
                                <Typography variant="body1">Neu</Typography>
                            </Button>
                        </div> */}
                    </div>
                );
            },
        },
        {
            field: "actions",
            type: "actions",
            // headerName: "Aktionen",
            width: 150,
            // cellClassName: "actions",
            renderCell: ({ id }) => {
                return (
                    <div className={styles.actions}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleAddClickTimeline(id)}
                        >
                            <AddIcon />
                            <Typography variant="body1">Ereignis</Typography>
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={handleDeleteClick(id)}>
                            <DeleteIcon color="error" />
                            <Typography color="error" variant="body1">
                                Löschen
                            </Typography>
                        </Button>
                        ,
                    </div>
                    // <GridActionsCellItem
                    //     icon={<AddIcon />}
                    //     label="Ereignis"
                    //     content="Test"
                    //     className="textPrimary"
                    //     // onClick={handleEditClick(id)}
                    //     color="inherit"
                    // />,
                    // <GridActionsCellItem
                    //     icon={<DeleteIcon />}
                    //     label="Delete"
                    //     // onClick={handleDeleteClick(id)}
                    //     color="inherit"
                    // />,
                );
            },
        },
    ];

    useEffect(() => {
        listInfluencers().then((items) => setInfluencers(items));
        return () => {};
    }, [/* client,  */ campaigns]);
    useEffect(() => {
        updateCampaigns();

        return () => {};
    }, []);
    useEffect(() => {
        // const dialogPropsNew = { ...dialogProps };
        // dialogPropsNew.rows = rows ?? [];
        setDialogConfig((prev) => ({ ...prev, rows: campaigns ?? [] }));

        return () => {};
    }, [campaigns]);

    function onDialogClose(hasChanged?: boolean) {
        // console.log("Hi!");
        setEditingData(undefined);
        const newOpenState: DialogState = {
            ...(Object.keys(isOpen).reduce(
                (reduced, key) => ({ ...reduced, [key]: false }),
                {},
            ) as DialogState),
        };
        setIsOpen(newOpenState);
        if (hasChanged) {
            updateCampaigns();
        }
    }

    async function updateCampaigns() {
        // console.log("Starting Update");
        listCampaigns().then((res) => {
            // console.log("received Update");
            setCampaigns(res.data);
        });
    }

    // function handleEditClick(id: GridRowId, dialogType: Dialogs) {
    //     return () => {
    //         const editingData = campaigns?.find((campaign) => campaign.id === id);
    //         if (!editingData) return;
    //         setIsOpen((prev) => ({ ...prev, campaign: true }));
    //         setDialogOptions({ editing: true, editingData });
    //     };
    //     // return () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    // }
    function handleEditClickCustomer(id: GridRowId) {
        return () => {
            // debugger;
            const customer = campaigns?.find((campaign) => campaign.id === id)?.customer;
            if (!customer) return;
            setEditingData({ ...customer });
            setDialogOptions({ editing: true });
            setIsOpen((prev) => ({ ...prev, customer: true }));
        };
    }
    function handleEditClickWebinar(id: GridRowId) {
        return () => {
            const campaign = campaigns?.find((campaign) => campaign.id === id);
            if (!(campaign && Campaign.isWebinar(campaign))) return;
            const webinar = campaign.webinar;
            setIsOpen((prev) => ({ ...prev, webinar: true }));
            setEditingData(webinar);
            setDialogOptions({ editing: true });
        };
    }

    function handleAddClickTimeline(id: GridRowId) {
        return () => {
            const campaign = campaigns?.find((campaign) => campaign.id === id);
            if (!campaign) return;
            setIsOpen((prev) => ({ ...prev, timelineEvent: true }));
            setDialogOptions({ campaignId: campaign.id });
        };
    }

    function handleEditClickInfluencer(id: GridRowId) {
        return () => {
            // const campaign = campaigns?.find((campaign) => campaign.id === id);
            // if (!campaign) return;
            // setDialog(Dialogs.influencer);
            // setDialogOptions({ open: true, editing: true, editingData });
        };
    }

    function handleDeleteClick(id: GridRowId) {
        return () => {
            if (!confirm("Kampagne wirklich unwiderruflich löschen?")) return;
            const campaign = campaigns?.find((x) => x.id === id);
            if (!campaign) return;
            deleteCampaign(campaign);
            setCampaigns([...(campaigns?.filter((x) => x.id !== id) ?? [])]);
            updateCampaigns();
        };
    }
    function showTimeline(id: GridRowId) {}
    // const { tokens } =

    // if (influencers.length === 0) return <span>Keine Influenzerdaten vorhanden</span>;
    return (
        <>
            <>
                {
                    <CampaignDialog
                        {...dialogConfig}
                        {...dialogOptions}
                        isOpen={isOpen.campaign}
                        editingData={editingData as Campaign.Campaign}
                    />
                }
                {
                    <CustomerDialog
                        {...dialogConfig}
                        {...dialogOptions}
                        isOpen={isOpen.customer}
                        editingData={editingData as Customer}
                    />
                }
                {
                    <WebinarDialog
                        {...dialogConfig}
                        {...dialogOptions}
                        isOpen={isOpen.webinar}
                        editingData={editingData as Webinar}
                    />
                }
                {
                    <TimeLineEventDialog
                        {...dialogConfig}
                        {...dialogOptions}
                        isOpen={isOpen.timelineEvent}
                        influencers={influencers}
                        editingData={editingData as TimelineEvent.TimelineEvent}
                    />
                }
            </>
            <DataGrid
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                disableRowSelectionOnClick
                rows={campaigns ?? []}
                columns={columns}
                initialState={{ columns: { columnVisibilityModel: { id: false } } }}
                getRowHeight={() => "auto"}
                columnHeaderHeight={80}
                // rowModesModel={rowModesModel}
                // onRowModesModelChange={handleRowModesModelChange}
                // onRowEditStop={handleRowEditStop}
                // processRowUpdate={processRowUpdate}
                // onProcessRowUpdateError={handleProcessRowUpdateError}
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setIsOpen },
                }}
                autoHeight={true}
                sx={{
                    m: 2,
                    background: "lightgray",
                    "& .MuiDataGrid-columnHeaderTitleContainerContent": {
                        overflow: "visible",
                    },
                    "& .MuiDataGrid-actionsCell": {
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "column",
                    },
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
}

export default CampaignList;
