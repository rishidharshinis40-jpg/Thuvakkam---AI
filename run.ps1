# Add the local Node.js path to the environment PATH and run the command
$nodeDir = "$PSScriptRoot\node"
$env:PATH = "$nodeDir;$env:PATH"
if ($args.Length -gt 0) {
    & $args[0] $args[1..($args.Length-1)]
} else {
    Write-Host "Usage: .\run.ps1 <command> [arguments]"
}
