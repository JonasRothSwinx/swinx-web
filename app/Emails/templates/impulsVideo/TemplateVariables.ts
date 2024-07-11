export type TemplateVariables = {
    name: string;
    customerName: string;
    dueDate: string;
    topic: string;
};

const templateBaseName = "ImpulsVideoReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
