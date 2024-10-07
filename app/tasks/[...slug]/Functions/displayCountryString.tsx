import { Nullable } from "@/app/Definitions/types";

export function displayCountryString(countries: Nullable<string>[]) {
    return countries.join(", ").replace(/, ([^,]*)$/, " und $1");
}
