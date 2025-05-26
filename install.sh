#!/bin/bash
# Script instalasi untuk NgajiDigital API

# Pastikan skrip dijalankan sebagai root
if [ "$EUID" -ne 0 ]
  then echo "Mohon jalankan sebagai root (gunakan sudo)"
  exit
fi

echo "=== Memulai instalasi NgajiDigital API ==="

# Update sistem
echo "=== Memperbarui paket sistem ==="
apt update && apt upgrade -y

# Menginstal Node.js jika belum ada
if ! command -v node &> /dev/null
then
    echo "=== Menginstal Node.js ==="
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Menginstal PM2 secara global
echo "=== Menginstal PM2 ==="
npm install -g pm2

# Menginstal Nginx jika belum ada
if ! command -v nginx &> /dev/null
then
    echo "=== Menginstal Nginx ==="
    apt install -y nginx
fi

# Menempatkan file konfigurasi Nginx
echo "=== Mengonfigurasi Nginx ==="
cp nginx.conf /etc/nginx/sites-available/ngajidigital
ln -sf /etc/nginx/sites-available/ngajidigital /etc/nginx/sites-enabled/

# Menginstal dependensi aplikasi
echo "=== Menginstal dependensi aplikasi ==="
npm install

# Mengonfigurasi .env jika belum ada
if [ ! -f .env ]; then
    echo "=== Membuat file .env ==="
    echo "PORT=5001" > .env
    echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env
    echo "Mohon perbarui API key di file .env"
fi

# Memulai aplikasi dengan PM2
echo "=== Menjalankan aplikasi dengan PM2 ==="
pm2 start ecosystem.config.js

# Konfigurasi PM2 untuk berjalan saat startup
echo "=== Mengatur PM2 untuk berjalan saat startup ==="
pm2 startup
pm2 save

# Memulai ulang Nginx
echo "=== Memulai ulang Nginx ==="
systemctl restart nginx

# Mengatur firewall jika UFW aktif
if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
    echo "=== Mengonfigurasi firewall ==="
    ufw allow 'Nginx Full'
    ufw allow 5001
fi

echo "=== Instalasi selesai ==="
echo "API berjalan di http://localhost:5001"
echo "Nginx dikonfigurasi untuk http://ngajidigital.isaacnewton.site"
echo ""
echo "Jangan lupa untuk:"
echo "1. Perbarui file .env dengan API key Gemini yang valid"
echo "2. Tambahkan domain ngajidigital.isaacnewton.site ke DNS Anda"
echo ""
echo "Untuk melihat status aplikasi:"
echo "- PM2 status: pm2 status"
echo "- PM2 logs: pm2 logs ngaji-digital-api"
echo "- Nginx status: systemctl status nginx" 