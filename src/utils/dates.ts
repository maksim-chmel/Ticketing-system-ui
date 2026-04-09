export type ApiDateInput = string | null | undefined;

const hasExplicitTimezone = (value: string) => /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
const looksLikeIsoDateTime = (value: string) => /^\d{4}-\d{2}-\d{2}[T\s]/.test(value);
const looksLikeIsoDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

/**
 * Backend guarantees UTC storage. Treat all incoming API dates as UTC.
 * - If timezone is missing, assume UTC and append `Z`.
 * - If date-only, treat as UTC midnight.
 */
export function parseApiUtcDate(value: ApiDateInput): Date | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    let normalized = trimmed;
    // Some APIs send "YYYY-MM-DD HH:mm:ss[.SSS]Z" (space instead of "T")
    if (normalized.includes(" ") && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(normalized)) {
        normalized = normalized.replace(" ", "T");
    }

    // Normalize timezone like +0300 into +03:00
    normalized = normalized.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");

    if (!hasExplicitTimezone(trimmed)) {
        if (looksLikeIsoDateOnly(trimmed)) {
            normalized = `${trimmed}T00:00:00Z`;
        } else if (looksLikeIsoDateTime(trimmed)) {
            normalized = `${normalized}Z`;
        }
    }

    const date = new Date(normalized);
    if (!Number.isNaN(date.getTime())) return date;

    // Final fallback: try raw value (covers some browser-specific parsers)
    const rawParsed = new Date(trimmed);
    return Number.isNaN(rawParsed.getTime()) ? null : rawParsed;
}

export function formatApiUtcToLocalDateTime(
    value: ApiDateInput,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const date = parseApiUtcDate(value);
    if (!date) return "—";

    const formatter = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        ...options,
    });

    return formatter.format(date);
}

export function formatApiUtcToLocalDate(
    value: ApiDateInput,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const date = parseApiUtcDate(value);
    if (!date) return "—";

    const formatter = new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...options,
    });

    return formatter.format(date);
}

