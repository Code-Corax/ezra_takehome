using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;

namespace api.Tests;

public sealed class StateIsolationTests : IntegrationTestBase
{
    public StateIsolationTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Isolation_BeforeSeed_DatabaseIsEmpty()
    {
        using var scope = Factory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        db.Todos.Count().Should().Be(0);
        await Task.CompletedTask;
    }

    [Fact]
    public async Task Isolation_AfterSeed_TestDataExistsOnlyInThisTest()
    {
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, TestData.OpenTodo("iso-1"));
            db.Todos.Count().Should().Be(1);
        }

        // this assertion proves in-test persistence works
        using var verifyScope = Factory.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<MyDbContext>();
        verifyDb.Todos.Count().Should().Be(1);
    }
}
