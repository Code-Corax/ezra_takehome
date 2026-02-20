using EfScaffold.Entities;

namespace api.Services;

public interface ITodoService
{
    Task<List<Todo>> GetAllTodos();

    Task<Todo> CreateTodo(CreateTodoDto dto);

    Task DeleteTodo(string id);

    Task<Todo> UpdateIsDone(string id, bool isDoneValue);

    Task<Todo> UpdateTodo(string id, UpdateTodoDto toUpdate);
}
