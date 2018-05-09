$AppPath = "$PSScriptRoot\TestWindowsApp"
#$sdkInstallPath = (Get-ItemProperty 'HKLM:\Software\Microsoft\Service Fabric SDK').FabricSDKInstallPath
#$sfSdkPsModulePath = $sdkInstallPath + "Tools\PSModule\ServiceFabricSDK"
#Import-Module $sfSdkPsModulePath\ServiceFabricSDK.psm1

#Connect-ServiceFabricCluster -ConnectionEndpoint localhost:19000
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $AppPath -ApplicationPackagePathInImageStore TestWindowsApp
Register-ServiceFabricApplicationType TestWindowsApp
New-ServiceFabricApplication fabric:/TestWindowsApp TestWindowsAppType 1.0.0