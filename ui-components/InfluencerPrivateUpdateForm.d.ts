import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { InfluencerPrivate } from "./graphql/types";
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
export declare type InfluencerPrivateUpdateFormInputValues = {
    email?: string;
};
export declare type InfluencerPrivateUpdateFormValidationValues = {
    email?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InfluencerPrivateUpdateFormOverridesProps = {
    InfluencerPrivateUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InfluencerPrivateUpdateFormProps = React.PropsWithChildren<{
    overrides?: InfluencerPrivateUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    influencerPrivate?: InfluencerPrivate;
    onSubmit?: (fields: InfluencerPrivateUpdateFormInputValues) => InfluencerPrivateUpdateFormInputValues;
    onSuccess?: (fields: InfluencerPrivateUpdateFormInputValues) => void;
    onError?: (fields: InfluencerPrivateUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InfluencerPrivateUpdateFormInputValues) => InfluencerPrivateUpdateFormInputValues;
    onValidate?: InfluencerPrivateUpdateFormValidationValues;
} & React.CSSProperties>;
export default function InfluencerPrivateUpdateForm(props: InfluencerPrivateUpdateFormProps): React.ReactElement;
