import { useEffect, useState } from "react";
import {
    fetchRequestsOverTime,
    fetchStatusDistribution,
    RequestsOverTimeItem,
    StatusDistributionItem
} from "../api";
import { getErrorMessage } from "../utils/getErrorMessage";

interface RequestsOverTimePoint {
    date: string;
    count: number;
}

export const useStatisticsData = () => {
    const [dataStatus, setDataStatus] = useState<StatusDistributionItem[]>([]);
    const [dataOverTime, setDataOverTime] = useState<RequestsOverTimePoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statusData, overTimeData] = await Promise.all([
                fetchStatusDistribution(),
                fetchRequestsOverTime(),
            ]);

            setDataStatus(statusData);
            setDataOverTime(
                overTimeData.map((item: RequestsOverTimeItem) => ({
                    date: item.date,
                    count: item.value,
                }))
            );
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load statistics"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadStatistics();
    }, []);

    return {
        dataOverTime,
        dataStatus,
        error,
        loadStatistics,
        loading,
    };
};
