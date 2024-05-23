import { Typography } from "@mui/material";

//MARK: BudgetDescriptionText
export function BudgetDescriptionText() {
    // const queryClient = useQueryClient();
    // const assignmentData = queryClient.getQueryData<Assignment>(["assignment"]);
    // if (!assignmentData) {
    //     queryClient.refetchQueries();
    //     return <Loading />;
    // }
    // return (
    //     <Typography>
    //         Für ihren Aufwand werden Sie mit einem Honorar von{" "}
    //         <strong>{assignmentData.budget} €</strong> vergütet.
    //     </Typography>
    // );
    return (
        <Typography>
            Für ihren Aufwand werden Sie mit einem attraktiven Honorar vergütet.
        </Typography>
    );
}
