using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace api.Tests;

public sealed class TodosPatchTests : IntegrationTestBase
{
    public TodosPatchTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task PatchIsDone_NoOpSameValue_ReturnsSuccess_AndStateUnchanged()
    {
        // Arrange
        var seed = TestDbHelper.CreateTodo(
            id: "todo-1",
            title: "Existing",
            description: "Seed",
            isDone: false,
            priority: 2,
            dateCreated: new DateOnly(2026, 1, 2));

        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        var payload = new { isDone = false }; // same value

        // Act
        var response = await Client.PatchAsJsonAsync($"/todos/{seed.Id}", payload);

        // Assert: HTTP
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var dto = await response.Content.ReadFromJsonAsync<TodoResponseDto>();
        dto.Should().NotBeNull();
        dto!.id.Should().Be(seed.Id);
        dto.isDone.Should().BeFalse();

        // Assert: DB unchanged for isDone
        using var verifyScope = Factory.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<MyDbContext>();
        var persisted = await verifyDb.Todos.FindAsync(seed.Id);
        persisted.Should().NotBeNull();
        persisted!.IsDone.Should().BeFalse();
        persisted.Title.Should().Be(seed.Title);
        persisted.Priority.Should().Be(seed.Priority);
    }

    [Fact]
    public async Task PatchIsDone_InvalidJson_ReturnsBadRequest()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-invalid-json");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        using var request = new HttpRequestMessage(HttpMethod.Patch, $"/todos/{seed.Id}");
        request.Content = new StringContent("{\"isDone\": tru", System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task PatchIsDone_MissingBody_ReturnsBadRequest()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-missing-body");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        using var request = new HttpRequestMessage(HttpMethod.Patch, $"/todos/{seed.Id}")
        {
            Content = new StringContent("", System.Text.Encoding.UTF8, "application/json")
        };

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
