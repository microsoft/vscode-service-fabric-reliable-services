import * as vscode from 'vscode';
import { getWorkingFolder } from '../yo'
import { win32 } from 'path';
var checkFilesExist = require('check-files-exist');
var filter = require('filter-files');
var find = require('find');
var ff = require('node-find-folder');
const fs = require('fs-extra');
var ind=require('../yo/index');
var configfilename=ind.configfilename;
export async function cleanCsharpApplication() {
    var root = await getWorkingFolder();
    var path = require('path');
    if (fs.existsSync(path.join(root, configfilename))) {
        var data = path.join(root, configfilename);
        var words = fs.readFileSync(data);
        var tst = JSON.parse(words);
        var appname = tst.appname;
        if (fs.existsSync(path.join(root, appname, appname))) {
            fs.remove(path.join(root, appname, appname));
        }
    }
    else {
        var codefolders = find.dirSync('Code', root);
        var i;
        var len = codefolders.length;
        for (i = 0; i < len; i++) {
            fs.remove(codefolders[i], err => {
                console.error(err)
            });
        }

    }
   


}