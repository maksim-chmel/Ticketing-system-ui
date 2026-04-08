import axiosInstance from "../../axiosInstance";
import { UserDto } from "./types";

export const fetchUsers = async (): Promise<UserDto[]> => {
    const response = await axiosInstance.get<UserDto[]>("/users");
    return response.data;
};

export const fetchUserById = async (userId: number): Promise<UserDto> => {
    const response = await axiosInstance.get<UserDto>(`/users/${userId}`);
    return response.data;
};

export const updateUserComment = async (payload: { userId: number; comment: string }): Promise<UserDto> => {
    const response = await axiosInstance.patch<UserDto>(`/users/${payload.userId}/comment`, { comment: payload.comment });
    return response.data;
};
