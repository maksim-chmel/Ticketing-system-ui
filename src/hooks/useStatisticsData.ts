import { useEffect, useRef, useState } from "react";
import {
    fetchRequestsOverTime,
    fetchStatusDistribution,
    RequestsOverTimeItem,
    StatusDistributionItem
} from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";
import { formatApiUtcToLocalDate } from "../utils/dates";

interface RequestsOverTimePoint {
    date: string;
    count: number;
}

export const useStatisticsData = () => {
    const [dataStatus, setDataStatus] = useState<StatusDistributionItem[]>([]);
    const [dataOverTime, setDataOverTime] = useState<RequestsOverTimePoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statusData, overTimeData] = await Promise.all([
                fetchStatusDistribution(),
                fetchRequestsOverTime(),
            ]);

            if (!isMountedRef.current) return;
            setDataStatus(statusData);
            setDataOverTime(
                overTimeData.map((item: RequestsOverTimeItem) => ({
                    date: formatApiUtcToLocalDate(item.date),
                    count: item.value,
                }))
            );
        } catch (err) {
            if (!isMountedRef.current) return;
            setError(getErrorMessage(err, "Failed to load statistics"));
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        void loadStatistics();
        return () => { isMountedRef.current = false; };
    }, []);

    return {
        dataOverTime,
        dataStatus,
        error,
        loadStatistics,
        loading,
    };
};
