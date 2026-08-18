Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$imagesDir = Join-Path $projectRoot 'assets\images'

$ivory = [System.Drawing.ColorTranslator]::FromHtml('#FAF8F4')
$olive = [System.Drawing.ColorTranslator]::FromHtml('#6B7A57')
$charcoal = [System.Drawing.ColorTranslator]::FromHtml('#1C1C1E')
$gold = [System.Drawing.ColorTranslator]::FromHtml('#C9A46A')

function Copy-Bitmap([System.Drawing.Bitmap] $source) {
    return [System.Drawing.Bitmap]::new($source)
}

function New-RemappedMark([System.Drawing.Bitmap] $source, [System.Drawing.Color] $fill) {
    $mark = [System.Drawing.Bitmap]::new(
        $source.Width,
        $source.Height,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )

    for ($y = 0; $y -lt $source.Height; $y++) {
        for ($x = 0; $x -lt $source.Width; $x++) {
            $pixel = $source.GetPixel($x, $y)
            $isWhiteBackground = $pixel.R -gt 245 -and $pixel.G -gt 245 -and $pixel.B -gt 245

            if ($pixel.A -eq 0 -or $isWhiteBackground) {
                $mark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $mark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, $fill.R, $fill.G, $fill.B))
            }
        }
    }

    return $mark
}

