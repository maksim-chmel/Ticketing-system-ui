import axios from "axios";
import BASE_URL from "../../config";
import { AuthResponse } from "./types";

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
        `${BASE_URL}/Auth/login`,
        { username, password },
        { withCredentials: true }
    );

    return response.data;
};
