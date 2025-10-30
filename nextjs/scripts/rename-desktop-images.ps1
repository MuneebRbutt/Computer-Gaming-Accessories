# Script to rename monitor-named images to desktop PC names
$desktopPcsPath = "C:\Users\Abdul Haseeb\Documents\GitHub\Computer-Gaming-Accessories\nextjs\public\images\categories\desktop-pcs"

# Define renaming map: old name -> new name
$renameMap = @{
    "acer-nitro-vg252q-25-flat.png" = "acer-desktop-pc-01.png"
    "acer-predator-x34p-34-curved.png" = "acer-desktop-pc-02.png"
    "aoc-agon-ag273qz-27-flat.png" = "aoc-desktop-pc-01.png"
    "asus-rog-swift-pg27aqn-27-flat.png" = "asus-rog-desktop-pc-01.png"
    "benq-mobiuz-ex3210r-32-curved.png" = "benq-desktop-pc-01.png"
    "benq-pd2700u-27-flat.png" = "benq-desktop-pc-02.png"
    "dell-u3821dw-38-curved.png" = "dell-desktop-pc-01.png"
    "dell-x2721q-27-curved.png" = "dell-desktop-pc-02.png"
    "gigabyte-g27qc-27-curved.png" = "gigabyte-desktop-pc-01.png"
    "gigabyte-m32u-32-flat.png" = "gigabyte-desktop-pc-02.png"
    "hp-omen-x24f-24-flat.png" = "hp-omen-desktop-pc-01.png"
    "lenovo-legion-y27q-27-flat.png" = "lenovo-legion-desktop-pc-01.png"
    "lg-ultragear-32gn63t-32-flat.png" = "lg-desktop-pc-01.png"
    "msi-modern-md272q-27-flat.png" = "msi-desktop-pc-01.png"
    "msi-optix-g27cq4-27-curved.png" = "msi-desktop-pc-02.png"
    "philips-345e2ae-34-curved.png" = "philips-desktop-pc-01.png"
    "samsung-odyssey-g8-34-curved.png" = "samsung-desktop-pc-01.png"
    "samsung-smart-m8-32-flat.png" = "samsung-desktop-pc-02.png"
    "viewsonic-elite-xg270-27-flat.png" = "viewsonic-desktop-pc-01.png"
    "zowie-xl2566k-25-flat.png" = "zowie-desktop-pc-01.png"
}

Write-Host "📁 Renaming desktop PC images..." -ForegroundColor Cyan
Write-Host ("=" * 80)

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $desktopPcsPath $oldName
    $newPath = Join-Path $desktopPcsPath $newName
    
    if (Test-Path $oldPath) {
        Rename-Item -Path $oldPath -NewName $newName
        Write-Host "✅ Renamed: $oldName -> $newName" -ForegroundColor Green
    } else {
        Write-Host "❌ Not found: $oldName" -ForegroundColor Red
    }
}

Write-Host ("=" * 80)
Write-Host "✅ Renaming complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update lib/data.ts product image paths"
Write-Host "  2. Verify all images load correctly"
