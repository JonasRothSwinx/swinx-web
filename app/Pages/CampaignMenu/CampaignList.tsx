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
import { Button, CircularProgress, IconButton, MenuItem, TextField, Typography } from "@mui/material";
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
import TimeLineEventDialog from "../Dialogs/TimelineEvent/TimelineEventSingleDialog";
import TimelineView from "../Timeline/TimeLineView";
import stylesExporter from "../styles/stylesExporter";
import CampaignDetails from "../CampaignDetails/CampaignDetails";
import { randomId } from "@mui/x-data-grid-generator";
import dbInterface from "@/app/ServerFunctions/database/.dbInterface";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { groupBy } from "../Timeline/Functions/groupEvents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const styles = stylesExporter.dialogs;

const client = generateClient<Schema>();

type DialogType = Campaign.Campaign[];

interface EditToolbarProps {
    setIsOpen: Dispatch<SetStateAction<DialogState>>;
    isLoading: boolean;
}
// enum Dialogs {
//     campaign,
//     customer,
//     webinar,
//     influencer,
// }

function EditToolbar(props: EditToolbarProps) {
    const { setIsOpen, isLoading } = props;
    function handleClick() {
        setIsOpen("campaign");
    }
    return (
        <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Neue Kampagne
                </Button>
                {isLoading && <CircularProgress sx={{ height: "20px", widtth: "20px" }} />}
            </div>

            <GridToolbar />
        </GridToolbarContainer>
    );
}
type DialogState = "none" | "customer" | "campaign" | "webinar" | "timelineEvent" | "details";
// type DialogState = {
//     campaign: boolean;
//     customer: boolean;
//     webinar: boolean;
//     timelineEvent: boolean;
//     details: boolean;
// };

type EditableDataTypes = Campaign.Campaign | Customer.Customer | TimelineEvent.Event;
type CampaignListProps = {};

function CampaignList(props: CampaignListProps) {
    const {} = props;
    const queryClient = useQueryClient();
    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: () => dbInterface.influencer.list(),
    });
    const campaigns = useQuery({
        queryKey: ["campaigns"],
        queryFn: async () => {
            const data = await dbInterface.campaign.list();
            data.map(async (campaign) => {
                queryClient.setQueryData(["campaign", campaign.id], campaign);
            });
            return data;
        },
        retry: 1,
    });
    // const [influencerData, setInfluencerData] = useState<Influencer.InfluencerFull[]>([]);
    // const [campaignData, setCampaignData] = useState<Campaign.Campaign[]>();
    const [editingData, setEditingData] = useState<EditableDataTypes>();
    const [groupBy, setGroupBy] = useState<groupBy>("day");
    const [isOpen, setIsOpen] = useState<DialogState>("none");
    const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
    const [dialogConfig, setDialogConfig] = useState<DialogConfig<DialogType>>({
        parent: campaigns.data ?? [],
        setParent: (campaigns: Campaign.Campaign[]) => {
            queryClient.setQueryData(["campaigns"], campaigns);
        },
        onClose: onDialogClose,
    });

    const ClickHandlers = {
        editCustomer: (id: GridRowId) => {
            return () => {
                const customer = campaigns.data?.find((campaign) => campaign.id === id)?.customer;
                if (!customer) return;
                setEditingData({ ...customer });
                setDialogOptions({ editing: true });
                setIsOpen("customer");
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
                const campaign = campaigns.data?.find((campaign) => campaign.id === id);
                if (!campaign) return;
                setIsOpen("details");
                setEditingData(campaign);
            };
        },
        addTimeline: (id: GridRowId) => {
            return () => {
                const campaign = campaigns.data?.find((campaign) => campaign.id === id);
                if (!campaign) return;
                setIsOpen("timelineEvent");
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
                return `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`;
            },
            renderCell(params) {
                const customer: Customer.Customer = params.row.customer;
                return (
                    <div key={params.row.customer?.id ?? "new"}>
                        <Typography>{customer?.company}</Typography>
                        <br />
                        <Typography>{params.value}</Typography>
                        {customer?.companyPosition ? <Typography>({customer?.companyPosition})</Typography> : <></>}
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
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flexBasis: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                        }}
                        className={`${styles.cellActionSplit} ${styles.timeline}`}
                        // style={{ display: "flex", flexDirection: "column", flexBasis: "100%" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flexBasis: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            {row.campaignTimelineEvents.length < 1 ? (
                                <Typography>Keine Ereignisse</Typography>
                            ) : (
                                <TimelineView
                                    setCampaign={() => {}}
                                    influencers={influencers.data ?? []}
                                    maxItems={2}
                                    groupBy={groupBy}
                                    campaign={row}
                                    orientation="horizontal"
                                />
                            )}
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
    // useEffect(() => {
    //     const id = randomId();
    //     // console.log(id, "requesting influencers");
    //     influencers.list().then((items) => {
    //         // console.log(id, "Setting influencers to", items);
    //         setInfluencerData(items);
    //     });
    //     return () => {};
    // }, [/* client,  */ campaignData]);
    // useEffect(() => {
    //     updateCampaigns();

    //     return () => {};
    // }, []);
    useEffect(() => {
        // const dialogPropsNew = { ...dialogProps };
        // dialogPropsNew.rows = rows ?? [];
        setDialogConfig((prev) => ({ ...prev, parent: campaigns.data ?? [] }));

        return () => {};
    }, [campaigns.data]);
    //#endregion
    function onDialogClose(hasChanged?: boolean) {
        // console.log("Hi!");
        setEditingData(undefined);
        setIsOpen("none");
        if (hasChanged) {
            console.log("Updating Campaign Data");
            queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }
    }

    // async function updateCampaigns() {
    //     setLoading(true);
    //     // console.log("Starting Update");
    //     campaigns.list().then((res) => {
    //         // console.log("received Update");
    //         setCampaignData(res.data);
    //         setLoading(false);
    //     });
    // }

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
    if (campaigns.isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",

                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h3">Lade Kampagnen</Typography>
                <CircularProgress />
            </div>
        );
    }
    if (campaigns.isError) {
        console.error(campaigns.error);
        const error: { errorType: string; message: string } = JSON.parse(campaigns.error.message)[0];
        const ErrorMessages: { [key: string]: string } = {
            Unauthorized: "Nicht autorisiert",
        };
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h3">Fehler beim Laden der Kampagnen</Typography>
                <Typography variant="h5">
                    {ErrorMessages[error.errorType as keyof typeof ErrorMessages] ?? ""}
                </Typography>
                <Typography variant="h6">{error.message}</Typography>
            </div>
        );
    }
    return (
        <>
            {/* Dialogs */}
            <>
                {isOpen === "campaign" && (
                    <CampaignDialog
                        {...dialogConfig}
                        {...dialogOptions}
                        isOpen={true}
                        editingData={editingData as Campaign.Campaign}
                    />
                )}
                {/* <WebinarDialog
                    {...dialogConfig}
                    {...dialogOptions}
                    isOpen={isOpen.webinar}
                    editingData={editingData as Webinar}
                /> */}
                {isOpen === "details" && (
                    <CampaignDetails onClose={onDialogClose} campaignId={editingData?.id ?? ""} isOpen={true} />
                )}
            </>
            <DataGrid
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                onRowClick={({ id }) => {
                    ClickHandlers.showTimeline(id)();
                }}
                disableRowSelectionOnClick
                rows={campaigns.data ?? []}
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
                    toolbar: { setIsOpen, isLoading: campaigns.isFetching },
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
