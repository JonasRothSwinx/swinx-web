import { Schema } from "@/amplify/data/resource";
import { Nullable } from "@/app/Definitions/types";

export type Customer = {
    id?: string;
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: Nullable<string>;
    companyPosition?: string | null;
    notes?: Nullable<string>;
    profileLink?: Nullable<string>;
};
type SchemaCustomer = Omit<
    Schema["Customer"],
    "CampaignId" | "createdAt" | "updatedAt" | "campaign"
>;

export function satisfies(arg: unknown): arg is Customer {
    const customer = arg as Customer;
    return (
        typeof customer.company === "string" &&
        typeof customer.firstName === "string" &&
        typeof customer.lastName === "string" &&
        typeof customer.email === "string" &&
        (typeof customer.phoneNumber === "string" || customer.phoneNumber === null) &&
        (typeof customer.companyPosition === "string" || customer.companyPosition === null) &&
        (typeof customer.notes === "string" || customer.notes === null)
    );
}
