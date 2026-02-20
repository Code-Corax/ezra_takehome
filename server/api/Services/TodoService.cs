using System.ComponentModel.DataAnnotations;
using EfScaffold.Entities;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class TodoService(MyDbContext dbContext) : ITodoService
{
    public async Task<List<Todo> > GetAllTodos()
    {
        return await dbContext.Todos.ToListAsync<Todo>();     
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
        await dbContext.SaveChangesAsync();
        return toCreate;
    }

    public async Task DeleteTodo(string id)
    {
        var toDelete = await GetTodoByIdOrThrow(id);
        dbContext.Todos.Remove(toDelete);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Todo> UpdateIsDone(string id, bool isDoneValue)
    {
        var currentObject = await GetTodoByIdOrThrow(id);

        if(currentObject.IsDone != isDoneValue)
        {
            currentObject.IsDone = isDoneValue;
            dbContext.Todos.Update(currentObject);
            await dbContext.SaveChangesAsync();
        }        
        return currentObject;
    } 

    public async Task<Todo> UpdateTodo(string id, UpdateTodoDto toUpdate)
    {
        var currentObject = await GetTodoByIdOrThrow(id);
        currentObject.Description = toUpdate.description;
        currentObject.Priority = toUpdate.priority;
        currentObject.IsDone = toUpdate.isDone;
        currentObject.Title = toUpdate.title;
        dbContext.Todos.Update(currentObject);
        await dbContext.SaveChangesAsync();
        return currentObject;
    }

    private async Task<Todo> GetTodoByIdOrThrow(string id)
    {
        return await dbContext.Todos.FirstOrDefaultAsync(t => t.Id == id) ?? throw new ValidationException("Id " + id + " could not be found.");
    }
}