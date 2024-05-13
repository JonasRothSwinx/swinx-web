import database from "../dbOperations";
import Customer from "../../types/customer";
import config from "./config";
import { Nullable } from "@/app/Definitions/types";

/**
 * Create a new customer and update cache
 * @param customer - The customer to create
 * @param campaignId - The id of the campaign the customer belongs to
 * @returns The created customer
 */

export async function create(customer: Omit<Customer.Customer, "id">, campaignId: string): Promise<Customer.Customer> {
    const queryClient = config.getQueryClient();
    const id = await database.customer.create(customer, campaignId);
    if (!id) throw new Error("Failed to create customer");
    const newCustomer = { ...customer, id };
    queryClient.setQueryData(["customer", id], newCustomer);
    return newCustomer;
}
interface UpdateCustomer {
    id: string;
    updatedData: Partial<Customer.Customer>;
    previousData: Customer.Customer;
}
export async function updateCustomer({ id, updatedData, previousData }: UpdateCustomer): Promise<Customer.Customer> {
    const queryClient = config.getQueryClient();
    // await database.customer.update(updatedData)
    const updatedCustomer: Customer.Customer = {
        ...previousData,
        ...updatedData,
    };
    queryClient.setQueryData(["customer", id], updatedCustomer);
    return updatedCustomer;
}
interface GetCustomer {
    id: string;
}

async function getCustomer({ id }: GetCustomer): Promise<Nullable<Customer.Customer>> {
    const queryClient = config.getQueryClient();
    const customer = await queryClient.fetchQuery({
        queryKey: ["customer", id],
        queryFn: () => database.customer.get(id),
    });
    return customer;
}

async function listCustomersByCampaign(campaignId: string): Promise<Customer.Customer[]> {
    const queryClient = config.getQueryClient();
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

const customer = {
    create,
    update: updateCustomer,
    get: getCustomer,
    byCampaign: listCustomersByCampaign,
};

export default customer;
