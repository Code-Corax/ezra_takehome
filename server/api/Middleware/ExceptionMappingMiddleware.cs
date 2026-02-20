  using System.ComponentModel.DataAnnotations;
  using System.Text.Json;
  using Microsoft.AspNetCore.Mvc;

  public class ExceptionMappingMiddleware(RequestDelegate next, ILogger<ExceptionMappingMiddleware> logger)
  {
      public async Task Invoke(HttpContext context)
      {
          try
          {
              await next(context);
          }
          catch (ValidationException ex)
          {
              context.Response.StatusCode = StatusCodes.Status404NotFound;
              context.Response.ContentType = "application/problem+json";

              var problem = new ProblemDetails
              {
                  Title = "Resource not found",
                  Detail = ex.Message,
                  Status = StatusCodes.Status404NotFound
              };

              await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
          }
          catch (Exception ex)
          {
              logger.LogError(ex, "Unhandled exception");

              context.Response.StatusCode = StatusCodes.Status500InternalServerError;
              context.Response.ContentType = "application/problem+json";

              var problem = new ProblemDetails
              {
                  Title = "Internal Server Error",
                  Detail = "An unexpected error occurred.",
                  Status = StatusCodes.Status500InternalServerError
              };

              await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
          }
      }
  }
