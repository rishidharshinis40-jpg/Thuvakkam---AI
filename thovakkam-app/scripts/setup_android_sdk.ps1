$ErrorActionPreference = "Stop"

$androidRoot = "C:\Android"
$sdkDir = "C:\Android\Sdk"
$zipPath = "C:\Android\cmdline-tools.zip"
$tempExtract = "C:\Android\cmdline-tools-temp"

if (!(Test-Path $androidRoot)) {
    New-Item -ItemType Directory -Path $androidRoot -Force | Out-Null
}
if (!(Test-Path $sdkDir)) {
    New-Item -ItemType Directory -Path $sdkDir -Force | Out-Null
}

$url = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
Write-Host "Downloading Android Command Line Tools from $url..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
(New-Object System.Net.WebClient).DownloadFile($url, $zipPath)

Write-Host "Extracting Command Line Tools..."
if (Test-Path $tempExtract) {
    Remove-Item $tempExtract -Recurse -Force
}
Expand-Archive -Path $zipPath -DestinationPath $tempExtract -Force

$latestDir = "$sdkDir\cmdline-tools\latest"
if (!(Test-Path $latestDir)) {
    New-Item -ItemType Directory -Path $latestDir -Force | Out-Null
}

Copy-Item "$tempExtract\cmdline-tools\*" $latestDir -Recurse -Force

Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Android Command Line Tools successfully installed at $latestDir"
