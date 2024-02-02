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
    GridCell,
    GridToolbar,
    GridCellParams,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import {
    listInfluencers,
    createNewInfluencer,
    deleteInfluencer,
    getUserGroups,
    updateInfluencer,
    listCampaigns,
} from "@/app/ServerFunctions/serverActions";
import { Influencer } from "@/app/ServerFunctions/databaseTypes";
import CampaignDialog from "./CampaignDialog";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";
import { Campaign, Customer } from "@/app/ServerFunctions/databaseTypes";
import { deDE } from "@mui/x-data-grid";
import styles from "./campaignMenu.module.css";
import CustomerDialog from "./CustomerDialog";
import WebinarDialog from "./WebinarDialog";
// import InfluencerAssignmentDialog from "./InfluencerAssignmentDialog";
import TimeLineEventDialog from "../Timeline/TimeLineDialog";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";

const client = generateClient<Schema>();

type DialogType = Campaign.Campaign;

interface EditToolbarProps {
    setDialogOptions: (props: DialogOptions<DialogType>) => any;
}
enum Dialogs {
    campaign,
    customer,
    webinar,
    influencer,
}

function EditToolbar(props: EditToolbarProps) {
    const { setDialogOptions } = props;
    function handleClick() {
        setDialogOptions({ open: true });
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

function WebinarList(props: {}) {
    const [influencers, setInfluencers] = useState<Influencer.InfluencerWithName[]>([]);
    // const [details, setDetails] = useState<Schema["InfluencerPrivate"][]>([]);
    const [campaigns, setCampaigns] = useState<Campaign.Campaign[]>();
    const [dialog, setDialog] = useState(Dialogs.campaign);

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
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Edit"
                                className="textPrimary"
                                onClick={handleEditClickCustomer(params.id)}
                                color="inherit"
                            />
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
            renderCell(params) {
                const date: Date = params.value;
                return [
                    <div key={params.id} className={styles.cellActionSplit}>
                        <div>
                            <Typography>{params.row.webinar.title}</Typography>
                            <br />
                            <Typography>{date.toLocaleString()}</Typography>
                        </div>
                        <div>
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Edit"
                                className="textPrimary"
                                onClick={handleEditClickWebinar(params.id)}
                                color="inherit"
                            />
                        </div>
                    </div>,
                ];
            },
        },
        {
            field: "influencers",
            headerName: "Influencer",
            flex: 2,

            headerAlign: "center",
            align: "center",
            type: "string",
            renderCell({ id, row }: { id: GridRowId; row: Campaign.WebinarCampaign }) {
                return [
                    <div key={id} className={styles.cellActionSplit}>
                        <div>
                            <Typography>{}</Typography>
                            <br />
                            <Typography>{}</Typography>
                        </div>
                        <div>
                            <GridActionsCellItem
                                icon={<AddIcon />}
                                label="Edit"
                                className="textPrimary"
                                onClick={handleAddClickInfluencer(id)}
                                color="inherit"
                            />
                        </div>
                    </div>,
                ];
            },
        },
        {
            field: "nextSteps",
            headerName: "Nächste Schritte",
            flex: 3,

            headerAlign: "center",
            align: "center",
            renderCell: (params: GridCellParams) => {
                const [groupBy, setGroupBy] = useState<groupBy>("day");
                const row: Campaign.Campaign = params.row;
                return (
                    <div style={{ display: "flex", flexDirection: "column", flexBasis: "100%" }}>
                        <Select
                            value={groupBy}
                            onChange={(e) => {
                                setGroupBy(e.target.value as groupBy);
                            }}
                        >
                            <MenuItem value={"day"}>Tag</MenuItem>
                            <MenuItem value={"week"}>Woche</MenuItem>
                        </Select>
                        <TimelineView groupBy={groupBy} events={row.campaignTimelineEvents} />;
                    </div>
                );
            },
        },
        // {
        //     field: "actions",
        //     type: "actions",
        //     headerName: "Aktionen",
        //     cellClassName: "actions",
        //     getActions: ({ id }) => {
        //         return [
        //             <GridActionsCellItem
        //                 icon={<EditIcon />}
        //                 label="Edit"
        //                 className="textPrimary"
        //                 onClick={handleEditClick(id)}
        //                 color="inherit"
        //             />,
        //             // <GridActionsCellItem
        //             //     icon={<DeleteIcon />}
        //             //     label="Delete"
        //             //     onClick={handleDeleteClick(id)}
        //             //     color="inherit"
        //             // />,
        //         ];
        //     },
        // },
    ];
    const [dialogOtions, setDialogOptions] = useState<DialogOptions<any>>({
        open: false,
    });

    const [dialogProps, setDialogProps] = useState<DialogProps<DialogType>>({
        rows: campaigns ?? [],
        setRows: setCampaigns,
        onClose: () => setDialogOptions({ open: false }),
        columns,
        excludeColumns: ["id"],
    });

    const { user, authStatus } = useAuthenticator((x) => [x.user, x.authStatus]);
    // const [groups, setGroups] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        listInfluencers().then((items) => setInfluencers(items));
        return () => {};
    }, [client, campaigns]);
    useEffect(() => {
        listCampaigns().then(({ data }) => {
            console.log(data);
            setCampaigns(data);
        });
        // let sub: Subscription;
        // try {
        //     if (authStatus !== "authenticated") return;
        //     sub = client.models.Campaign.observeQuery().subscribe(
        //         async ({ items }: { items: Schema["Campaign"][] }) => {
        //             console.log(items);
        //             const campaigns = await Promise.all(
        //                 items.map(async (campaign: Schema["Campaign"]) => {
        //                     const { data: webinar } = await campaign.webinarDetails();
        //                     const { data: customer } = await campaign.customer();
        //                     const { data: timelineEvents = [] } =
        //                         await campaign.campaignTimelineEvents();
        //                     // console.log(timelineEvents);
        //                     if (!(webinar && customer)) throw new Error("");
        //                     return {
        //                         id: campaign.id,
        //                         campaign,
        //                         webinar,
        //                         customer,
        //                         timelineEvents,
        //                     } satisfies WebinarCampaign;
        //                 }),
        //             );
        //             console.log({ campaigns });
        //             // console.log(details);
        //             setCampaigns([...campaigns]);
        //         },
        //     );
        //     console.log(sub);
        // } catch (error) {
        //     console.log("error", error);
        // }

        return () => {};
    }, [client]);
    useEffect(() => {
        // const dialogPropsNew = { ...dialogProps };
        // dialogPropsNew.rows = rows ?? [];
        setDialogProps((prev) => ({ ...prev, rows: campaigns ?? [] }));

        return () => {};
    }, [campaigns]);

    // useEffect(() => {
    //     getUserGroups().then((result) => setGroups(result));
    //     return () => {};
    // }, [user]);
    function handleEditClick(id: GridRowId, dialogType: Dialogs) {
        return () => {
            const editingData = campaigns?.find((campaign) => campaign.id === id);
            if (!editingData) return;
            setDialog(dialogType);
            setDialogOptions({ open: true, editing: true, editingData });
        };
        // return () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }
    function handleEditClickCustomer(id: GridRowId) {
        return () => {
            const editingData = campaigns?.find((campaign) => campaign.id === id)?.customer;
            if (!editingData) return;
            setDialog(Dialogs.customer);
            setDialogOptions({ open: true, editing: true, editingData });
        };
    }
    function handleEditClickWebinar(id: GridRowId) {
        return () => {
            const campaign = campaigns?.find((campaign) => campaign.id === id);
            if (!(campaign && Campaign.isWebinar(campaign))) return;
            const webinar = campaign.webinar;
            setDialogOptions({ open: true, editing: true, editingData: webinar });
        };
    }

    function handleAddClickInfluencer(id: GridRowId) {
        return () => {
            const campaign = campaigns?.find((campaign) => campaign.id === id);
            if (!campaign) return;
            setDialog(Dialogs.influencer);
            setDialogOptions({ open: true, campaignId: campaign.id });
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
            {dialog === Dialogs.campaign && <CampaignDialog {...dialogOtions} {...dialogProps} />}
            {dialog === Dialogs.customer && (
                <CustomerDialog props={dialogProps} options={dialogOtions} />
            )}
            {dialog === Dialogs.webinar && (
                <WebinarDialog props={dialogProps} options={dialogOtions} />
            )}
            {dialog === Dialogs.influencer && (
                <TimeLineEventDialog
                    props={dialogProps}
                    options={dialogOtions}
                    influencers={influencers}
                />
            )}
            <DataGrid
                localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
                disableRowSelectionOnClick
                rows={campaigns ?? []}
                columns={columns}
                initialState={{ columns: { columnVisibilityModel: { id: false } } }}
                getRowHeight={() => "auto"}
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
}

export default WebinarList;
