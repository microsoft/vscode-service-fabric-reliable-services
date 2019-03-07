# Change Log
All notable changes to the "vscode-servicefabric" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]
- Initial release

## Version [0.1.3]
- Fix security vulnerability in `lodash` package
- Fix issue in Application Upgrade command

## Version [0.1.4]
- Open the yo generated project in vscode workspace
- Fix yo process not terminating which causes VSCode input menu to hang
- [In generators used internally but consumed from an external source]: Fix application cleanup by invoking application uninstall if install fails