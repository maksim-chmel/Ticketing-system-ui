import axiosInstance from "../../axiosInstance";

export const addBroadcastMessage = async (payload: { message: string }): Promise<string> => {
    const response = await axiosInstance.post("/Broadcast/add-broadcastMessage", payload);
    return response.data;
};