function New-Canvas([int] $width, [int] $height, [System.Drawing.Color] $background) {
    $canvas = [System.Drawing.Bitmap]::new(
        $width,
        $height,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear($background)
    $graphics.Dispose()
    return $canvas
}

function Draw-Mark(
    [System.Drawing.Graphics] $graphics,
    [System.Drawing.Bitmap] $mark,
    [int] $x,
    [int] $y,
    [int] $size
) {
    $graphics.DrawImage(
        $mark,
        [System.Drawing.Rectangle]::new($x, $y, $size, $size),
        0,
        0,
        $mark.Width,
        $mark.Height,
        [System.Drawing.GraphicsUnit]::Pixel
    )
}

function Draw-WindowGrid(
    [System.Drawing.Graphics] $graphics,
    [System.Drawing.Color] $color,
    [int] $x,
    [int] $y,
    [int] $markSize
) {
    $scale = $markSize / 1024.0
    $windowX = $x + [int](428 * $scale)
    $windowY = $y + [int](594 * $scale)
    $windowSize = [Math]::Max(2, [int](48 * $scale))
    $windowGap = [Math]::Max(1, [int](14 * $scale))
    $brush = [System.Drawing.SolidBrush]::new($color)

    foreach ($row in 0..1) {
        foreach ($column in 0..1) {
            $left = $windowX + (($windowSize + $windowGap) * $column)
            $top = $windowY + (($windowSize + $windowGap) * $row)
            $graphics.FillRectangle($brush, $left, $top, $windowSize, $windowSize)
        }
    }

    $brush.Dispose()
}

function Save-Png([System.Drawing.Bitmap] $bitmap, [string] $path) {
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
}

$logoSourcePath = Join-Path $imagesDir 'logo.png'
$adaptiveSourcePath = Join-Path $imagesDir 'adaptive-icon.png'
$logoSource = Copy-Bitmap ([System.Drawing.Bitmap]::FromFile($logoSourcePath))
$adaptiveSource = Copy-Bitmap ([System.Drawing.Bitmap]::FromFile($adaptiveSourcePath))

try {
    $lightMark = New-RemappedMark $logoSource $olive
    $darkMark = New-RemappedMark $logoSource $gold
    $adaptiveMark = New-RemappedMark $adaptiveSource $olive
    $adaptiveDarkMark = New-RemappedMark $adaptiveSource $gold

    # Primary app icon: opaque ivory background, so iOS receives no alpha channel.
    $appIcon = New-Canvas 1024 1024 $ivory
    $graphics = [System.Drawing.Graphics]::FromImage($appIcon)
    Draw-Mark $graphics $lightMark 0 0 1024
    Draw-WindowGrid $graphics $gold 0 0 1024
    $graphics.Dispose()
    Save-Png $appIcon $logoSourcePath
    Save-Png $appIcon (Join-Path $imagesDir 'icon.png')
    $appIcon.Dispose()

    # Android adaptive foreground: transparent canvas; source mark remains inside its existing safe zone.
    $adaptiveIcon = New-Canvas 1024 1024 ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $graphics = [System.Drawing.Graphics]::FromImage($adaptiveIcon)
    Draw-Mark $graphics $adaptiveMark 0 0 1024
    $graphics.Dispose()
    Save-Png $adaptiveIcon $adaptiveSourcePath
    $adaptiveIcon.Dispose()

    # Favicon: compact transparent emblem for browser tabs.
    $favicon = New-Canvas 512 512 ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $graphics = [System.Drawing.Graphics]::FromImage($favicon)
    Draw-Mark $graphics $lightMark 0 0 512
    Draw-WindowGrid $graphics $gold 0 0 512
    $graphics.Dispose()
    Save-Png $favicon (Join-Path $imagesDir 'favicon.png')
    $favicon.Dispose()

    # Splash icon keeps the same mark available for native splash configurations.
    $splashIcon = New-Canvas 432 432 ([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $graphics = [System.Drawing.Graphics]::FromImage($splashIcon)
    Draw-Mark $graphics $lightMark 0 0 432
    Draw-WindowGrid $graphics $gold 0 0 432
    $graphics.Dispose()
    Save-Png $splashIcon (Join-Path $imagesDir 'splash-icon.png')
    $splashIcon.Dispose()

    foreach ($variant in @(
        @{ Name = 'splash.png'; Mark = $lightMark; Background = ([System.Drawing.Color]::FromArgb(0, 0, 0, 0)); Wordmark = $charcoal; Subtext = $gold },
        @{ Name = 'splash-dark.png'; Mark = $darkMark; Background = ([System.Drawing.Color]::FromArgb(0, 0, 0, 0)); Wordmark = $ivory; Subtext = $gold }
    )) {
        $splash = New-Canvas 432 432 $variant.Background
        $graphics = [System.Drawing.Graphics]::FromImage($splash)

        Draw-Mark $graphics $variant.Mark 161 52 110
        Draw-WindowGrid $graphics $gold 161 52 110

        $wordmarkFont = [System.Drawing.Font]::new('Georgia', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $subtextFont = [System.Drawing.Font]::new('Arial', 8, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
        $center = [System.Drawing.StringFormat]::new()
        $center.Alignment = [System.Drawing.StringAlignment]::Center
        $center.LineAlignment = [System.Drawing.StringAlignment]::Center

        $wordmarkBrush = [System.Drawing.SolidBrush]::new($variant.Wordmark)
        $subtextBrush = [System.Drawing.SolidBrush]::new($variant.Subtext)
        $graphics.DrawString('Jiwar', $wordmarkFont, $wordmarkBrush, [System.Drawing.RectangleF]::new(0, 182, 432, 50), $center)
        $graphics.DrawString('Desert Minimal Hospitality & Real Estate', $subtextFont, $subtextBrush, [System.Drawing.RectangleF]::new(0, 235, 432, 22), $center)

        $wordmarkBrush.Dispose()
        $subtextBrush.Dispose()
        $wordmarkFont.Dispose()
        $subtextFont.Dispose()
        $center.Dispose()
        $graphics.Dispose()

        Save-Png $splash (Join-Path $imagesDir $variant.Name)
        $splash.Dispose()
    }
} finally {
    $lightMark.Dispose()
    $darkMark.Dispose()
    $adaptiveMark.Dispose()
    $adaptiveDarkMark.Dispose()
    $logoSource.Dispose()
    $adaptiveSource.Dispose()
}

Write-Output 'Generated Jiwar brand assets.'
