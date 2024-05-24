dotnet restore test/TestCSharpApplication/src/TestCSharpApplication/Service1/Service1.csproj -s https://api.nuget.org/v3/index.json
dotnet build test/TestCSharpApplication/src/TestCSharpApplication/Service1/Service1.csproj -v normal

for %%F in ("test/TestCSharpApplication/src/TestCSharpApplication/Service1/Service1.csproj") do cd %%~dpF
dotnet publish -o test/TestCSharpApplication/TestCSharpApplication/Service1Pkg/Code
cd %~dp0/..