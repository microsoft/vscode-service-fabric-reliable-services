dotnet restore %~dp0\..\TestCSharpApplication\src\TestCSharpApplication\Service1\Service1.csproj -s https://api.nuget.org/v3/index.json
dotnet build %~dp0\..\TestCSharpApplication\src\TestCSharpApplication\Service1\Service1.csproj -v normal

for %%F in ("%~dp0\..\TestCSharpApplication\src\TestCSharpApplication\Service1\Service1.csproj") do cd %%~dpF
dotnet publish -o %~dp0\..\TestCSharpApplication\TestCSharpApplication\Service1Pkg\Code
cd %~dp0\..
