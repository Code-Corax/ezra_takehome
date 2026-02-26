import { http, HttpResponse } from "msw";

const todosOk = [
    {
        id: "1",
        title: "Test todo",
        description: null,
        isDone: false,
        priority: 2,
        dateCreated: "2026-01-01",
    },
];

export const handlers = [
    http.get("*/todos", () => {
        return HttpResponse.json(todosOk, { status: 200 });
    }),
];