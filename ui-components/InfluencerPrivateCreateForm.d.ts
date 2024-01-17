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
export declare type InfluencerPrivateCreateFormInputValues = {
    email?: string;
};
export declare type InfluencerPrivateCreateFormValidationValues = {
    email?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InfluencerPrivateCreateFormOverridesProps = {
    InfluencerPrivateCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InfluencerPrivateCreateFormProps = React.PropsWithChildren<{
    overrides?: InfluencerPrivateCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: InfluencerPrivateCreateFormInputValues) => InfluencerPrivateCreateFormInputValues;
    onSuccess?: (fields: InfluencerPrivateCreateFormInputValues) => void;
    onError?: (fields: InfluencerPrivateCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InfluencerPrivateCreateFormInputValues) => InfluencerPrivateCreateFormInputValues;
    onValidate?: InfluencerPrivateCreateFormValidationValues;
} & React.CSSProperties>;
export default function InfluencerPrivateCreateForm(props: InfluencerPrivateCreateFormProps): React.ReactElement;
