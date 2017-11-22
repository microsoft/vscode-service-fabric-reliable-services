# Service Fabric Extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) extension that provides support for building Service Fabric applications in Visual Studio Code.

## Features

* Create Service Fabric Applications (Java, C#, Container, Guest Executables)
* Build Java and C# Service Fabric applications
* Deploy applications to a local cluster
* Publish applications to a remote cluster
* Remove applications from a cluster
* Debugging for Java and C# Service Fabric Applications

## Requirements

As VS Code is a lightweight editor, a number of dependencies must be first installed before Service Fabric applications can be created using VS Code.

* [Install Visual Studio Code](https://code.visualstudio.com/)
* [Install Node.js](https://nodejs.org/en/)
* [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install Git](https://git-scm.com/)
* Install Yeoman Generators
```sh
npm install -g yo
npm install -g generator-azuresfjava
npm install -g generator-azuresfcsharp
```

## Extension Settings

#### Windows Only

If you are using VS Code on Windows, a bash shell must be installed. Bash on Ubuntu (On Windows) can be installed by following these [instructions](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide).

## Quickstart

#### Setup (Debug)

1. Open a bash shell and navigate to the directory where the extension folder is stored.
2. Run the command **npm install** inside the extension folder.
3. Open the VS Code application.
5. Click on File -> Open Folder and select the folder of the extension.
6. Press the F5 key to begin debugging the extension, a new VS Code window will open with the title of [Extension Development Host].
7. In the new VS Code window click on File -> Open Folder and select a folder in which you would like to create your Service Fabric Project.

## Known Issues

When generating C# Service Fabric projects on Windows, the path in the generated build script contains / instead of \ . This will 
trigger an error that the proj file cannot be found when trying to build the application.

## Release Notes

### 1.0.0

Initial release of Service Fabric for VS Code. In this release the extension adds support for 
creating, building, and deploying applications within the VS Code editor.

-----------------------------------------------------------------------------------------------------------
# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

