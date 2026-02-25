using Infrastructure.Sqlite.Scaffolding;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

public sealed class ApiWebApplicationFactory : WebApplicationFactory<Program> {

    private SqliteConnection? _connection;

    public IServiceScope CreateScope() => Services.CreateScope();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        services.RemoveAll(typeof(DbContextOptions<MyDbContext>));
        services.RemoveAll(typeof(MyDbContext));

        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseSqlite(_connection!);
        });

        using var scope = services.BuildServiceProvider().CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        db.Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        _connection?.Dispose();
    }
}
