using FluentAssertions;
using System.Net;
using System.Text.Json;

namespace api.Tests;

public sealed class ProblemDetailsTests : IntegrationTestBase
{
    public ProblemDetailsTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task MissingResource_ReturnsProblemDetails404_WithExpectedFields()
    {
        // Act
        var response = await Client.DeleteAsync("/todos/non-existent-id");

        // Assert: status + content-type
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");

        // Assert: schema fields
        var raw = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(raw);

        var root = doc.RootElement;
        root.TryGetProperty("title", out var title).Should().BeTrue();
        root.TryGetProperty("status", out var status).Should().BeTrue();
        root.TryGetProperty("detail", out var detail).Should().BeTrue();

        title.GetString().Should().Be("Resource not found");
        status.GetInt32().Should().Be(404);
        detail.GetString().Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task UnhandledException_ReturnsProblemDetails500_WithExpectedFields()
    {
        var response = await Client.GetAsync("/__test/throw-500");

        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/problem+json");

        var raw = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(raw);
        var root = doc.RootElement;

        root.TryGetProperty("title", out var title).Should().BeTrue();
        root.TryGetProperty("status", out var status).Should().BeTrue();
        root.TryGetProperty("detail", out var detail).Should().BeTrue();

        title.GetString().Should().Be("Internal Server Error");
        status.GetInt32().Should().Be(500);
        detail.GetString().Should().Be("An unexpected error occurred.");
    }

}
