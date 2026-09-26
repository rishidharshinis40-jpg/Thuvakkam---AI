$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$sdkManager = "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"

Write-Host "Accepting licenses..."
cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-23&& echo y | $sdkManager --licenses --sdk_root=C:\Android\Sdk"

Write-Host "Installing platforms, build-tools, and platform-tools..."
cmd.exe /c "set JAVA_HOME=C:\Program Files\Java\jdk-23&& echo y | $sdkManager ""platforms;android-34"" ""build-tools;34.0.0"" ""platform-tools"" --sdk_root=C:\Android\Sdk"

Write-Host "Creating local.properties in android project..."
$localProp = "sdk.dir=C\:\\Android\\Sdk`n"
[IO.File]::WriteAllText("C:\Users\rishi\OneDrive\Desktop\projectgdg\thovakkam-app\android\local.properties", $localProp)

Write-Host "Android packages and local.properties setup complete!"
