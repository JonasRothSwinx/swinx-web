export type TemplateVariables = {
    name: string;
    customerName: string;
    customerLink: string;
    // postContent: string;
    postTime: string;
};

const templateBaseName = "VideoReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
