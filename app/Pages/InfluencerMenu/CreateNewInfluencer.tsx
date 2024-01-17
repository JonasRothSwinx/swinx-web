import { useEffect, useRef, useState } from "react";
import styles from "./influencerMenu.module.css";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

function CreateInfluencerDialog(props: { open: boolean; onClose: () => any }) {
    const { open, onClose } = props;
    const [isModalOpen, setIsModalOpen] = useState(open);
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        setIsModalOpen(open);
    }, [open]);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal();
            } else {
                modalElement.close();
            }
        }
    }, [isModalOpen]);

    function handleCloseModal() {
        if (onClose) {
            onClose();
        }
        setIsModalOpen(false);
    }

    async function onSubmit(data: FormData) {
        const firstName = data.get("firstName")?.toString() ?? "";
        const lastName = data.get("lastName")?.toString() ?? "";
        const email = data.get("email")?.toString() ?? "";
        const { data: privateData } = await client.models.InfluencerPrivate.create({
            email,
        });
        const { data: newPublicInfluencer } = await client.models.InfluencerPublic.create({
            firstName,
            lastName,
            details: privateData,
        });
        console.log({ newPublicInfluencer });
        // console.log(data.get("firstName"), data.get("lastName"),data.);
        handleCloseModal();
    }

    return (
        <dialog ref={modalRef} className={styles.dialog} onClose={handleCloseModal}>
            Hi!
            <form action={onSubmit}>
                <label htmlFor="firstName">Vorname</label>
                <input id="firstName" name="firstName" />
                <label htmlFor="lastName">Nachname</label>
                <input id="lastName" name="lastName" />
                <label id="email">E-Mail</label>
                <input id="email" name="email" />

                <button type="submit">OK</button>
            </form>
        </dialog>
    );
}
export default CreateInfluencerDialog;
