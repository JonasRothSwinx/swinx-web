import { Schema } from "@/amplify/data/resource";
import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";

export type WebinarCampaign = {
    id: string;
    campaign: Campaign;
    webinar: Webinar;
    customer: Customer;
    influencers: InfluencerAssignment[];
    timelineEvents: TimelineEvent[];
};

export type Campaign = Schema["Campaign"];
export type Webinar = Schema["Webinar"];
export type Customer = Schema["Customer"];
export type InfluencerAssignment = Schema["InfluencerAssignment"];
export type TimelineEvent = Schema["TimelineEvent"];
export type InfluencerPrivate = Schema["InfluencerPrivate"];
export type InfluencerPublic = Schema["InfluencerPublic"];

export type RowDataInfluencer = Schema["InfluencerPrivate"] & Schema["InfluencerPublic"] & { isNew: boolean };

export type Influencer = {
    public: InfluencerPublic;
    private?: InfluencerPrivate;
};

export interface DialogOptions<T> {
    editing?: boolean;
    open?: boolean;
    editingData?: T;
}

export interface DialogProps<T> {
    onClose?: () => any;
    rows: T[];
    setRows: Dispatch<SetStateAction<T[] | undefined>>;
    columns: GridColDef[];
    excludeColumns: string[];
}
