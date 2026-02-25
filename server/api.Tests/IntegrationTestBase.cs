using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;

namespace api.Tests;

public abstract class IntegrationTestBase : IClassFixture<ApiWebApplicationFactory>, IAsyncLifetime
{
    protected readonly ApiWebApplicationFactory Factory;
    protected readonly HttpClient Client;

    protected IntegrationTestBase(ApiWebApplicationFactory factory)
    {
        Factory = factory;
        Client = factory.CreateClient();
    }

    public virtual async Task InitializeAsync()
    {
        using var scope = Factory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        await TestDbHelper.ResetAsync(db);
    }

    public virtual async Task DisposeAsync()
    {
        using var scope = Factory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        await TestDbHelper.ResetAsync(db);
    }
}
