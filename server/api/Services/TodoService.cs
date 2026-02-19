using System.ComponentModel.DataAnnotations;
using EfScaffold.Entities;
using Infrastructure.Sqlite.Scaffolding;

namespace api.Services;

public class TodoService(MyDbContext dbContext) : ITodoService
{
    public async Task<List<Todo> > GetAllTodos()
    {
        return dbContext.Todos.ToList<Todo>();     
    }

    public async Task<Todo> CreateTodo(CreateTodoDto dto)
    {
        var toCreate = new Todo()
        {
            Description = dto.description,
            Title = dto.title,
            Id = Guid.NewGuid().ToString(),
            IsDone = false,
            Priority = dto.priority,
            DateCreated = DateOnly.FromDateTime(DateTime.Now)
        };
        dbContext.Todos.Add(toCreate);
        dbContext.SaveChanges();
        return toCreate;
    }

    public async Task<Todo> DeleteTodo(Todo todo)
    {
        var toDelete = dbContext.Todos.FirstOrDefault(t => t.Id == todo.Id) ?? throw new ValidationException("Id " + todo.Id + " could not be found.");
        dbContext.Todos.Attach(toDelete);
        dbContext.Todos.Remove(toDelete);
        dbContext.SaveChanges();
        return toDelete;
    }

    public async Task<Todo> ToggleTodo(Todo toToggle)
    {
        var currentObject = dbContext.Todos.FirstOrDefault(t => t.Id == toToggle.Id) ?? throw new ValidationException("Id " + toToggle.Id + " could not be found.");
        currentObject.IsDone = !toToggle.IsDone;
        dbContext.Todos.Update(currentObject);
        dbContext.SaveChanges();
        return currentObject;
    } 

    public async Task<Todo> UpdateTodo(UpdateTodoDto toUpdate)
    {
        var currentObject = dbContext.Todos.FirstOrDefault(t => t.Id == toUpdate.id) ?? throw new ValidationException("Id " + toUpdate.id + " could not be found.");
        currentObject.Description = toUpdate.description;
        currentObject.Priority = toUpdate.priority;
        currentObject.IsDone = toUpdate.isDone;
        currentObject.Title = toUpdate.title;
        dbContext.Todos.Update(currentObject);
        dbContext.SaveChanges();
        return currentObject;
    }
}