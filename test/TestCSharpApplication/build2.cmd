dotnet restore %~dp0/../TestCSharpApplication/src/TestCSharpApplication/Service1/Service1.csproj -s https://api.nuget.org/v3/index.json
dotnet build %~dp0/../TestCSharpApplication/src/TestCSharpApplication/Service1/Service1.csproj -v normal
