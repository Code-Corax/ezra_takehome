using api.Services;
using EfScaffold.Entities;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("todos")]
public class TodoController(ITodoService todoService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TodoResponseDto>>> GetAllTodos()
    {
        var responseTodos = await todoService.GetAllTodos();
        return responseTodos
            .Select(x => ConvertTodoToResponseDto(x) )
            .ToList();
    }

    [HttpPost]
    public async Task<ActionResult<TodoResponseDto>> CreateTodo([FromBody] CreateTodoDto dto)
    {
        var responseTodo = await todoService.CreateTodo(dto);
        return ConvertTodoToResponseDto(responseTodo);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo([FromRoute] string id)
    {
        await todoService.DeleteTodo(id);
        return NoContent(); //204
        
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<TodoResponseDto>> UpdateIsDone([FromRoute] string id, [FromBody] IsDoneUpdateDto isDoneUpdate)
    {
        var responseTodo = await todoService.UpdateIsDone(id, isDoneUpdate.isDone);
        return ConvertTodoToResponseDto(responseTodo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoResponseDto>> UpdateTodo([FromRoute] string id, [FromBody] UpdateTodoDto toUpdate)
    {
        var responseTodo = await todoService.UpdateTodo(id, toUpdate);
        return ConvertTodoToResponseDto(responseTodo);
    }

    private TodoResponseDto ConvertTodoToResponseDto(Todo toConvert)
    {
        return new TodoResponseDto(
            id: toConvert.Id,
            title: toConvert.Title,
            description: toConvert.Description,
            isDone: toConvert.IsDone,
            priority: toConvert.Priority,
            dateCreated: toConvert.DateCreated
        );
    }

}