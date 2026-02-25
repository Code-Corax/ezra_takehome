using Xunit;

  public class FailureProbeTests
  {
      [Fact]
      public void Intentional_Failure_For_CI_Verification()
      {
          Assert.True(false, "Intentional failure to verify CI behavior.");
      }
  }