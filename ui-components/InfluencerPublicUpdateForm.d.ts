import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { InfluencerPublic } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type InfluencerPublicUpdateFormInputValues = {
    firstName?: string;
    lastName?: string;
};
export declare type InfluencerPublicUpdateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InfluencerPublicUpdateFormOverridesProps = {
    InfluencerPublicUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InfluencerPublicUpdateFormProps = React.PropsWithChildren<{
    overrides?: InfluencerPublicUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    influencerPublic?: InfluencerPublic;
    onSubmit?: (fields: InfluencerPublicUpdateFormInputValues) => InfluencerPublicUpdateFormInputValues;
    onSuccess?: (fields: InfluencerPublicUpdateFormInputValues) => void;
    onError?: (fields: InfluencerPublicUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InfluencerPublicUpdateFormInputValues) => InfluencerPublicUpdateFormInputValues;
    onValidate?: InfluencerPublicUpdateFormValidationValues;
} & React.CSSProperties>;
export default function InfluencerPublicUpdateForm(props: InfluencerPublicUpdateFormProps): React.ReactElement;
