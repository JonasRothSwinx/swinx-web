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
import Influencer from "@/app/ServerFunctions/types/influencer";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import CampaignDialog from "../Dialogs/CampaignDialog";
import { DialogOptions, DialogConfig } from "@/app/Definitions/types";
import { deDE } from "@mui/x-data-grid";
import CustomerDialog from "../Dialogs/CustomerDialog";
// import WebinarDialog from "../Dialogs/WebinarDialog";
import TimeLineEventDialog from "../Dialogs/TimelineEventDialog";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";
import stylesExporter from "../styles/stylesExporter";
import CampaignDetails from "../CampaignDetails/CampaignDetails";
import { randomId } from "@mui/x-data-grid-generator";
import { influencers, campaigns } from "@/app/ServerFunctions/dbInterface";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
const styles = stylesExporter.dialogs;

const client = generateClient<Schema>();

type DialogType = Campaign.Campaign[];

interface EditToolbarProps {
    setIsOpen: Dispatch<SetStateAction<DialogState>>;
}
// enum Dialogs {
//     campaign,
//     customer,
//     webinar,
//     influencer,
// }

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
    details: boolean;
};
const allDialogsClosed: DialogState = {
    campaign: false,
    customer: false,
    webinar: false,
    timelineEvent: false,
    details: false,
};
type EditableDataTypes = Campaign.Campaign | Customer.Customer | TimelineEvent.TimelineEvent;
type CampaignListProps = {};

