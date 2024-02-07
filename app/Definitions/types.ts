"use server";
import { Schema } from "@/amplify/data/resource";
import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction } from "react";
import { Campaign, Customer, TimelineEvent, Webinar } from "../ServerFunctions/databaseTypes";

// export type RowDataInfluencer = Schema["InfluencerPrivate"] & Schema["InfluencerPublic"];

// export type Influencer = {
//     public: InfluencerPublic;
//     private?: InfluencerPrivate;
// };

export type DialogProps<RowType, DataType extends EditableDataTypes> = DialogConfig<RowType> &
    DialogOptions & { isOpen: boolean; editingData?: DataType };

export interface DialogOptions {
    editing?: boolean;
    campaignId?: string;
}

type EditableDataTypes = Campaign.Campaign | Customer | Webinar | TimelineEvent.TimelineEvent;
export interface DialogConfig<T> {
    onClose?: (hasChanged?: boolean) => void;
    rows: T[];
    setRows: Dispatch<SetStateAction<T[] | undefined>>;
    // columns: GridColDef[];
    // excludeColumns: string[];
}
