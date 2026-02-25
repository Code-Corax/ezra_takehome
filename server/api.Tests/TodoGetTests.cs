using FluentAssertions;
using Infrastructure.Sqlite.Scaffolding;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;

namespace api.Tests;

public sealed class TodosGetTests : IntegrationTestBase
{
    public TodosGetTests(ApiWebApplicationFactory factory) : base(factory) {}

    [Fact]
    public async Task GetTodos_ReturnsSeededRows()
    {
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(db, TestData.OpenTodo(), TestData.DoneTodo());
        }

        var response = await Client.GetAsync("/todos");
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<List<TodoResponseDto>>();
        payload.Should().NotBeNull();
        payload!.Count.Should().Be(2);

        using var verifyScope = Factory.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<MyDbContext>();
        verifyDb.Todos.Count().Should().Be(2);
    }

    [Fact]
    public async Task GetTodos_NullDescription_MapsToDtoWithoutFailure()
    {
        using (var scope = Factory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            await TestDbHelper.SeedTodosAsync(
                db,
                TestDbHelper.CreateTodo(
                    id: "null-desc-1",
                    title: "Null Desc",
                    description: null,
                    isDone: false,
                    priority: 1,
                    dateCreated: new DateOnly(2026, 1, 5)));
        }

        var response = await Client.GetAsync("/todos");
        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<List<TodoResponseDto>>();
        payload.Should().NotBeNull();

        var dto = payload!.Single(x => x.id == "null-desc-1");
        dto.description.Should().BeNull();
    }

}
