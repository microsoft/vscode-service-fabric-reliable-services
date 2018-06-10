dotnet restore %~dp0\..\TestWindowsApp\src\TestWindowsApp\Service1\Service1.csproj -s https://api.nuget.org/v3/index.json
dotnet build %~dp0\..\TestWindowsApp\src\TestWindowsApp\Service1\Service1.csproj -v normal

for %%F in ("TestWindowsApp\src\TestWindowsApp\Service1\Service1.csproj") do cd %%~dpF
dotnet publish -o %~dp0\..\TestWindowsApp\TestWindowsApp\Service1Pkg\Code
cd %~dp0\..
