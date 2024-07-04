"use server";
import { Nullable } from "@/app/Definitions/types";
import { Customer } from "@/app/ServerFunctions/types";
import client from "./.dbclient";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

async function selectionSetTest() {
    const id = "hi";
    const { data: customer, errors } = await client.models.Customer.get(
        { id },
        {
            selectionSet: [
                "id",
                "company",
                "firstName",
                "lastName",
                "email",
                "companyPosition",
                "phoneNumber",
                "notes",
                "linkedinProfile",
            ],
        },
    );
}

const selectionSet = [
    "id",
    "company",
    "firstName",
    "lastName",
    "email",
    "companyPosition",
    "phoneNumber",
    "notes",
    "linkedinProfile",
] as const;

type RawCustomer = SelectionSet<Schema["Customer"]["type"], typeof selectionSet>;
//#region Create
export async function createCustomer(
    customer: Omit<Customer, "id">,
    campaignId: string,
): Promise<Nullable<string>> {
    const { company, firstName, lastName, email, companyPosition, phoneNumber, notes } = customer;

    // Create primary customer
    const { data: createdCustomer, errors } = await client.models.Customer.create({
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
        phoneNumber,
        campaignId,
    });
    if (errors) throw new Error(JSON.stringify(errors));

    // // Create substitutes
    // const substitutePromises: Promise<string>[] = [];

    // await Promise.all(substitutePromises);
    return createdCustomer?.id ?? null;
}
//#endregion

//#region Update
export async function updateCustomer(customer: Customer) {
    const { id, company, firstName, lastName, email, companyPosition, notes } = customer;
    if (!id) throw new Error("Missing Data");

    const { data, errors } = await client.models.Customer.update({
        id,
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
    });
    return { data, errors };
}
//#endregion

//#region Delete
export async function deleteCustomer(customer: Customer) {
    if (!customer.id) throw new Error("Missing Data");

    const { errors } = await client.models.Customer.delete({ id: customer.id });
    console.log(errors);
}
//#endregion

//#region Read
export async function getCustomer(id: string): Promise<Nullable<Customer>> {
    const { data: customer, errors } = await client.models.Customer.get({ id }, { selectionSet });
    if (errors) throw new Error(JSON.stringify(errors));
    return validateRawCustomer(customer);
}

export async function listCustomersByCampaign(campaignId: string): Promise<Customer[]> {
    const { data: customers, errors } = await client.models.Customer.listCustomersByCampaign(
        {
            campaignId,
        },
        { selectionSet },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    const validationresult = validateRawCustomerArray(customers);
    return validationresult;
}
//#endregion

//#region Validation
function validateRawCustomerArray(rawCustomers: RawCustomer[]): Customer[] {
    let invalidDataSets = 0;
    const validatedCustomers: Customer[] = rawCustomers
        .map((rawCustomer) => validateRawCustomer(rawCustomer))
        .filter((customer): customer is Customer => {
            if (customer === null) {
                invalidDataSets++;
                return false;
            }
            return true;
        });
    if (invalidDataSets > 0) {
        console.error(`Found ${invalidDataSets} invalid datasets when validating customers`);
    }
    return validatedCustomers;
}

function validateRawCustomer(rawCustomer: Nullable<RawCustomer>): Nullable<Customer> {
    if (!rawCustomer) return null;
    try {
        const validatedCustomer: Customer = {
            id: rawCustomer.id,
            company: rawCustomer.company ?? "",
            firstName: rawCustomer.firstName ?? "",
            lastName: rawCustomer.lastName ?? "",
            email: rawCustomer.email ?? "",
            companyPosition: rawCustomer.companyPosition,
            phoneNumber: rawCustomer.phoneNumber,
            notes: rawCustomer.notes,
            profileLink: rawCustomer.linkedinProfile,
        };
        return validatedCustomer;
    } catch (error) {
        console.error("Error validating customer", error);
        return null;
    }
}
//#endregion
