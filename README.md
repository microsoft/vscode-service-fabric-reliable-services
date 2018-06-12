# Service Fabric Extension for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) extension that provides support for building Service Fabric applications in Visual Studio Code.

## Features

* Create Service Fabric Applications (Java, C#, Container, Guest Executables)
* Build Java and C# Service Fabric applications
* Deploy applications to a local cluster
* Publish applications to a remote cluster
* Remove applications from a cluster
* Debugging for Java and C# Service Fabric Applications(on Linux)

![Service Fabric Commands in Visual Studio Code](./media/sf-commands.png)

## Requirements

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

## Quickstart

### Setup

1. Open the VS Code application.
2. Click on the extension icon in the explorer. Search for Service Fabric. Click install for the Service Fabric extension.

### Commands
The Service Fabric extension for VS Code helps developers to create and deploy Service Fabric projects using many commands. Commands can be called pressing (Ctrl + Shift + p), typing the command name into the input bar, and selecting the desired command for the prompt list.

* Service Fabric: Create Application
* Service Fabric: Publish Application
* Service Fabric: Deploy Application
* Service Fabric: Remove Application
* Service Fabric: Build Application
* Service Fabric: Clean Application

#### Service Fabric: Create Application

The Service Fabric: Create Application command allows you to create a new Service Fabric application in your current workspace. Depending on the yeoman generators that are installed you can create several types of Service Fabric application including Java, C#, Container, and Guest projects.

1.  Select the command Service Fabric: Create Application
2.  Select the type of your current Service Fabric application
3.  Enter the name of application you want to create
3.  Select the type of service that you would like to create in your Service Fabric application
4.  Follow the prompts for naming the service
5.  The new Service Fabric application will appear in the workspace
6.  Open the new folder so that this becomes the root folder in the workspace and you can continue executing the other commands from here

#### Service Fabric: Add Service
The Service Fabric: Add Service command allows you to create a new service to an existing Service Fabric application. The application that the service will be added to must be the root directory of the workspace.

1.  Select the command Service Fabric: Add Service
2.  Select the type of your current Service Fabric application
3.  Select the type of service that you would like to add to your Service Fabric application
4.  Follow the prompts for naming the service
5.  The new service will appear in your project directory

#### Service Fabric: Publish Application
The Service Fabric: Publish Application command deploys your Service Fabric application on a remote cluster the can be either secure or unsecure or on a local cluster if parameters are not mentioned in Cloud.json

1.  The first time that the application is built, a Cloud.json file will be generated in the project directory
2.  Input the values for the cluster that you would like to connect in the Cloud.json file
3.  Select the command Service Fabric: Publish Application
4.  View the Service Fabric Explorer of the desired cluster to ensure that the application has been installed
    Note : If required parameters are not mentioned then the application will be deployed to local cluster(if available)

#### Service Fabric: Deploy Application (Localhost)
The Service Fabric: Deploy Application command deploys your Service Fabric application on a one box cluster if you currently have one running.

1.  Select the command Service Fabric: Deploy Application
2.  View the Service Fabric Explorer of the local cluster to ensure that the application has been installed
3.  One can also use Service Fabric: Publish Application command with no paramters in Cloud.json file to deploy to a local cluster

#### Service Fabric: Remove Application
The Service Fabric: Remove Application command removes a Service Fabric application from the cluster that it was deployed to through the VS Code extension.

1.  Select the command Service Fabric: Remove Application
2.  View the Service Fabric Explorer to ensure that the application was removed

#### Service Fabric: Build Application
The Service Fabric: Build Application command can build either Java or C# Service Fabric Application

1.  Make sure you are in the application root folder before executing this command. This command will identify type of application(C# or Java) 
    and fires build accordingly
2.  Select the command Service Fabric: Build Application
3.  The output of the build process will be output in the integrated terminal

   ## NOTE : Service Fabric Java applications can be developed on windows but only can be deployed onto Linux Clusters.

-----------------------------------------------------------------------------------------------------------

# Legal

Before we can accept your pull request you will need to sign a **Contribution License Agreement**. All you need to do is to submit a pull request, then the PR will get appropriately labelled (e.g. `cla-required`, `cla-norequired`, `cla-signed`, `cla-already-signed`). If you already signed the agreement we will continue with reviewing the PR, otherwise system will tell you how you can sign the CLA. Once you sign the CLA all future PR's will be labeled as `cla-signed`.

## Contributing 
[Contributing](https://github.com/Azure/service-fabric-vscode/blob/master/CONTRIBUTING.md)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Telemetry

VS Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409) to learn more. If you don’t wish to send usage data to Microsoft, you can set the `telemetry.enableTelemetry` setting to `false`. Learn more in our [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).

## License

[MIT](LICENSE)
