import Image from "next/image";

//MARK: SwinxLogo
export function SwinxLogo() {
    return (
        <Image
            id="SwinxLogo"
            src="/swinx-logo.svg"
            alt="Swinx Logo"
            width={200}
            height={40}
        />
    );
}
