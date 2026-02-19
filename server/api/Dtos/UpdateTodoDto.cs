using System.ComponentModel.DataAnnotations;

public record UpdateTodoDto(
    [Range(0,5)]
    int priority, 
    string title, 
    string description,
    bool isDone
    );