public record TodoResponseDto(

    string id,

    string title,

    string? description,

    bool isDone,

    int priority,

    DateOnly dateCreated
);