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

    public async Task DeleteTodo(string id)
    {
        var toDelete = GetTodoByIdOrThrow(id);
        dbContext.Todos.Remove(toDelete);
        dbContext.SaveChanges();
    }

    public async Task<Todo> UpdateIsDone(string id, bool isDoneValue)
    {
        var currentObject = GetTodoByIdOrThrow(id);

        if(currentObject.IsDone != isDoneValue)
        {
            currentObject.IsDone = isDoneValue;
            dbContext.Todos.Update(currentObject);
            dbContext.SaveChanges();
        }        
        return currentObject;
    } 

    public async Task<Todo> UpdateTodo(string id, UpdateTodoDto toUpdate)
    {
        var currentObject = GetTodoByIdOrThrow(id);
        currentObject.Description = toUpdate.description;
        currentObject.Priority = toUpdate.priority;
        currentObject.IsDone = toUpdate.isDone;
        currentObject.Title = toUpdate.title;
        dbContext.Todos.Update(currentObject);
        dbContext.SaveChanges();
        return currentObject;
    }

    private Todo GetTodoByIdOrThrow(string id)
    {
        return dbContext.Todos.FirstOrDefault(t => t.Id == id) ?? throw new ValidationException("Id " + id + " could not be found.");
    }
}