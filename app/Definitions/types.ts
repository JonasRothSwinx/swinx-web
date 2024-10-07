"use server";
// export type RowDataInfluencer = Schema["InfluencerPrivate"] & Schema["InfluencerPublic"];

// export type Influencer = {
//     public: InfluencerPublic;
//     private?: InfluencerPrivate;
// };

// export type DialogProps<
//     RowDataType,
//     DataType extends EditableDataTypes,
// > = DialogConfig<RowDataType> & DialogOptions & { isOpen?: boolean; editingData?: DataType };

// export interface DialogOptions {
//     editing?: boolean;
//     campaignId?: string;
// }

// type EditableDataTypes =
//     | Campaign.Campaign
//     | Customer.Customer
//     // | Webinar
//     | TimelineEvent.Event
//     | Influencer.Full
//     | Assignment.Assignment;
export interface DialogConfig<RowDataType> {
    onClose?: (hasChanged?: boolean) => void;
    parent: RowDataType;
    setParent: (data: RowDataType) => void;
}

export type Nullable<T> = T | null;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & unknown;
export type DeepPrettify<T> = {
    [K in keyof T]: DeepPrettify<T[K]>;
} & unknown;

export type PartialWith<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type highlightData = {
    id: string;
    color: string;
};

export type DeepWriteable<T> = Prettify<{ -readonly [P in keyof T]: DeepWriteable<T[P]> }>;
