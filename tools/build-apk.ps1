param(
  [Parameter(Mandatory = $true)]
  [int]$VersionCode,

  [Parameter(Mandatory = $true)]
  [string]$VersionName,

  [string]$SdkRoot = "C:\Users\Colin\Documents\Radio Prop stuff\.android-build\sdk",
  [string]$JdkRoot = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $repoRoot "android-apk"
$buildRoot = Join-Path $androidRoot "build"
$buildTools = Join-Path $SdkRoot "build-tools\35.0.0"
$androidJar = Join-Path $SdkRoot "platforms\android-35\android.jar"
$apkName = "WSPRSpyDX-v$VersionName-debug.apk"
$releaseApk = Join-Path $repoRoot "releases\$apkName"
$keystore = Join-Path $buildRoot "debug.keystore"

$requiredTools = @(
  (Join-Path $buildTools "aapt.exe"),
  (Join-Path $buildTools "d8.bat"),
  (Join-Path $buildTools "zipalign.exe"),
  (Join-Path $buildTools "apksigner.bat"),
  (Join-Path $JdkRoot "bin\javac.exe"),
  (Join-Path $JdkRoot "bin\jar.exe")
)
$requiredTools + $androidJar | ForEach-Object {
  if (-not (Test-Path -LiteralPath $_)) { throw "Required Android build dependency not found: $_" }
}
if (-not (Test-Path -LiteralPath $keystore)) { throw "Debug keystore not found: $keystore" }

$assets = @("index.html", "app.js", "styles.css", "sw.js", "manifest.webmanifest", "icon.svg", "world-map.png")
$assets | ForEach-Object {
  Copy-Item -LiteralPath (Join-Path $repoRoot $_) -Destination (Join-Path $androidRoot "assets") -Force
}

$classesDir = Join-Path $buildRoot "classes"
$dexDir = Join-Path $buildRoot "dex"
New-Item -ItemType Directory -Force -Path $classesDir, $dexDir, (Join-Path $repoRoot "releases") | Out-Null
Remove-Item -Recurse -Force -Path (Join-Path $classesDir "*") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force -Path (Join-Path $dexDir "*") -ErrorAction SilentlyContinue

$javaSource = Join-Path $androidRoot "src\com\mm0opx\dxpathchecker\MainActivity.java"
& (Join-Path $JdkRoot "bin\javac.exe") -source 8 -target 8 -bootclasspath $androidJar -d $classesDir $javaSource
if ($LASTEXITCODE -ne 0) { throw "javac failed" }

$classesJar = Join-Path $buildRoot "classes.jar"
& (Join-Path $JdkRoot "bin\jar.exe") cf $classesJar -C $classesDir .
if ($LASTEXITCODE -ne 0) { throw "jar failed" }
& (Join-Path $buildTools "d8.bat") --lib $androidJar --output $dexDir $classesJar
if ($LASTEXITCODE -ne 0) { throw "d8 failed" }

$rootDex = Join-Path $buildRoot "classes.dex"
Copy-Item -LiteralPath (Join-Path $dexDir "classes.dex") -Destination $rootDex -Force
$baseApk = Join-Path $buildRoot "base-unsigned.apk"
& (Join-Path $buildTools "aapt.exe") package -f -M (Join-Path $androidRoot "AndroidManifest.xml") -S (Join-Path $androidRoot "res") -A (Join-Path $androidRoot "assets") -I $androidJar --version-code $VersionCode --version-name "$VersionName-test" -F $baseApk
if ($LASTEXITCODE -ne 0) { throw "aapt package failed" }

Push-Location $buildRoot
try {
  & (Join-Path $buildTools "aapt.exe") add "base-unsigned.apk" "classes.dex"
  if ($LASTEXITCODE -ne 0) { throw "aapt add classes.dex failed" }
} finally {
  Pop-Location
}

$alignedApk = Join-Path $buildRoot $apkName
& (Join-Path $buildTools "zipalign.exe") -f 4 $baseApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "zipalign failed" }
& (Join-Path $buildTools "apksigner.bat") sign --ks $keystore --ks-pass pass:android --key-pass pass:android --out $releaseApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "APK signing failed" }

$entries = @(& (Join-Path $buildTools "aapt.exe") list $releaseApk)
if ($entries -notcontains "classes.dex") { throw "Invalid APK: root classes.dex is missing" }
if ($entries -contains "dex\classes.dex" -or $entries -contains "dex/classes.dex") { throw "Invalid APK: nested dex/classes.dex was packaged" }
& (Join-Path $buildTools "zipalign.exe") -c 4 $releaseApk
if ($LASTEXITCODE -ne 0) { throw "APK alignment verification failed" }
& (Join-Path $buildTools "apksigner.bat") verify --verbose $releaseApk
if ($LASTEXITCODE -ne 0) { throw "APK signature verification failed" }

Write-Output $releaseApk
