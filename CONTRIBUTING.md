# Contributing

## Ideas, features and bugs
We are open to all ideas and we want to get rid of bugs! Use the Issues section to either report a new issue, provide your ideas or contribute to existing threads.

## Documentation
Found a typo or strangely worded sentences? Submit a PR!

## Development
The instructions below cover how to set up your development environment to contribute to the plugin.

### Prerequisites 
 As VS Code is a lightweight editor, a number of dependencies must be first installed before Service Fabric applications can be created using VS Code.

* [Install Visual Studio Code](https://code.visualstudio.com/)
* [Install Node.js](https://nodejs.org/en/)
* [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install Git](https://git-scm.com/)
* [Install Service Fabric SDK](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started)
* [Install .Net Core on Ubuntu](https://www.microsoft.com/net/learn/get-started/linuxredhat)
* Install Yeoman Generators
    ```sh
    npm install -g yo
    npm install -g generator-azuresfjava
    npm install -g generator-azuresfcsharp
    npm install -g generator-azuresfcontainer
    npm install -g generator-azuresfguest
    ```
### Development
1. Open a bash shell or command prompt and navigate to the directory where the extension folder is stored.
2. Run the command **npm install** inside the extension folder.
3. Open the VS Code application.
5. Click on File -> Open Folder and select the folder of the extension.
6. Press the F5 key to begin debugging the extension, a new VS Code window will open with the title of [Extension Development Host].
7. In the new VS Code window click on File -> Open Folder and select a folder in which you would like to create your Service Fabric Project.

### Testing
After any new additions to the code you can do a basic unit testing available which tests the build command(only C#) by starting debug in Launch tests mode. Make sure you have 'TestCSharpApp' available in your test directory for testing. The test tries to build this application