import axiosInstance from "../../axiosInstance";

export const addBroadcastMessage = async (payload: { message: string }): Promise<void> => {
    await axiosInstance.post("/broadcast-messages", payload);
};
