import { Schema } from "@/amplify/data/resource";
import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";

export type WebinarCampaign = Schema["Webinar"];

export type RowDataInfluencer = Schema["InfluencerPrivate"] &
    Schema["InfluencerPublic"] & { isNew: boolean };

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
