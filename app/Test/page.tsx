"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchParams() {
    const params = useSearchParams();

    console.log(params.forEach((val, key) => console.log(key, val)));
    return <div>{params.toString()}</div>;
}
export default function Page() {
    return (
        <div>
            <h1>Hello!</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParams />
            </Suspense>
        </div>
    );
}
