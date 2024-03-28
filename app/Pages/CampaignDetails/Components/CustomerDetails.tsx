import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import { MouseEvent, useEffect, useState } from "react";
import CustomerDialog from "../../Dialogs/CustomerDialog";
import { Accordion, AccordionDetails, AccordionSummary, IconButton } from "@mui/material";
import stylesExporter from "../../styles/stylesExporter";
import { EditIcon, ExpandMoreIcon, MailIcon } from "@/app/Definitions/Icons";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const styles = stylesExporter.campaignDetails;

type CustomerDetailsProps = {
    customer: Customer.Customer;
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
};
type CustomerData = (
    | { name: string; value: string; insertAfter?: JSX.Element; insertBefore?: JSX.Element }
    | "spacer"
    | null
)[];
function getCustomerData(customer: Customer.Customer): CustomerData {
    return [
        { name: "Firma", value: customer.company },
        "spacer",
        { name: "Kontakt", value: `${customer.firstName} ${customer.lastName}` },
        customer.companyPosition ? { name: "", value: `(${customer.companyPosition})` } : null,
        {
            name: "",
            value: customer.email,
            insertBefore: (
                <a href={`mailto:${customer.email}`} rel="noreferrer" target="_blank">
                    <MailIcon />
                </a>
            ),
        },
    ] satisfies CustomerData;
}
export default function CustomerDetails(props: CustomerDetailsProps) {
    const { customer, campaign, setCampaign } = props;
    const [customerData, setCustomerData] = useState<CustomerData>(getCustomerData(customer));
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setCustomerData(getCustomerData(customer));

        return () => {};
    }, [customer]);

    const config: DialogConfig<Campaign.Campaign> = {
        parent: campaign,
        setParent: setCampaign,
        onClose: () => setIsDialogOpen(false),
    };
    const options: DialogOptions = {
        editing: true,
        campaignId: campaign.id,
    };

    function handleEditButton() {
        return function (e: MouseEvent) {
            e.preventDefault();
            e.stopPropagation();
            setIsDialogOpen(true);
        };
    }
    return (
        <>
            <>
                <CustomerDialog {...config} {...options} isOpen={isDialogOpen} editingData={customer} />
            </>
            <Accordion defaultExpanded disableGutters variant="outlined">
                <AccordionSummary
                    className={styles.summaryWithEdit}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        "& .MuiAccordionSummary-content:not(.Mui-expanded) button": {
                            display: "none",
                        },
                    }}
                >
                    <div className={styles.summaryWithEdit}>
                        Auftraggeber
                        <IconButton className="textPrimary" onClick={handleEditButton()} color="inherit">
                            <EditIcon />
                        </IconButton>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {customerData.map((x, i) => {
                        if (!x) return null;
                        if (x === "spacer") {
                            return <div style={{ height: "1em", borderTop: "1px solid black" }} key={`spacer${i}`} />;
                        }
                        return (
                            <Grid key={i + x.name} container columnSpacing={8}>
                                <Grid xs={4} display="flex" justifyContent="left">
                                    {x.name}
                                </Grid>
                                <Grid xs="auto" display="flex" justifyContent="left">
                                    {x.insertBefore}
                                    {x.value}
                                    {x.insertAfter}
                                </Grid>
                            </Grid>
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        </>
    );
}
