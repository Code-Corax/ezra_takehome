using EfScaffold.Entities;
  using Infrastructure.Sqlite.Scaffolding;
  using Microsoft.EntityFrameworkCore;

  namespace api.Tests;

  public static class TestDbHelper
  {
      public static async Task ResetAsync(MyDbContext db)
      {
          // Clear table contents between tests.
          db.Todos.RemoveRange(await db.Todos.ToListAsync());
          await db.SaveChangesAsync();
      }

      public static async Task SeedTodosAsync(MyDbContext db, params Todo[] todos)
      {
          db.Todos.AddRange(todos);
          await db.SaveChangesAsync();
      }

      public static Todo CreateTodo(
          string id,
          string title = "Todo",
          string? description = null,
          bool isDone = false,
          int priority = 0,
          DateOnly? dateCreated = null)
      {
          return new Todo
          {
              Id = id,
              Title = title,
              Description = description,
              IsDone = isDone,
              Priority = priority,
              DateCreated = dateCreated ?? new DateOnly(2026, 1, 1)
          };
      }
  }
