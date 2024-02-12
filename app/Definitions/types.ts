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

export type DialogProps<
    RowDataType,
    DataType extends EditableDataTypes,
> = DialogConfig<RowDataType> & DialogOptions & { isOpen: boolean; editingData?: DataType };

export interface DialogOptions {
    editing?: boolean;
    campaignId?: string;
}

type EditableDataTypes = Campaign.Campaign | Customer | Webinar | TimelineEvent.TimelineEvent;
export interface DialogConfig<RowDataType> {
    onClose?: (hasChanged?: boolean) => void;
    rows: RowDataType[];
    setRows: Dispatch<SetStateAction<RowDataType[] | undefined>>;
    // columns: GridColDef[];
    // excludeColumns: string[];
}
