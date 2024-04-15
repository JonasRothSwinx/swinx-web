"use server";
import { Nullable } from "@/app/Definitions/types";
import Customer from "@/app/ServerFunctions/types/customer";
import client from "./.dbclient";

export async function createCustomer(customer: Omit<Customer.Customer, "id">, campaignId: string) {
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
        campaignCustomersId: campaignId,
    });
    if (errors) throw new Error(JSON.stringify(errors));

    // // Create substitutes
    // const substitutePromises: Promise<string>[] = [];

    // await Promise.all(substitutePromises);
    return createdCustomer.id;
}

async function createSubstitute(
    customer: Omit<Customer.Customer, "id"> & { customerSubstitutesId: string },
) {
    const {
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        phoneNumber,
        notes,
        customerSubstitutesId,
    } = customer;
    const { data, errors } = await client.models.Customer.create({
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
        phoneNumber,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    return data.id;
}

export async function updateCustomer(customer: Customer.Customer) {
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

export async function deleteCustomer(customer: Customer.Customer) {
    if (!customer.id) throw new Error("Missing Data");

    const { errors } = await client.models.Customer.delete({ id: customer.id });
    console.log(errors);
}
