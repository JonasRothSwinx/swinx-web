export type TemplateVariables = {
    influencerName: string;
    customerName: string;
    taskPageUrl: string;
};
const templateBaseName = "CampaignInviteAccept";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
export const defaultParams: TemplateVariables = {
    influencerName: "Max Mustermann",
    customerName: "Musterfirma",
    taskPageUrl: "http://localhost:3000/Response?",
};
