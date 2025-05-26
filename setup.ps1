# NgajiDigital Setup Script for Windows

Write-Host "Menyiapkan NgajiDigital Backend..." -ForegroundColor Cyan

# Check if .env exists
if (Test-Path .env) {
    Write-Host ".env file sudah ada." -ForegroundColor Yellow
    $overwrite = Read-Host "Apakah Anda ingin mengganti file .env? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Melanjutkan dengan file .env yang sudah ada." -ForegroundColor Green
    }
    else {
        Remove-Item .env
    }
}

# Create .env if it doesn't exist or user wants to overwrite
if (-not (Test-Path .env)) {
    $apiKey = Read-Host "Masukkan Gemini API Key Anda (dapatkan dari https://ai.google.dev/)"
    
    # Create .env file
    Set-Content -Path .env -Value "PORT=5000"
    Add-Content -Path .env -Value "GEMINI_API_KEY=$apiKey"
    
    Write-Host "File .env berhasil dibuat!" -ForegroundColor Green
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path node_modules)) {
    Write-Host "Menginstall dependencies..." -ForegroundColor Cyan
    npm install
    Write-Host "Dependencies berhasil diinstall!" -ForegroundColor Green
}
else {
    Write-Host "Dependencies sudah terinstall." -ForegroundColor Yellow
    $reinstall = Read-Host "Apakah Anda ingin menginstall ulang dependencies? (y/n)"
    if ($reinstall -eq "y") {
        Write-Host "Menginstall ulang dependencies..." -ForegroundColor Cyan
        npm install
        Write-Host "Dependencies berhasil diinstall ulang!" -ForegroundColor Green
    }
}

Write-Host "`nSetup selesai!" -ForegroundColor Cyan
Write-Host "Untuk menjalankan server, ketik: npm run dev" -ForegroundColor White 