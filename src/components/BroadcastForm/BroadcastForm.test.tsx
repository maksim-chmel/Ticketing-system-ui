import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { addBroadcastMessage } from "../../api";
import BroadcastForm from "./BroadcastForm";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        isAxiosError: () => false,
    },
    isAxiosError: () => false,
}), { virtual: true });

jest.mock("../../api", () => ({
    addBroadcastMessage: jest.fn(),
}));

const mockedAddBroadcastMessage = addBroadcastMessage as jest.MockedFunction<typeof addBroadcastMessage>;

describe("BroadcastForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("sends broadcast message", async () => {
        mockedAddBroadcastMessage.mockResolvedValue("Broadcast queued");

        render(<BroadcastForm />);

        fireEvent.change(screen.getByPlaceholderText(/enter your message/i), {
            target: { value: "  Important notice  " },
        });

        fireEvent.click(screen.getByRole("button", { name: /send broadcast/i }));

        await waitFor(() => {
            expect(mockedAddBroadcastMessage).toHaveBeenCalledWith({ message: "Important notice" });
        });

        expect(await screen.findByText("Broadcast queued")).toBeInTheDocument();
    });

    it("shows validation error for empty message", async () => {
        render(<BroadcastForm />);

        fireEvent.click(screen.getByRole("button", { name: /send broadcast/i }));

        expect(await screen.findByText(/message cannot be empty/i)).toBeInTheDocument();
        expect(mockedAddBroadcastMessage).not.toHaveBeenCalled();
    });
});
