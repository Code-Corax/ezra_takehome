using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace api.Tests;

public sealed class TodosPostTests : IntegrationTestBase
{
    public TodosPostTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task PostTodo_ReturnsExpectedContract_WithGeneratedIdAndDefaults()
    {
        var payload = new
        {
            priority = 3,
            title = "Write tests",
            description = "Create integration tests"
        };

        var response = await Client.PostAsJsonAsync("/todos", payload);

        // Assert: HTTP response
        response.StatusCode.Should().Be(HttpStatusCode.OK); // change to Created if your API returns 201
        var dto = await response.Content.ReadFromJsonAsync<TodoResponseDto>();
        dto.Should().NotBeNull();
        dto!.id.Should().NotBeNullOrWhiteSpace();
        dto.title.Should().Be(payload.title);
        dto.description.Should().Be(payload.description);
        dto.priority.Should().Be(payload.priority);
        dto.isDone.Should().BeFalse();
        dto.dateCreated.Should().NotBe(default);

        // Assert: persisted DB state
        using var scope = Factory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        var created = await db.Todos.FindAsync(dto.id);
        created.Should().NotBeNull();
        created!.Title.Should().Be(payload.title);
        created.Description.Should().Be(payload.description);
        created.Priority.Should().Be(payload.priority);
        created.IsDone.Should().BeFalse();
    }

    [Fact]
    public async Task PostTodo_InvalidPriority_ReturnsBadRequest()
    {
        // Arrange
        var payload = new
        {
            priority = 99, // invalid by [Range(0,5)]
            title = "Bad",
            description = "Bad payload"
        };

        var response = await Client.PostAsJsonAsync("/todos", payload);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}