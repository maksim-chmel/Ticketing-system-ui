import { useState } from "react";
import { addBroadcastMessage } from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useBroadcastForm = () => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (loading) {
            return false;
        }

        const normalizedMessage = message.trim();

        if (!normalizedMessage) {
            setStatus({ message: "Message cannot be empty.", type: "error" });
            return false;
        }

        setLoading(true);
        setStatus(null);

        try {
            await addBroadcastMessage({ message: normalizedMessage });
            setStatus({ message: "Message sent.", type: "success" });
            setMessage("");
            return true;
        } catch (err) {
            setStatus({ message: getErrorMessage(err, "Failed to send message"), type: "error" });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        message,
        setMessage,
        status,
        submit,
    };
};
