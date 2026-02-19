using api.Services;
using EfScaffold.Entities;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("todos")]
public class TodoController(ITodoService todoService) : ControllerBase
{
    [Route(nameof(GetAllTodos))]
    [HttpGet]
    public async Task<ActionResult<List<Todo>>> GetAllTodos()
    {
        return await todoService.GetAllTodos();
    }

    [Route(nameof(CreateTodo))] 
    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo([FromBody] CreateTodoDto dto)
    {
    return await todoService.CreateTodo(dto);
    }

    [Route(nameof(DeleteTodo))]
    [HttpDelete]
    public async Task<ActionResult<Todo>> DeleteTodo([FromBody]Todo toDelete)
    {
        return await todoService.DeleteTodo(toDelete);
        
    }

    [Route(nameof(ToggleDone))]
    [HttpPut] //Todo: validate that put is the right, instead of post
    public async Task<ActionResult<Todo>> ToggleDone([FromBody] Todo toToggle)
    {
        return await todoService.ToggleTodo(toToggle);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Todo>> UpdateTodo([FromRoute] string id, [FromBody] UpdateTodoDto toUpdate)
    {
        return await todoService.UpdateTodo(id, toUpdate);
    }

}