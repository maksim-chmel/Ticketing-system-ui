import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { fetchFeedbacks, FeedbackStatus, updateFeedbackStatus } from "../../api";
import FeedbackTable from "./FeedbackTable";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        isAxiosError: () => false,
    },
    isAxiosError: () => false,
}), { virtual: true });

jest.mock("../../api", () => ({
    fetchFeedbacks: jest.fn(),
    updateFeedbackStatus: jest.fn(),
    claimFeedback: jest.fn(),
    fetchFeedbackHistory: jest.fn(),
    FeedbackStatus: {
        Open: "Open",
        InProgress: "InProgress",
        Waiting: "Waiting",
        Done: "Done",
        Rejected: "Rejected",
    },
}));

jest.mock("../../auth/AuthContext", () => ({
    useAuth: () => ({ adminName: "testadmin" }),
}));

const mockedFetchFeedbacks = fetchFeedbacks as jest.MockedFunction<typeof fetchFeedbacks>;
const mockedUpdateFeedbackStatus = updateFeedbackStatus as jest.MockedFunction<typeof updateFeedbackStatus>;

const feedbacksFixture = [
    {
        id: 101,
        userId: 5001,
        comment: "Internet is down in office",
        username: "alice",
        phone: "+49 123 456 789",
        createdDate: "2026-04-01T10:00:00Z",
        status: FeedbackStatus.Open,
        assignedAdminId: null,
        assignedAdminName: null,
    },
    {
        id: 102,
        userId: 5002,
        comment: "Printer issue on floor 3",
        username: "bob",
        phone: "+49 555 111 222",
        createdDate: "2026-04-02T11:30:00Z",
        status: FeedbackStatus.Waiting,
        assignedAdminId: null,
        assignedAdminName: null,
    },
];

describe("FeedbackTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("filters tickets by search query", async () => {
        mockedFetchFeedbacks.mockResolvedValue({ items: feedbacksFixture, totalCount: feedbacksFixture.length });

        render(<FeedbackTable />);

        expect(await screen.findByText("alice")).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText(/search by id, name, phone/i), {
            target: { value: "555111222" },
        });

        expect(screen.queryByText("alice")).not.toBeInTheDocument();
        expect(screen.getByText("bob")).toBeInTheDocument();
    });

    it("updates ticket status from available actions", async () => {
        mockedFetchFeedbacks.mockResolvedValue({ items: feedbacksFixture, totalCount: feedbacksFixture.length });
        mockedUpdateFeedbackStatus.mockResolvedValue();

        render(<FeedbackTable />);

        await screen.findByText("alice");

        const row = screen.getByRole("row", { name: /alice/i });

        fireEvent.click(within(row).getByRole("button", { name: /in progress/i }));

        await waitFor(() => {
            expect(mockedUpdateFeedbackStatus).toHaveBeenCalledWith(101, FeedbackStatus.InProgress);
        });

        expect(screen.getAllByText("In Progress").length).toBeGreaterThan(0);
    });

    it("retries loading after initial fetch failure", async () => {
        mockedFetchFeedbacks
            .mockRejectedValueOnce(new Error("boom"))
            .mockResolvedValueOnce({ items: feedbacksFixture, totalCount: feedbacksFixture.length });

        render(<FeedbackTable />);

        expect(await screen.findByText(/failed to load tickets/i)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /try again/i }));

        expect(await screen.findByText("alice")).toBeInTheDocument();
        expect(mockedFetchFeedbacks).toHaveBeenCalledTimes(2);
    });
});
