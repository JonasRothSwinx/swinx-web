export type TemplateVariables = {
    influencerName: string;
    customerName: string;
};
const templateBaseName = "CampaignInviteAccept";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
