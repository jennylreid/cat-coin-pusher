$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$manifest=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'publication-manifest.json') -Raw | ConvertFrom-Json
function Hash($path){(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()}
$jsonTarget=Join-Path $root 'uat/CatCoinPusher-UAT-game.json'
$apkTarget=Join-Path $root 'uat/CatCoinPusher-UAT.apk'
if((Hash $jsonTarget) -ne $manifest.baselineJSONSHA256){throw 'UAT JSON baseline changed'}

if((Hash (Join-Path $PSScriptRoot 'CatCoinPusher-UAT-game.json')) -ne $manifest.stagedJSONSHA256){throw 'Staged JSON changed'}

$safetyFiles=@('uat/CatCoinPusher-UAT.apk')
$safetyHashes=@{}
foreach($file in $safetyFiles){$safetyHashes[$file]=Hash (Join-Path $root $file)}
$backup=Join-Path $root $manifest.backup
if(Test-Path -LiteralPath $backup){throw 'Backup already exists; do not overwrite'}
New-Item -ItemType Directory -Path $backup | Out-Null
foreach($file in @('uat/CatCoinPusher-UAT-game.json','uat/CatCoinPusher-UAT.apk','uat/README.md','DEVELOPER.md')){
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $backup ([IO.Path]::GetFileName($file)))
}
if((Hash (Join-Path $backup 'CatCoinPusher-UAT-game.json')) -ne $manifest.baselineJSONSHA256){throw 'Backup verification failed'}
function Write-ExistingItem($source,$target){
    # Preserve the existing OneDrive item and sharing link. Exclusive access prevents sync of a partial write.
    $inputStream=[IO.File]::Open($source,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::Read)
    try{
        $outputStream=[IO.File]::Open($target,[IO.FileMode]::Open,[IO.FileAccess]::Write,[IO.FileShare]::None)
        try{$outputStream.SetLength(0);$inputStream.CopyTo($outputStream);$outputStream.Flush($true)}
        finally{$outputStream.Dispose()}
    }finally{$inputStream.Dispose()}
}

Write-ExistingItem (Join-Path $PSScriptRoot 'CatCoinPusher-UAT-game.json') $jsonTarget
if((Hash $jsonTarget) -ne $manifest.stagedJSONSHA256){throw 'Publication verification failed'}
foreach($file in $safetyFiles){if((Hash (Join-Path $root $file)) -ne $safetyHashes[$file]){throw "Safety check failed: $file"}}
$manifest | Add-Member -NotePropertyName localPublication -NotePropertyValue 'verified'
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $root 'tickets/CP-26-evidence/publication.json') -Encoding utf8
Write-Output "Published $($manifest.displayName) / APK4; backup verified."









