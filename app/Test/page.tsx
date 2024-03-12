"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
    const params = useSearchParams();
    console.log(params.forEach((val, key) => console.log(key, val)));
    return (
        <div>
            <h1>Hello!</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <div>{params.toString()}</div>
            </Suspense>
        </div>
    );
}
