export type TemplateVariables = {
    name: string;
    postTime: string;
    customerName: string;
    customerProfileLink: string;
};

const templateBaseName = "PostReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
