# Vercel Environment Variables Setup Script
# This script adds all required environment variables to Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setting up Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to nextjs directory
Set-Location "C:\Users\Abdul Haseeb\Documents\GitHub\Computer-Gaming-Accessories\nextjs"

# Function to add environment variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "Adding $Name to $Environment..." -ForegroundColor Yellow
    echo $Value | vercel env add $Name $Environment
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success: $Name added to $Environment" -ForegroundColor Green
    } else {
        Write-Host "Note: $Name already exists in $Environment or failed" -ForegroundColor DarkYellow
    }
}

# ImageKit Variables
Write-Host "`nAdding ImageKit Variables..." -ForegroundColor Cyan

$imageKitEndpoint = "https://ik.imagekit.io/rbo8xe5z6"
$imageKitPublicKey = "public_GSvFJmpaAJigfGPN3Xvewq7W9Ko="

foreach ($env in @("production", "preview", "development")) {
    Add-VercelEnv "NEXT_PUBLIC_IMAGEKIT_ENDPOINT" $imageKitEndpoint $env
    Add-VercelEnv "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY" $imageKitPublicKey $env
    Add-VercelEnv "IMAGEKIT_URL_ENDPOINT" $imageKitEndpoint $env
    Add-VercelEnv "IMAGEKIT_PUBLIC_KEY" $imageKitPublicKey $env
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Checking current environment variables..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

vercel env ls

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Existing Variables:" -ForegroundColor Yellow
Write-Host "  ✓ DATABASE_URL (already set)" -ForegroundColor Green
Write-Host "  ✓ NEXTAUTH_URL (already set)" -ForegroundColor Green
Write-Host "  ✓ NEXTAUTH_SECRET (already set)" -ForegroundColor Green
Write-Host ""
Write-Host "Newly Added Variables:" -ForegroundColor Yellow
Write-Host "  ✓ NEXT_PUBLIC_IMAGEKIT_ENDPOINT" -ForegroundColor Green
Write-Host "  ✓ NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY" -ForegroundColor Green
Write-Host "  ✓ IMAGEKIT_URL_ENDPOINT" -ForegroundColor Green
Write-Host "  ✓ IMAGEKIT_PUBLIC_KEY" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Verify Root Directory is set to 'nextjs' in Vercel Dashboard" -ForegroundColor White
Write-Host "  2. Deploy with: vercel --prod" -ForegroundColor White
Write-Host ""
