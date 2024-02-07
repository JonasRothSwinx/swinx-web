"use server";
import { Schema } from "@/amplify/data/resource";
import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import { TimelineEvent } from "../ServerFunctions/databaseTypes";

// export type RowDataInfluencer = Schema["InfluencerPrivate"] & Schema["InfluencerPublic"];

// export type Influencer = {
//     public: InfluencerPublic;
//     private?: InfluencerPrivate;
// };

export interface DialogOptions<T> {
    editing?: boolean;
    open?: boolean;
    editingData?: T;
    campaignId?: string;
}

export interface DialogProps<T> {
    onClose?: (hasChanged?: boolean) => any;
    rows: T[];
    setRows: Dispatch<SetStateAction<T[] | undefined>>;
    // columns: GridColDef[];
    // excludeColumns: string[];
}
