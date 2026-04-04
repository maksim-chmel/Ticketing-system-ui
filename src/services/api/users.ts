import axiosInstance from "../../axiosInstance";
import { UserDto } from "./types";

export const fetchUsers = async (): Promise<UserDto[]> => {
    const response = await axiosInstance.get<UserDto[]>("/user/users-to-list");
    return response.data;
};

export const updateUserComment = async (payload: { userId: number; comment: string }): Promise<void> => {
    await axiosInstance.post("/user/update-comment", payload);
};