function CampaignList(props: CampaignListProps) {
    const {} = props;
    const [influencerData, setInfluencerData] = useState<Influencer.InfluencerFull[]>([]);
    const [campaignData, setCampaignData] = useState<Campaign.Campaign[]>();
    const [editingData, setEditingData] = useState<EditableDataTypes>();
    const [groupBy, setGroupBy] = useState<groupBy>("day");
    const [isOpen, setIsOpen] = useState<DialogState>(allDialogsClosed);
    const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
    const [dialogConfig, setDialogConfig] = useState<DialogConfig<DialogType>>({
        parent: campaignData ?? [],
        setParent: setCampaignData,
        onClose: onDialogClose,
    });

    const ClickHandlers = {
        editCustomer: (id: GridRowId) => {
            return () => {
                const customer = campaignData?.find((campaign) => campaign.id === id)?.customer;
                if (!customer) return;
                setEditingData({ ...customer });
                setDialogOptions({ editing: true });
                setIsOpen((prev) => ({ ...prev, customer: true }));
            };
        },
        // editWebinar: (id: GridRowId) => {
        //     return () => {
        //         const campaign = campaignData?.find((campaign) => campaign.id === id);
        //         if (!(campaign && Campaign.isWebinar(campaign))) return;
        //         const webinar = campaign.webinar;
        //         setIsOpen((prev) => ({ ...prev, webinar: true }));
        //         setEditingData(webinar);
        //         setDialogOptions({ editing: true });
        //     };
        // },
        showTimeline: (id: GridRowId) => {
            return () => {
                const campaign = campaignData?.find((campaign) => campaign.id === id);
                if (!campaign) return;
                setIsOpen((prev) => ({ ...prev, details: true }));
                setEditingData(campaign);
            };
        },
        addTimeline: (id: GridRowId) => {
            return () => {
                const campaign = campaignData?.find((campaign) => campaign.id === id);
                if (!campaign) return;
                setIsOpen((prev) => ({ ...prev, timelineEvent: true }));
                setDialogOptions({ campaignId: campaign.id });
            };
        },
        editInfluencer: (id: GridRowId) => {
            return () => {
                // const campaign = campaigns?.find((campaign) => campaign.id === id);
                // if (!campaign) return;
                // setDialog(Dialogs.influencer);
                // setDialogOptions({ open: true, editing: true, editingData });
            };
        },
    };

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
                const customer: Customer.Customer = params.row.customer;
                return `${customer.firstName} ${customer.lastName}`;
            },
            renderCell(params) {
                const customer: Customer.Customer = params.row.customer;
                return (
                    <div key={params.row.customer.id ?? "new"}>
                        <Typography>{customer.company}</Typography>
                        <br />
                        <Typography>{params.value}</Typography>
                        {customer.companyPosition ? <Typography>({customer.companyPosition})</Typography> : <></>}
                    </div>
                );
            },
        },
        // {
        //     field: "webinar",
        //     headerName: "Webinar",
        //     headerAlign: "center",
        //     type: "dateTime",
        //     width: 200,
        //     valueGetter: ({ row }: { row: Campaign.WebinarCampaign }) => {
        //         const date = new Date(row.webinar.date);
        //         return date;
        //     },
        //     renderCell: (params) => {
        //         const date: Date = params.value;
        //         return [
        //             <div key={params.id} className={styles.cellActionSplit}>
        //                 <div>
        //                     <Typography>{params.row.webinar.title}</Typography>
        //                     <br />
        //                     <Typography>{date.toLocaleString()}</Typography>
        //                 </div>
        //                 <div>
        //                     <IconButton
        //                         className="textPrimary"
        //                         onClick={ClickHandlers.editWebinar(params.id)}
        //                         color="inherit"
        //                     >
        //                         <EditIcon />
        //                     </IconButton>
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
                                setCampaign={() => {}}
                                influencers={influencerData}
                                maxItems={2}
                                groupBy={groupBy}
                                campaign={row}
                                orientation="horizontal"
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
        // {
        //     field: "actions",
        //     type: "actions",
        //     // headerName: "Aktionen",
        //     width: 150,
        //     // cellClassName: "actions",
        //     renderCell: ({ id }) => {
        //         return (
        //             <div className={styles.actions}>
        //                 <Button variant="outlined" color="inherit" onClick={ClickHandlers.addTimeline(id)}>
        //                     <AddIcon />
        //                     <Typography variant="body1">Ereignis</Typography>
        //                 </Button>
        //                 <Button variant="outlined" color="inherit" onClick={ClickHandlers.showTimeline(id)}>
        //                     <VisibilityIcon />
        //                     <Typography variant="body1">Timeline</Typography>
        //                 </Button>
        //                 <Button variant="outlined" color="inherit" onClick={ClickHandlers.showTimeline(id)}>
        //                     <DeleteIcon color="error" />
        //                     <Typography color="error" variant="body1">
        //                         Löschen
        //                     </Typography>
        //                 </Button>
        //             </div>
        //             // <GridActionsCellItem
        //             //     icon={<AddIcon />}
        //             //     label="Ereignis"
        //             //     content="Test"
        //             //     className="textPrimary"
        //             //     // onClick={handleEditClick(id)}
        //             //     color="inherit"
        //             // />,
        //             // <GridActionsCellItem
        //             //     icon={<DeleteIcon />}
        //             //     label="Delete"
        //             //     // onClick={handleDeleteClick(id)}
        //             //     color="inherit"
        //             // />,
        //         );
        //     },
        // },
    ];
    //#region useEffects
    useEffect(() => {
        const id = randomId();
        console.log(id, "requesting influencers");
        influencers.list().then((items) => {
            console.log(id, "Setting influencers to", items);
            setInfluencerData(items);
        });
        return () => {};
    }, [/* client,  */ campaignData]);
    useEffect(() => {
        updateCampaigns();

        return () => {};
    }, []);
    useEffect(() => {
        // const dialogPropsNew = { ...dialogProps };
        // dialogPropsNew.rows = rows ?? [];
        setDialogConfig((prev) => ({ ...prev, parent: campaignData ?? [] }));

        return () => {};
    }, [campaignData]);
    //#endregion
    function onDialogClose(hasChanged?: boolean) {
        // console.log("Hi!");
        setEditingData(undefined);
        setIsOpen(allDialogsClosed);
        if (hasChanged) {
            console.log("Updating Campaign Data");
            updateCampaigns();
        }
    }

    async function updateCampaigns() {
        // console.log("Starting Update");
        campaigns.list().then((res) => {
            // console.log("received Update");
            setCampaignData(res.data);
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

    // if (influencers.length === 0) return <span>Keine Influenzerdaten vorhanden</span>;
    return (
        <>
            {/* Dialogs */}
            <>
                <CampaignDialog
                    {...dialogConfig}
                    {...dialogOptions}
                    isOpen={isOpen.campaign}
                    editingData={editingData as Campaign.Campaign}
                />
                {/* <WebinarDialog
                    {...dialogConfig}
                    {...dialogOptions}
                    isOpen={isOpen.webinar}
                    editingData={editingData as Webinar}
                /> */}
                <CampaignDetails onClose={onDialogClose} campaignId={editingData?.id ?? ""} isOpen={isOpen.details} />
            </>
            <DataGrid
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                onRowClick={({ id }) => {
                    ClickHandlers.showTimeline(id)();
                }}
                disableRowSelectionOnClick
                rows={campaignData ?? []}
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
