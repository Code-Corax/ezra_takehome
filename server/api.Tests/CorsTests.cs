using FluentAssertions;
using System.Net;

namespace api.Tests;

public sealed class CorsTests : IntegrationTestBase
{
    public CorsTests(ApiWebApplicationFactory factory) : base(factory) { }

    [Fact]
    public async Task Options_Preflight_AllowedOrigin_ReturnsCorsHeaders()
    {
        // Arrange
        using var request = new HttpRequestMessage(HttpMethod.Options, "/todos");
        request.Headers.Add("Origin", "http://localhost:5173");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await Client.SendAsync(request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        response.Headers.Should().Contain(h => h.Key == "Access-Control-Allow-Origin");
        response.Headers.GetValues("Access-Control-Allow-Origin")
            .Should().Contain("http://localhost:5173");
    }
}