using System.ComponentModel.DataAnnotations;


public record CreateTodoDto(
    [Range(0,5)]
    int priority, 
    string title, 
    string description);