import axios from "axios";

/**
 * Extracts a user-friendly error message from an Axios error.
 *
 * Priority:
 * 1. response.data.detail   — ASP.NET Core ProblemDetails
 * 2. response.data.title    — ASP.NET Core ProblemDetails (fallback)
 * 3. response.data.message  — custom backend message field
 * 4. response.data           — plain string response from backend
 * 5. fallback                — caller-supplied default message
 */
export function getErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error)) return fallback;

    const data = error.response?.data;

    if (data) {
        if (typeof data === "string" && data.trim().length > 0) return data.trim();
        if (typeof data === "object") {
            if (typeof data.detail === "string" && data.detail.trim().length > 0) return data.detail.trim();
            if (typeof data.title === "string" && data.title.trim().length > 0) return data.title.trim();
            if (typeof data.message === "string" && data.message.trim().length > 0) return data.message.trim();
        }
    }

    return fallback;
}
