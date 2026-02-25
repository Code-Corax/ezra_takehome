using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace api.Tests;

public sealed class TodosPutTests : IntegrationTestBase
{
    public TodosPutTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task PutTodo_ValidBody_UpdatesRow_AndReturnsUpdatedDto()
    {
        // Arrange
        var seed = TestDbHelper.CreateTodo(
            id: "todo-put-1",
            title: "Before",
            description: "Before desc",
            isDone: false,
            priority: 1,
            dateCreated: new DateOnly(2026, 1, 2));

        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        var payload = new
        {
            priority = 5,
            title = "After",
            description = "After desc",
            isDone = true
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/todos/{seed.Id}", payload);

        // Assert: HTTP
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var dto = await response.Content.ReadFromJsonAsync<TodoResponseDto>();
        dto.Should().NotBeNull();
        dto!.id.Should().Be(seed.Id);
        dto.title.Should().Be(payload.title);
        dto.description.Should().Be(payload.description);
        dto.priority.Should().Be(payload.priority);
        dto.isDone.Should().Be(payload.isDone);

        // Assert: DB persisted state
        using var verifyScope = Factory.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<MyDbContext>();
        var persisted = await verifyDb.Todos.FindAsync(seed.Id);

        persisted.Should().NotBeNull();
        persisted!.Title.Should().Be(payload.title);
        persisted.Description.Should().Be(payload.description);
        persisted.Priority.Should().Be(payload.priority);
        persisted.IsDone.Should().Be(payload.isDone);
    }

    [Fact]
    public async Task PutTodo_InvalidJson_ReturnsBadRequest()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-put-invalid-json");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        using var request = new HttpRequestMessage(HttpMethod.Put, $"/todos/{seed.Id}")
        {
            Content = new StringContent(
                "{\"priority\": 3, \"title\": \"x\", \"description\": \"y\", \"isDone\": tru",
                Encoding.UTF8,
                "application/json")
        };

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task PutTodo_MissingBody_ReturnsBadRequest()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-put-missing-body");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        using var request = new HttpRequestMessage(HttpMethod.Put, $"/todos/{seed.Id}")
        {
            Content = new StringContent("", Encoding.UTF8, "application/json")
        };

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task PutTodo_InvalidPriority_ReturnsBadRequest()
    {
        // Arrange
        var seed = TestData.OpenTodo("todo-put-invalid-priority");
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, seed);
        }

        var payload = new
        {
            priority = 42, // out of [Range(0,5)]
            title = "Still invalid",
            description = "invalid priority",
            isDone = false
        };

        // Act
        var response = await Client.PutAsJsonAsync($"/todos/{seed.Id}", payload);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
