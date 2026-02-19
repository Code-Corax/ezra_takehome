using System.ComponentModel.DataAnnotations;

public record UpdateTodoDto(
    string id,
    [Range(0,5)]
    int priority, 
    string title, 
    string description,
    bool isDone
    );