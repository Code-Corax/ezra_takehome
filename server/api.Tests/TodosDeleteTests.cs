using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace api.Tests;

public sealed class TodosDeleteTests : IntegrationTestBase
{
    public TodosDeleteTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task DeleteTodo_FirstDelete_RemovesRow_AndReturnsNoContent()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-delete-1");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        // Act
        var response = await Client.DeleteAsync($"/todos/{seed.Id}");

        // Assert: HTTP contract
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Assert: DB row removed
        using var verifyScope = Factory.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<MyDbContext>();
        var deleted = await verifyDb.Todos.FindAsync(seed.Id);
        deleted.Should().BeNull();
    }

    [Fact]
    public async Task DeleteTodo_SecondDelete_FollowsCurrentContract()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-delete-2");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        // First delete succeeds
        var first = await Client.DeleteAsync($"/todos/{seed.Id}");
        first.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Act: second delete on missing resource
        var second = await Client.DeleteAsync($"/todos/{seed.Id}");

        // Assert: current middleware maps missing id -> 404 ProblemDetails
        second.StatusCode.Should().Be(HttpStatusCode.NotFound);
        second.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");
    }
}
