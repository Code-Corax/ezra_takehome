using EfScaffold.Entities;

namespace api.Tests;

public static class TestData
{
    public static Todo OpenTodo(string id = "todo-open") =>
        TestDbHelper.CreateTodo(
            id: id,
            title: "Open",
            description: "Open item",
            isDone: false,
            priority: 2,
            dateCreated: new DateOnly(2026, 1, 2));

    public static Todo DoneTodo(string id = "todo-done") =>
        TestDbHelper.CreateTodo(
            id: id,
            title: "Done",
            description: "Done item",
            isDone: true,
            priority: 4,
            dateCreated: new DateOnly(2026, 1, 3));
}
