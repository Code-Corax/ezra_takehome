using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace api.Tests;

public sealed class RootEndpointTests : IntegrationTestBase
{
    public RootEndpointTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task RootGet_ReturnsTodoResponseDtoShape()
    {
        // Arrange
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(
                db,
                TestDbHelper.CreateTodo(
                    id: "root-1",
                    title: "Root Todo",
                    description: null,
                    isDone: false,
                    priority: 2,
                    dateCreated: new DateOnly(2026, 1, 4)));
        }

        // Act
        var response = await Client.GetAsync("/");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<List<TodoResponseDto>>();
        payload.Should().NotBeNull();
        payload!.Should().ContainSingle(x => x.id == "root-1");
        payload.Single(x => x.id == "root-1").description.Should().BeNull();
    }
}