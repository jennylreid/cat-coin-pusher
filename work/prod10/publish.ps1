$ErrorActionPreference='Stop'
# PROD-10 (production update, UAT 134 scope; prepared, run only after Jenny's sign-off via the PM): publish the staged production game-only update in place (keeps the OneDrive item and its share link).
# Backup first; UAT files and the production APK must stay byte-identical.
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$manifest=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'publication-manifest.json') -Raw | ConvertFrom-Json
function Hash($path){(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()}
$jsonTarget=Join-Path $root 'phone/CatCoinPusher-game.json'
if((Hash $jsonTarget) -ne $manifest.baselineJSONSHA256){throw 'Production JSON baseline changed'}
if((Hash (Join-Path $root 'CatCoinPusher.apk')) -ne $manifest.productionAPKSHA256){throw 'Production APK changed'}
if((Hash (Join-Path $PSScriptRoot 'CatCoinPusher-game.json')) -ne $manifest.stagedJSONSHA256){throw 'Staged JSON changed'}
$safetyFiles=@('CatCoinPusher.apk','uat/CatCoinPusher-UAT-game.json','uat/CatCoinPusher-UAT.apk')
$safetyHashes=@{}
foreach($file in $safetyFiles){$safetyHashes[$file]=Hash (Join-Path $root $file)}
$backup=Join-Path $root $manifest.backup
if(Test-Path -LiteralPath $backup){throw 'Backup already exists; do not overwrite'}
New-Item -ItemType Directory -Path $backup | Out-Null
foreach($file in @('phone/CatCoinPusher-game.json','CatCoinPusher.apk','CODEX_BRIEF.md','DEVELOPER.md')){
    Copy-Item -LiteralPath (Join-Path $root $file) -Destination (Join-Path $backup ([IO.Path]::GetFileName($file)))
}
if((Hash (Join-Path $backup 'CatCoinPusher-game.json')) -ne $manifest.baselineJSONSHA256 -or (Hash (Join-Path $backup 'CatCoinPusher.apk')) -ne $manifest.productionAPKSHA256){throw 'Backup verification failed'}
function Write-ExistingItem($source,$target){
    $inputStream=[IO.File]::Open($source,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::Read)
    try{
        $outputStream=[IO.File]::Open($target,[IO.FileMode]::Open,[IO.FileAccess]::Write,[IO.FileShare]::None)
        try{$outputStream.SetLength(0);$inputStream.CopyTo($outputStream);$outputStream.Flush($true)}
        finally{$outputStream.Dispose()}
    }finally{$inputStream.Dispose()}
}
Write-ExistingItem (Join-Path $PSScriptRoot 'CatCoinPusher-game.json') $jsonTarget
if((Hash $jsonTarget) -ne $manifest.stagedJSONSHA256){throw 'Publication verification failed'}
foreach($file in $safetyFiles){if((Hash (Join-Path $root $file)) -ne $safetyHashes[$file]){throw "Safety check failed: $file"}}
$manifest | Add-Member -NotePropertyName localPublication -NotePropertyValue 'verified'
$manifest | Add-Member -NotePropertyName publishedAt -NotePropertyValue ((Get-Date).ToString('s'))
$manifest | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $root ($manifest.evidence + '/publication.json')) -Encoding utf8
Write-Output "Published production $($manifest.displayName) ($($manifest.version)) / APK17 (game-only); backup $($manifest.backup) verified; UAT and APK untouched."
