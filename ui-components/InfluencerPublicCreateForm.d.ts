import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type InfluencerPublicCreateFormInputValues = {
    firstName?: string;
    lastName?: string;
};
export declare type InfluencerPublicCreateFormValidationValues = {
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InfluencerPublicCreateFormOverridesProps = {
    InfluencerPublicCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InfluencerPublicCreateFormProps = React.PropsWithChildren<{
    overrides?: InfluencerPublicCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: InfluencerPublicCreateFormInputValues) => InfluencerPublicCreateFormInputValues;
    onSuccess?: (fields: InfluencerPublicCreateFormInputValues) => void;
    onError?: (fields: InfluencerPublicCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InfluencerPublicCreateFormInputValues) => InfluencerPublicCreateFormInputValues;
    onValidate?: InfluencerPublicCreateFormValidationValues;
} & React.CSSProperties>;
export default function InfluencerPublicCreateForm(props: InfluencerPublicCreateFormProps): React.ReactElement;
