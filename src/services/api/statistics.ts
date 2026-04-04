import axiosInstance from "../../axiosInstance";
import { RequestsOverTimeItem, StatusDistributionItem } from "./types";

export const fetchStatusDistribution = async (): Promise<StatusDistributionItem[]> => {
    const response = await axiosInstance.get<StatusDistributionItem[]>("/statistics/status-distribution");
    return response.data;
};

export const fetchRequestsOverTime = async (): Promise<RequestsOverTimeItem[]> => {
    const response = await axiosInstance.get<RequestsOverTimeItem[]>("/statistics/requests-over-time");
    return response.data;
};
