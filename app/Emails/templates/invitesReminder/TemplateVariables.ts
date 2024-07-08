export type TemplateVariables = {
    name: string;
    inviteAmount: string;
    customerName: string;
    eventName: string;
    eventLink: string;
    filterJobGroups: { jobGroup: string }[];
    filterCountries: string;
};

const templateBaseName = "InvitesReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
