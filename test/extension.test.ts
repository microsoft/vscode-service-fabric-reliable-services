//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
//import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as build from '../src/commands/build-application';

import * as vars from '../src/commands/osdetector';
import { stat } from 'fs';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';
const exec = require('child_process').exec;

var assert = require('assert');
describe('ExtensionTests', function() {
  //this.timeout(1000000);
  describe('Create and Build Success', function() {
    //this.timeout(1000000);
    it('should return 0 when the build succeeds',async function() {
      //this.slow(1000000000);
        this.timeout(0);
        //await build.buildApplication();
        await build.buildCSharpApplication(false)
        .then( output => assert.equal(output,0))
        .catch(output => assert.equal(output,0));
    });
  });
});

