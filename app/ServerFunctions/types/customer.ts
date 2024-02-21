import { Nullable } from "@/app/Definitions/types";

export default Customer;

namespace Customer {
    export type Customer = {
        id?: string;
        company: string;
        firstName: string;
        lastName: string;
        email: string;
        companyPosition?: string | null;
        notes?: Nullable<string>;
    };
}
