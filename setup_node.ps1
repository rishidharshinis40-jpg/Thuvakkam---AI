$ErrorActionPreference = "Stop"

$nodeVersion = "v22.13.0"
$nodeZip = "node-$nodeVersion-win-x64.zip"
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/$nodeZip"
$destDir = "$PSScriptRoot\node"

Write-Host "Checking if Node.js is already installed locally..."
if (!(Test-Path $destDir)) {
    Write-Host "Downloading Node.js $nodeVersion from $nodeUrl..."
    $zipPath = "$PSScriptRoot\$nodeZip"
    
    # Using Invoke-WebRequest to download Node zip
    Invoke-WebRequest -Uri $nodeUrl -OutFile $zipPath
    
    Write-Host "Extracting Node.js zip archive..."
    $tempExtractDir = "$PSScriptRoot\temp_node"
    if (Test-Path $tempExtractDir) {
        Remove-Item $tempExtractDir -Recurse -Force
    }
    
    Expand-Archive -Path $zipPath -DestinationPath $tempExtractDir
    
    Write-Host "Moving extracted files to $destDir..."
    Move-Item -Path "$tempExtractDir\node-$nodeVersion-win-x64" -Destination $destDir
    
    Write-Host "Cleaning up temporary files..."
    Remove-Item $zipPath -Force
    Remove-Item $tempExtractDir -Recurse -Force
    
    Write-Host "Node.js successfully installed locally at $destDir!"
} else {
    Write-Host "Node.js is already installed locally."
}

# Verify installation in the local path
$env:PATH = "$destDir;" + $env:PATH
Write-Host "Testing node version:"
& "$destDir\node.exe" -v
Write-Host "Testing npm version:"
& "$destDir\npm.cmd" -v
