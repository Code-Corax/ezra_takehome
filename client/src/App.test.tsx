import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { server } from "./test/msw/server";
import { renderWithProviders } from "./test/renderWithProviders";
import { toaster } from "./components/ui/toaster-instance";

describe("App MSW integration", () => {
    it("renders todos from mocked GET /todos (success path)", async () => {
        renderWithProviders(<App />);

        expect(await screen.findByText("Test todo")).toBeInTheDocument();
});

it("handles GET /todos failure via MSW override (error path)", async () => {
    const createSpy = vi.spyOn(toaster, "create");
    server.use(
            http.get("*/todos", () =>
                HttpResponse.json({ message: "boom" }, { status: 500 }),
        ),
    );

    const { store } = renderWithProviders(<App />);

    await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
    await waitFor(() => {
        expect(store.getState().todos.error).toBeNull();
    });

    createSpy.mockRestore();
});

describe("App smoke", () => {
    it("renders shell and initial todos from API", async () => {
        renderWithProviders(<App />);

        // Shell assertions (use your actual visible labels)
        expect(screen.getByText(/all tasks/i)).toBeInTheDocument();

        // Initial fetch assertion from MSW default handler
        expect(await screen.findByText("Test todo")).toBeInTheDocument();
        });
    });
});

describe("App filter behavior", () => {
    it("clicking Completed shows only done todos", async () => {
        server.use(
        http.get("*/todos", () =>
            HttpResponse.json([
            {
                id: "1",
                title: "Done item",
                description: null,
                isDone: true,
                priority: 1,
                dateCreated: "2026-01-01",
            },
            {
                id: "2",
                title: "Open item",
                description: null,
                isDone: false,
                priority: 2,
                dateCreated: "2026-01-02",
            },
            ]),
        ),
        );

        renderWithProviders(<App />);
        const user = userEvent.setup();

        expect(await screen.findByText("Done item")).toBeInTheDocument();
        expect(screen.getByText("Open item")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /completed/i }));

        expect(screen.getByText("Done item")).toBeInTheDocument();
        expect(screen.queryByText("Open item")).not.toBeInTheDocument();
    });

    it("clicking Incomplete shows only undone todos", async () => {
        server.use(
        http.get("*/todos", () =>
            HttpResponse.json([
            {
                id: "1",
                title: "Done item",
                description: null,
                isDone: true,
                priority: 1,
                dateCreated: "2026-01-01",
            },
            {
                id: "2",
                title: "Open item",
                description: null,
                isDone: false,
                priority: 2,
                dateCreated: "2026-01-02",
            },
            ]),
        ),
        );

        renderWithProviders(<App />);
        const user = userEvent.setup();

        expect(await screen.findByText("Done item")).toBeInTheDocument();
        expect(screen.getByText("Open item")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /incomplete/i }));

        expect(screen.getByText("Open item")).toBeInTheDocument();
        expect(screen.queryByText("Done item")).not.toBeInTheDocument();
    });

    it("clicking All Tasks resets to full list", async () => {
        server.use(
        http.get("*/todos", () =>
            HttpResponse.json([
            {
                id: "1",
                title: "Done item",
                description: null,
                isDone: true,
                priority: 1,
                dateCreated: "2026-01-01",
            },
            {
                id: "2",
                title: "Open item",
                description: null,
                isDone: false,
                priority: 2,
                dateCreated: "2026-01-02",
            },
            ]),
        ),
        );

        renderWithProviders(<App />);
        const user = userEvent.setup();

        expect(await screen.findByText("Done item")).toBeInTheDocument();
        expect(screen.getByText("Open item")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /completed/i }));
        expect(screen.getByText("Done item")).toBeInTheDocument();
        expect(screen.queryByText("Open item")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /all tasks/i }));

        expect(screen.getByText("Done item")).toBeInTheDocument();
        expect(screen.getByText("Open item")).toBeInTheDocument();
    });
});


describe("App global error toast behavior", () => {
    it("shows toast on API error, clears error, and does not re-toast on rerender", async () => {
        const createSpy = vi.spyOn(toaster, "create");

        server.use(
        http.get("*/todos", () =>
            HttpResponse.json({ message: "boom" }, { status: 500 }),
        ),
        );

        const { rerender, store } = renderWithProviders(<App />);

        // toast API called once
        await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));

        // clearError reducer path ran
        await waitFor(() => {
        expect(store.getState().todos.error).toBeNull();
        });

        // rerender should not create another toast
        rerender(<App />);
        await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));

        createSpy.mockRestore();
    });
});
