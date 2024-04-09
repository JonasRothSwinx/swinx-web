import database from "../dbOperations/.database";
import Customer from "../../types/customer";
import config from "./config";

/**
 * Create a new customer and update cache
 * @param customer - The customer to create
 * @returns The created customer
 */

export async function create(customer: Omit<Customer.Customer, "id">): Promise<Customer.Customer> {
    const queryClient = config.getQueryClient();
    const id = await database.customer.create(customer);
    const newCustomer = { ...customer, id };
    queryClient.setQueryData(["customer", id], newCustomer);
    return newCustomer;
}

const customer = {};

export default customer;
