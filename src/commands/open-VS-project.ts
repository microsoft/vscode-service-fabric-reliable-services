import * as vscode from 'vscode';
import {window} from 'vscode';
var path=require('path');
var find=require('find');
var fs=require('fs');
import { generatorProject } from '../yo';
import {getWorkingFolder} from '../yo';


  //var parser=new xml2js.Parser();



 export async function openVSproject(){
     var x=await getWorkingFolder();
    var files = find.fileSync(/\.sfproj$/,x);
    if(files[0]){
     var data=fs.readFileSync(files[0]);
     var isVS=1;
    }
    var appname=path.basename(files[0]).split('.').slice(0, -1).join('.');
     var serviceNameStr = new Array();
    var serviceProjName=new Array();
    var servicePackage=new Array();
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
 ;

 for(i=0;i<numofservices;i++)
 {
  
  serviceProjName[i]=serviceNameStr[i].substring(
    

     serviceNameStr[i].lastIndexOf("\\")+1 , 
     serviceNameStr[i].lastIndexOf(".")
 );
 };
 for(i=0;i<numofservices;i++)
 {
     servicePackage[i]=serviceProjName[i]+'Pkg';
 };


  var values={
       numofservices:numofservices,
       serviceNameStr:serviceNameStr,
      serviceProjName:serviceProjName,
      servicePackage:servicePackage,
       appname:appname,
   
       isVS:isVS
      }
      await fs.writeFileSync(path.join(x,'vscode-config.json'),JSON.stringify(values),(err) => 
       
       {
           if(err) throw err;
       }
      );
      generatorProject(false,true);
   
 };



