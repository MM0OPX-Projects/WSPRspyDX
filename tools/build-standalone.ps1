param(
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
if (-not $OutputPath) {
    $OutputPath = Join-Path $root "WSPRSpyDX-standalone.html"
}

$html = Get-Content -Raw -LiteralPath (Join-Path $root "index.html")
$css = Get-Content -Raw -LiteralPath (Join-Path $root "styles.css")
$javascript = Get-Content -Raw -LiteralPath (Join-Path $root "app.js")
$mapBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $root "world-map.png")))
$iconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Join-Path $root "icon.svg")))

$mapDeclaration = 'const worldMapDataUrl = "data:image/png;base64,' + $mapBase64 + '";' + [Environment]::NewLine
$javascript = $javascript.Replace('href="world-map.png"', 'href="${worldMapDataUrl}"')
$javascript = [regex]::Replace(
    $javascript,
    'if \("serviceWorker" in navigator\) \{\s*navigator\.serviceWorker\.register\("sw\.js"\)\.catch\(\(\) => \{\}\);\s*\}',
    ''
)
$javascript = ($mapDeclaration + $javascript).Replace('</script', '<\/script')

$html = [regex]::Replace($html, '(?m)^\s*<link rel="manifest"[^>]*>\s*\r?\n', '')
$html = [regex]::Replace(
    $html,
    '<link rel="stylesheet" href="styles\.css\?v=\d+">',
    { param($match) "<style>`r`n$css`r`n</style>" }
)
$html = [regex]::Replace(
    $html,
    '<script src="app\.js\?v=\d+"></script>',
    { param($match) "<script>`r`n$javascript`r`n</script>" }
)
$html = [regex]::Replace(
    $html,
    '(<meta name="theme-color" content="[^"]+">)',
    { param($match)
        $match.Groups[1].Value + [Environment]::NewLine +
        '  <link rel="icon" href="data:image/svg+xml;base64,' + $iconBase64 + '">' + [Environment]::NewLine +
        '  <!-- Standalone build: CSS, JavaScript, icon and map are embedded in this file. -->'
    }
)

$resolvedOutput = [IO.Path]::GetFullPath($OutputPath)
[IO.File]::WriteAllText($resolvedOutput, $html, [Text.UTF8Encoding]::new($false))
Write-Output $resolvedOutput
