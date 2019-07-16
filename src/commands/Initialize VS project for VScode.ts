import * as vscode from 'vscode';
import { window } from 'vscode';
var path = require('path');
var find = require('find');
var fs = require('fs');
import { generatorProject } from '../yo';
import { getWorkingFolder } from '../yo';
import { cleanCsharpApplication } from './clean-application-csharp';
export async function openVSproject() {
  var x = await getWorkingFolder();
  var files = find.fileSync(/\.sfproj$/, x);
  if (files.length) {
    var data = fs.readFileSync(files[0]);
    var isVS = 1;
  }
  else {
    window.showErrorMessage("This project doesn't contain an SFPROJ file.");
    return;
  }
  var appname = path.basename(files[0]).split('.').slice(0, -1).join('.');
  var services = [];
  var serviceProjName = new Array();
  var servicePackage = new Array();
  var serviceNameStr = new Array();
  var csprojdata = new Array();
  var interfaceprojpath = new Array();
  var csprojinfo;
  var appPackagePath = appname;
  var i;
  var parseString = require('xml2js').parseString;
  var configjs;
  await parseString(data, function (err, result) {
    configjs = result;
  });
  var l = 0;
  for (l = 0; l < configjs["Project"]["ItemGroup"].length; l++) {
    if (configjs["Project"]["ItemGroup"][l]["ProjectReference"] != undefined)
      break;
  }
  console.log(l);
  var numofservices = Object.keys(configjs["Project"]["ItemGroup"][l]["ProjectReference"]).length;
  for (i = 0; i < numofservices; i++) {
    serviceNameStr[i] = configjs["Project"]["ItemGroup"][l]["ProjectReference"][i]["$"]["Include"];
  }
  for (i = 0; i < numofservices; i++) {
    serviceProjName[i] = serviceNameStr[i].substring(
      serviceNameStr[i].lastIndexOf("\\") + 1,
      serviceNameStr[i].lastIndexOf(".")
    );
    var root = await getWorkingFolder();
    var p1 = path.join(root, serviceProjName[i], serviceProjName[i] + '.csproj');
    csprojdata[i] = fs.readFileSync(p1);
    await parseString(csprojdata[i], function (err, result) {
      csprojinfo = result;
    });
    for (l = 0; l < configjs["Project"]["PropertyGroup"].length; l++) {
      if (configjs["Project"]["PropertyGroup"][l] != undefined)
        break;
    }

    if (csprojinfo["Project"]["PropertyGroup"][l]["TargetFramework"] == undefined) {
      window.showErrorMessage("Only DotNetCore projects can be initialized for VSCode");
      return;
    }
    for (l = 0; l < csprojinfo["Project"]["ItemGroup"].length; l++) {
      if (csprojinfo["Project"]["ItemGroup"][l]["ProjectReference"] != undefined)
        break;
    }
    var k;
    if (l < csprojinfo["Project"]["ItemGroup"].length - 1) {
      for (k = 0; k < csprojinfo["Project"]["ItemGroup"][l]["ProjectReference"].length; k++) {
        if (csprojinfo["Project"]["ItemGroup"][l]["ProjectReference"][k]["$"]["Include"] != undefined)
          break;
      }
      interfaceprojpath[i] = csprojinfo["Project"]["ItemGroup"][l]["ProjectReference"][k]["$"]["Include"];
    }
    var servicemanifestdata;
    await parseString(fs.readFileSync(path.join(root, serviceProjName[i], "PackageRoot", "ServiceManifest.xml")), function (err, result) {
      servicemanifestdata = result;
    });
    servicePackage[i] = servicemanifestdata['ServiceManifest']['$']['Name'];
    if (interfaceprojpath == undefined) {
      services.push({ serviceProjName: serviceProjName[i], servicePackage: servicePackage[i] });
    }
    else {
      services.push({ serviceProjName: serviceProjName[i], servicePackage: servicePackage[i], interfaceprojpath: interfaceprojpath[i] });
    }
  };
  var values = {
    appname: appname,
    numofservices: numofservices,
    services: services,
  }
  await fs.writeFileSync(path.join(x, 'vscode-config.json'), JSON.stringify(values), (err) => {
    if (err) throw err;
  }
  );
  generatorProject(false, true);
  cleanCsharpApplication();
  return new Promise((resolve, reject) => {
    resolve();
  });
}




