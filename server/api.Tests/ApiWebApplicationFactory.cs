using Infrastructure.Sqlite.Scaffolding;
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.AspNetCore.Mvc.Testing;
  using Microsoft.Data.Sqlite;
  using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.DependencyInjection.Extensions;

  public sealed class ApiWebApplicationFactory : WebApplicationFactory<Program>
  {
      private SqliteConnection? _connection;

      protected override void ConfigureWebHost(IWebHostBuilder builder)
      {
          builder.UseEnvironment("Testing");

          builder.ConfigureServices(services =>
          {
              // Replaced in step 4
              
          });
      }

      protected override void Dispose(bool disposing)
      {
          base.Dispose(disposing);
          _connection?.Dispose();
      }
  }
