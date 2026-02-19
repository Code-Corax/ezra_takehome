using System;
using System.Collections.Generic;

namespace EfScaffold.Entities;

public partial class Todo
{
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public bool IsDone { get; set; }

    public DateOnly DateCreated { get; set; }

    public int Priority { get; set; }
}
