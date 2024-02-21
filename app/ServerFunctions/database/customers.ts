"use server";
import Customer from "../types/customer";
import client from "./.dbclient";

export async function createCustomer(customer: Customer.Customer) {
    const { company, firstName, lastName, email, companyPosition, notes } = customer;
    const { data, errors } = await client.models.Customer.create({
        company,
        firstName,
        lastName,
        email,
        companyPosition,
        notes,
    });
    return { data, errors };
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
