$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$m=Get-Content (Join-Path $PSScriptRoot 'manifest.json') -Raw | ConvertFrom-Json
function Hash($p){(Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant()}
if((Hash (Join-Path $root 'phone/CatCoinPusher-game.json')) -ne $m.oldJSONSHA256){throw 'Production JSON baseline changed'}
if((Hash (Join-Path $root 'CatCoinPusher.apk')) -ne $m.oldAPKSHA256){throw 'Production APK baseline changed'}
if((Hash (Join-Path $PSScriptRoot 'CatCoinPusher-game.json')) -ne $m.stagedJSONSHA256){throw 'Staged JSON changed'}
if((Hash (Join-Path $PSScriptRoot 'CatCoinPusher.apk')) -ne $m.stagedAPKSHA256){throw 'Staged APK changed'}
$checks=Get-Content (Join-Path $root 'tickets/CP-25-evidence/promotion/board-comparison.json') -Raw | ConvertFrom-Json
if(-not $checks.all18Match){throw 'Board parity not established'}
$approval=Get-Content (Join-Path $PSScriptRoot 'migration-approval.txt') -Raw
if($approval -notmatch 'Jenny approved'){throw 'First-open board limitation decision pending'}
$backup=Join-Path $root ('backups/before-CP-25-promotion-'+$m.version)
if(Test-Path -LiteralPath $backup){throw 'Backup already exists; preserve it'}
New-Item -ItemType Directory -Path $backup | Out-Null
foreach($f in @('phone/CatCoinPusher-game.json','CatCoinPusher.apk','CODEX_BRIEF.md','DEVELOPER.md','tickets/CP-25.md')){Copy-Item -LiteralPath (Join-Path $root $f) -Destination (Join-Path $backup ([IO.Path]::GetFileName($f)))}
if((Hash (Join-Path $backup 'CatCoinPusher-game.json')) -ne $m.oldJSONSHA256 -or (Hash (Join-Path $backup 'CatCoinPusher.apk')) -ne $m.oldAPKSHA256){throw 'Backup mismatch'}
function Write-ExistingItem($source,$target){
 $inputStream=[IO.File]::Open($source,[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::Read)
 try{$outputStream=[IO.File]::Open($target,[IO.FileMode]::Open,[IO.FileAccess]::Write,[IO.FileShare]::None)
 try{$outputStream.SetLength(0);$inputStream.CopyTo($outputStream);$outputStream.Flush($true)}finally{$outputStream.Dispose()}}finally{$inputStream.Dispose()}
}
Write-ExistingItem (Join-Path $PSScriptRoot 'CatCoinPusher.apk') (Join-Path $root 'CatCoinPusher.apk')
Write-ExistingItem (Join-Path $PSScriptRoot 'CatCoinPusher-game.json') (Join-Path $root 'phone/CatCoinPusher-game.json')
if((Hash (Join-Path $root 'phone/CatCoinPusher-game.json')) -ne $m.stagedJSONSHA256 -or (Hash (Join-Path $root 'CatCoinPusher.apk')) -ne $m.stagedAPKSHA256){throw 'Publication mismatch'}
$m | Add-Member -NotePropertyName backup -NotePropertyValue $backup
$m.publication='local publication verified; fresh cloud verification pending'
$m | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $root 'tickets/CP-25-evidence/promotion/publication.json') -Encoding utf8
'Published production in place, preserving OneDrive shared items; backup verified.'
