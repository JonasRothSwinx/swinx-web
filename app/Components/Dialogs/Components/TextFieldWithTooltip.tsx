import { TextField, TextFieldProps, Tooltip, TooltipProps } from "@mui/material";
type TextFieldWithTooltipProps = TextFieldProps & {
    tooltipProps?: Omit<TooltipProps, "children">;
};
export function TextFieldWithTooltip({ tooltipProps, children, ...props }: TextFieldWithTooltipProps) {
    const { placement } = tooltipProps ?? {};
    if (!tooltipProps) return <TextField {...props}>{children}</TextField>;
    return (
        <Tooltip placement={placement ?? "top-start"} {...tooltipProps}>
            <TextField {...props}>{children}</TextField>
        </Tooltip>
    );
}
