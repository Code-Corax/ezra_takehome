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

app.MapGet("/", ([FromServices]MyDbContext dbContext) => {
    return dbContext.Todos.ToList<Todo>(); 
});

app.UseCors("ApiCors");
app.UseMiddleware<ExceptionMappingMiddleware>();
app.MapControllers();
app.UseOpenApi(); 
app.UseSwaggerUi();
app.Run();
