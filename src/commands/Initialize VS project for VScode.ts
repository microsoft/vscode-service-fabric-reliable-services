import * as vscode from 'vscode';
import {window} from 'vscode';
var path=require('path');
var find=require('find');
var fs=require('fs');

import { generatorProject } from '../yo';
import {getWorkingFolder} from '../yo';
import {cleanCsharpApplication} from './clean-application-csharp';

  //var parser=new xml2js.Parser();

  

 export async function openVSproject(){
     var x=await getWorkingFolder();
    var files = find.fileSync(/\.sfproj$/,x);
    if(files.length){
     var data=fs.readFileSync(files[0]);
     var isVS=1;
    }
    else{
      window.showErrorMessage("This is not a VS project");
    }
    var appname=path.basename(files[0]).split('.').slice(0, -1).join('.');
     var services = [];
   var serviceProjName=new Array();
    var servicePackage=new Array();
    var serviceNameStr=new Array();
    var csprojdata=new Array();
    var interfaceprojpath=new Array();
    var csprojinfo;
    var appPackagePath=appname;
    var i;
    /*var files=await fs.readdirSync(x);
    var appname=files[1];*/
    var parseString = require('xml2js').parseString;
    var configjs;
     await parseString(data, function(err, result) {
         configjs = result;
    });
     var numofservices = Object.keys(configjs["Project"]["ItemGroup"][3]["ProjectReference"]).length;
  for(i=0;i<numofservices;i++)
 {
    serviceNameStr[i]=configjs["Project"]["ItemGroup"][3]["ProjectReference"][i]["$"]["Include"];  
 }
 for(i=0;i<numofservices;i++)
 {
  serviceProjName[i]=serviceNameStr[i].substring(
    serviceNameStr[i].lastIndexOf("\\")+1 , 
    serviceNameStr[i].lastIndexOf(".")
 );
     var root = await getWorkingFolder();
     var p1=path.join(root,serviceProjName[i],serviceProjName[i]+'.csproj');
     csprojdata[i]=fs.readFileSync(p1);
        await parseString(csprojdata[i],function(err, result){
        csprojinfo=result;
    });
    if(csprojinfo["Project"]["ItemGroup"][1]!=undefined)
    {
      interfaceprojpath[i]=csprojinfo["Project"]["ItemGroup"][1]["ProjectReference"][0]["$"]["Include"];
    }
    
     servicePackage[i]=serviceProjName[i]+'Pkg';
     if(interfaceprojpath==undefined){
     services.push({serviceProjName:serviceProjName[i],servicePackage:servicePackage[i]});
     }
     else
     {
       services.push({serviceProjName:serviceProjName[i],servicePackage:servicePackage[i],interfaceprojpath:interfaceprojpath[i]});
     }
 };
  var values={
           appname:appname,
           numofservices:numofservices,
           services:services,
           }
      
      await fs.writeFileSync(path.join(x,'vscode-config.json'),JSON.stringify(values),(err) => 
       {
           if(err) throw err;
       }
      );
      generatorProject(false,true);
      return new Promise((resolve, reject) => {
        resolve();
    });
 };
 openVSproject().then(res => cleanCsharpApplication());
 



