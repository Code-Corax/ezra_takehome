using api.Services;
using EfScaffold.Entities;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
      ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is not configured.");

builder.Services.AddDbContext<MyDbContext>(conf =>
    {
        conf.UseSqlite(connectionString);
    }
);
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();

var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
  {
      options.AddPolicy("ApiCors", policy =>
      {
          policy.WithOrigins(corsOrigins)
                .WithMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .WithHeaders("Content-Type");
      });
  });

var app = builder.Build();

app.MapGet("/", async ([FromServices]MyDbContext dbContext) => {
    var todos = await dbContext.Todos
          .Select(t => new TodoResponseDto(
              id: t.Id,
              title: t.Title,
              description: t.Description,
              isDone: t.IsDone,
              priority: t.Priority,
              dateCreated: t.DateCreated
          ))
          .ToListAsync();

      return Results.Ok(todos);
});

// Test-only endpoint to deterministically verify 500 ProblemDetails mapping.
if (app.Environment.IsEnvironment("Testing"))
{
    app.MapGet("/__test/throw-500", () =>
    {
        throw new InvalidOperationException("Deterministic test exception");
    });
}

app.UseCors("ApiCors");
app.UseMiddleware<ExceptionMappingMiddleware>();
app.MapControllers();
app.UseOpenApi(); 
app.UseSwaggerUi();
app.Run();

public partial class Program { }
