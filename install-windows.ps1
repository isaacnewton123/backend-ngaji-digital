# Script PowerShell untuk instalasi NgajiDigital API pada Windows
Write-Host "=== Memulai instalasi NgajiDigital API pada Windows ===" -ForegroundColor Green

# Memeriksa apakah Node.js telah diinstal
try {
    $nodeVersion = node -v
    Write-Host "Node.js terinstal: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js tidak ditemukan. Silakan instal Node.js dari https://nodejs.org/" -ForegroundColor Red
    exit
}

# Menginstal PM2 secara global
Write-Host "=== Menginstal PM2 ===" -ForegroundColor Green
npm install -g pm2 windows-service

# Menginstal dependensi aplikasi
Write-Host "=== Menginstal dependensi aplikasi ===" -ForegroundColor Green
npm install

# Mengonfigurasi .env jika belum ada
if (-not (Test-Path .\.env)) {
    Write-Host "=== Membuat file .env ===" -ForegroundColor Green
    "PORT=5001`nGEMINI_API_KEY=your_gemini_api_key_here" | Out-File -FilePath .\.env -Encoding utf8
    Write-Host "Mohon perbarui API key di file .env" -ForegroundColor Yellow
}

# Menjalankan aplikasi dengan PM2
Write-Host "=== Menjalankan aplikasi dengan PM2 ===" -ForegroundColor Green
pm2 start ecosystem.config.js

# Konfigurasi PM2 sebagai layanan Windows
Write-Host "=== Mengatur PM2 sebagai layanan Windows ===" -ForegroundColor Green
Write-Host "Jalankan perintah berikut sebagai Administrator jika ingin menjadikan PM2 sebagai layanan:" -ForegroundColor Yellow
Write-Host "pm2-service-install -name PM2" -ForegroundColor Cyan

Write-Host "`n=== Instalasi selesai ===" -ForegroundColor Green
Write-Host "API berjalan di http://localhost:5001" -ForegroundColor Cyan
Write-Host "`nJangan lupa untuk:"
Write-Host "1. Perbarui file .env dengan API key Gemini yang valid" -ForegroundColor Yellow
Write-Host "`nUntuk melihat status aplikasi:"
Write-Host "- PM2 status: pm2 status" -ForegroundColor Cyan
Write-Host "- PM2 logs: pm2 logs ngaji-digital-api" -ForegroundColor Cyan

# Perintah untuk membuka browser ke endpoint health
Write-Host "`nMembuka endpoint health di browser untuk pengujian..." -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:5001/api/health" 