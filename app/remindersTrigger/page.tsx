"use client";

import { useEffect, useState } from "react";
import { log } from "./logger";

export default function Page() {
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isProcessing) {
            setIsProcessing(true);
            log().then(() => {
                setIsProcessing(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
}
