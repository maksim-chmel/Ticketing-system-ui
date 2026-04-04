import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "../components/LoginPage/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { login } from "../api";
import { tryRefreshAccessToken } from "../axiosInstance";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    __esModule: true,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>navigate:{to}</div>,
    useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        isAxiosError: () => false,
    },
    isAxiosError: () => false,
}), { virtual: true });

jest.mock("../api", () => ({
    login: jest.fn(),
}));

jest.mock("../axiosInstance", () => ({
    AUTH_UNAUTHORIZED_EVENT: "auth:unauthorized",
    clearStoredToken: jest.fn(() => global.localStorage.removeItem("token")),
    getStoredToken: jest.fn(() => global.localStorage.getItem("token")),
    tryRefreshAccessToken: jest.fn(),
}));

const mockedLogin = login as jest.MockedFunction<typeof login>;
const mockedTryRefreshAccessToken = tryRefreshAccessToken as jest.MockedFunction<typeof tryRefreshAccessToken>;

const AuthProbe = () => {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <div>
            <span data-testid="auth-loading">{String(isLoading)}</span>
            <span data-testid="auth-state">{String(isAuthenticated)}</span>
        </div>
    );
};

describe("Auth flow", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("logs in and stores token", async () => {
        mockedTryRefreshAccessToken.mockRejectedValue(new Error("no session"));
        mockedLogin.mockResolvedValue({ accessToken: "token-123" });

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        fireEvent.change(await screen.findByPlaceholderText(/username/i), {
            target: { value: "admin" },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: "secret" },
        });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
        expect(mockedLogin).toHaveBeenCalledWith("admin", "secret");
        });

        expect(localStorage.getItem("token")).toBe("token-123");
        expect(mockNavigate).toHaveBeenCalledWith("/feedback", { replace: true });
    });

    it("restores session through refresh bootstrap", async () => {
        mockedTryRefreshAccessToken.mockResolvedValue("refreshed-token");

        render(
            <AuthProvider>
                <AuthProbe />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("auth-loading")).toHaveTextContent("false");
        });

        expect(screen.getByTestId("auth-state")).toHaveTextContent("true");
    });

    it("redirects protected route to login when refresh fails", async () => {
        mockedTryRefreshAccessToken.mockRejectedValue(new Error("unauthorized"));

        render(
            <AuthProvider>
                <ProtectedRoute>
                    <div>Secret area</div>
                </ProtectedRoute>
            </AuthProvider>
        );

        expect(await screen.findByTestId("navigate")).toHaveAttribute("data-to", "/login");
    });
});
