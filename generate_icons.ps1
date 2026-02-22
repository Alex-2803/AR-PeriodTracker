Add-Type -AssemblyName System.Drawing

$iconPath = "resources\icon.png"
if (-not (Test-Path $iconPath)) {
    Write-Host "Icon not found at $iconPath" -ForegroundColor Red
    exit 1
}

$sourceImg = [System.Drawing.Image]::FromFile($iconPath)
$sizes = @{
    "mdpi" = 48
    "hdpi" = 72
    "xhdpi" = 96
    "xxhdpi" = 144
    "xxxhdpi" = 192
}

foreach ($size in $sizes.GetEnumerator()) {
    $resDir = "android\app\src\main\res\mipmap-$($size.Key)"
    New-Item -ItemType Directory -Force -Path $resDir | Out-Null
    
    # Create regular icon
    $bitmap = New-Object System.Drawing.Bitmap($size.Value, $size.Value)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.DrawImage($sourceImg, 0, 0, $size.Value, $size.Value)
    $bitmap.Save("$resDir\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Save("$resDir\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Created icons for $($size.Key)" -ForegroundColor Green
}

$sourceImg.Dispose()
Write-Host "Icon generation complete!" -ForegroundColor Green
