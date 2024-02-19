"use client";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const params = useSearchParams();
    console.log(params.forEach((val, key) => console.log(key, val)));
    return (
        <div>
            <h1>Hello!</h1>
            <div>{params.toString()}</div>
        </div>
    );
}
