$licenseDir = "C:\Android\Sdk\licenses"
if (!(Test-Path $licenseDir)) {
    New-Item -ItemType Directory -Path $licenseDir -Force | Out-Null
}

$androidSdkLicense = @"
24333f8a63b6825ea9c5514f83c2829b004d1fee
d56f5187479451eabf01fb78af6dfcb131a6481e
84831b9409646a256e3073a6e033f9dd49f43054
"@

$androidSdkPreviewLicense = @"
84831b9409646a256e3073a6e033f9dd49f43054
"@

[IO.File]::WriteAllText("$licenseDir\android-sdk-license", $androidSdkLicense.Trim())
[IO.File]::WriteAllText("$licenseDir\android-sdk-preview-license", $androidSdkPreviewLicense.Trim())

Write-Host "License hashes written to $licenseDir"

$sdkManager = "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-23&& $sdkManager ""platforms;android-34"" ""build-tools;34.0.0"" ""platform-tools"" --sdk_root=C:\Android\Sdk"

Write-Host "Installation complete."
