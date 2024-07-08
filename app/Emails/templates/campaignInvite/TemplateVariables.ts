export type TemplateVariables = {
    name: string;
    // assignments: { assignmentDescription: string }[];
    // honorar: string;
    linkBase: string;
    linkData: string;
    customerCompany: string;
};

const templateBaseName = "CampaignInvite";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
