export type TemplateVariables = {
    name: string;
    customerName: string;
    topic: string;
};
const templateBaseName = "PostDraftDeadlineReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
