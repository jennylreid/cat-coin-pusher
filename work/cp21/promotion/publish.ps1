$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$m=Get-Content (Join-Path $PSScriptRoot 'manifest.json') -Raw | ConvertFrom-Json
function Hash($p){(Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant()}
$target=Join-Path $root 'phone/CatCoinPusher-game.json'
$source=Join-Path $PSScriptRoot 'CatCoinPusher-game.json'
if((Hash $target) -ne $m.backupHashes.'phone/CatCoinPusher-game.json'){throw 'Production baseline changed'}
if((Hash (Join-Path $root ($m.backup+'/CatCoinPusher-game.json'))) -ne (Hash $target)){throw 'Backup mismatch'}
if((Hash $source) -ne $m.stagedJSONSHA256){throw 'Staged payload changed'}
if((Hash (Join-Path $root 'uat/CatCoinPusher-UAT-game.json')) -ne $m.uatJSONSHA256){throw 'UAT changed'}
$expected=Get-Content (Join-Path $root 'tickets/CP-21-evidence/wins-solid-coins-test.log') | Where-Object {$_ -match '^\{'}
$actual=Get-Content (Join-Path $root 'tickets/CP-21-evidence/production-wins.log') | Where-Object {$_ -match '^\{'}
if($actual.Count -ne 18 -or (Compare-Object $expected $actual)){throw 'Board results differ'}
$in=[IO.File]::OpenRead($source)
try{
 $out=[IO.File]::Open($target,[IO.FileMode]::Open,[IO.FileAccess]::Write,[IO.FileShare]::None)
 try{$out.SetLength(0);$in.CopyTo($out);$out.Flush($true)}finally{$out.Dispose()}
}finally{$in.Dispose()}
if((Hash $target) -ne $m.stagedJSONSHA256){throw 'Publication mismatch'}
if((Hash (Join-Path $root 'CatCoinPusher.apk')) -ne $m.backupHashes.'CatCoinPusher.apk'){throw 'APK changed'}
if((Hash (Join-Path $root 'uat/CatCoinPusher-UAT.apk')) -ne $m.uatAPKSHA256){throw 'UAT APK changed'}
Write-Output "Published $($m.displayName) / APK16; verified backup and 18 matching board results."
