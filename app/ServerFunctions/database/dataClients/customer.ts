import { database } from "../dbOperations";
import { Customer } from "../../types/";
import { dataClient } from ".";
import { Nullable } from "@/app/Definitions/types";

export const customer = {
    create,
    update: updateCustomer,
    get: getCustomer,
    byCampaign: listCustomersByCampaign,
};

/**
 * Create a new customer and update cache
 * @param customer - The customer to create
 * @param campaignId - The id of the campaign the customer belongs to
 * @returns The created customer
 */

export async function create(
    customer: Omit<Customer, "id">,
    campaignId: string,
): Promise<Customer> {
    const queryClient = dataClient.config.getQueryClient();
    const id = await database.customer.create(customer, campaignId);
    if (!id) throw new Error("Failed to create customer");
    const newCustomer = { ...customer, id };
    queryClient.setQueryData(["customer", id], newCustomer);
    return newCustomer;
}
interface UpdateCustomer {
    id: string;
    updatedData: Partial<Customer>;
    previousData: Customer;
}
export async function updateCustomer({
    id,
    updatedData,
    previousData,
}: UpdateCustomer): Promise<Customer> {
    const queryClient = dataClient.config.getQueryClient();
    // await database.customer.update(updatedData)
    const updatedCustomer: Customer = {
        ...previousData,
        ...updatedData,
    };
    queryClient.setQueryData(["customer", id], updatedCustomer);
    return updatedCustomer;
}
interface GetCustomer {
    id: string;
}

async function getCustomer({ id }: GetCustomer): Promise<Nullable<Customer>> {
    const queryClient = dataClient.config.getQueryClient();
    const customer = await database.customer.get(id);
    // console.log("customer", id, customer);
    return customer;
}

async function listCustomersByCampaign(campaignId: string): Promise<Customer[]> {
    const queryClient = dataClient.config.getQueryClient();
    try {
        const customers = await queryClient.fetchQuery({
            queryKey: ["customers", campaignId],
            queryFn: () => database.customer.listByCampaign(campaignId),
        });
        return customers;
    } catch (error) {
        console.error(error);
        return [];
    }
}
