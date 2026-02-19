using EfScaffold.Entities;

namespace api.Services;

public interface ITodoService
{
    Task<List<Todo>> GetAllTodos();

    Task<Todo> CreateTodo(CreateTodoDto dto);

    Task<Todo> DeleteTodo(Todo toDelete);

    Task<Todo> ToggleTodo(Todo toToggle);

    Task<Todo> UpdateTodo(string id, UpdateTodoDto toToggle);
}
