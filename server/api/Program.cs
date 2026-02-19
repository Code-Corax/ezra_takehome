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

var app = builder.Build();

app.MapGet("/", ([FromServices]MyDbContext dbContext) => {
    return dbContext.Todos.ToList<Todo>(); 
});

//TODO: is this a safe domain set to allow for cors? seems quite open...
app.UseCors(config => config
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
    .SetIsOriginAllowed(x => true));

app.MapControllers();
app.UseOpenApi(); 
app.UseSwaggerUi();
app.Run();
