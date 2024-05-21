"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import emailClient from "@/app/Emails";

function SearchParams() {
    const params = useSearchParams();

    console.log(params.forEach((val, key) => console.log(key, val)));
    return <div>{params.toString()}</div>;
}
export default function Page() {
    // emailClient.templates.list().then((templates) => console.log(templates));
    return (
        <div>
            <h1>Hello!</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParams />
            </Suspense>
        </div>
    );
}
