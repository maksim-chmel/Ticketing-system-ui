const NAME_CLAIMS = [
    "unique_name",
    "name",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
];

export const decodeJwtName = (token: string): string | null => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        for (const key of NAME_CLAIMS) {
            if (typeof payload[key] === "string") return payload[key];
        }
        return null;
    } catch {
        return null;
    }
};
