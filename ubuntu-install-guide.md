# Panduan Instalasi NgajiDigital API di Ubuntu Server

Berikut adalah langkah-langkah untuk menginstal dan menjalankan backend NgajiDigital API pada server Ubuntu menggunakan port 5001:

## 1. Persiapan Server

Akses server Ubuntu Anda melalui SSH:

```bash
ssh username@your_server_ip
```

## 2. Mengkloning Repository

```bash
# Buat direktori untuk aplikasi (opsional)
mkdir -p /var/www/ngajidigital
cd /var/www/ngajidigital

# Clone repository
git clone https://github.com/isaacnewton123/backend-ngaji-digital.git ngaji-digital-api
cd ngaji-digital-api
```

## 3. Instalasi Otomatis

Gunakan script instalasi otomatis yang sudah disediakan:

```bash
# Berikan izin eksekusi pada script
chmod +x install.sh

# Jalankan script instalasi
sudo ./install.sh
```

## 4. Konfigurasi Manual (Jika Diperlukan)

Jika Anda lebih suka instalasi manual, ikuti langkah-langkah berikut:

### Instalasi Node.js dan NPM

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Instalasi PM2

```bash
sudo npm install -g pm2
```

### Konfigurasi .env

```bash
# Buat file .env
echo "PORT=5001" > .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# Edit file jika perlu
nano .env
```

### Instalasi Dependensi

```bash
npm install
```

### Menjalankan dengan PM2

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Konfigurasi Nginx

```bash
# Instal Nginx jika belum ada
sudo apt install -y nginx

# Konfigurasi Nginx
sudo cp nginx.conf /etc/nginx/sites-available/ngajidigital
sudo ln -sf /etc/nginx/sites-available/ngajidigital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Konfigurasi Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 5001
```

## 5. Pengujian

Pastikan API berjalan dengan baik:

```bash
curl http://localhost:5001/api/health
```

## 6. Pemecahan Masalah

### Log dan Status

```bash
# Melihat status PM2
pm2 status

# Melihat log aplikasi
pm2 logs ngaji-digital-api

# Melihat log Nginx
sudo tail -f /var/log/nginx/ngajidigital.error.log
```

### Restart Layanan

```bash
# Restart aplikasi
pm2 restart ngaji-digital-api

# Restart Nginx
sudo systemctl restart nginx
```

### Cek Port

```bash
# Periksa apakah port 5001 sudah digunakan
sudo lsof -i :5001
```

## 7. Catatan Penting

1. Pastikan domain `ngajidigital.isaacnewton.site` sudah dikonfigurasi untuk mengarah ke IP server Anda.
2. Pastikan untuk menggunakan API key Gemini yang valid di file `.env`.
3. Jika Anda ingin mengaktifkan SSL/HTTPS, gunakan Certbot untuk mengonfigurasi SSL secara otomatis.
4. Port 5001 digunakan karena port 5000 sudah digunakan oleh layanan lain di server.
5. Pastikan file `Kitab-Mukhtashor Jiddan Syarah.md` ada di direktori root aplikasi.

## 8. Mengaktifkan HTTPS (Opsional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ngajidigital.isaacnewton.site
# Ikuti petunjuk yang muncul
```

## 9. Pembaruan Aplikasi

Untuk memperbarui aplikasi saat ada perubahan:

```bash
# Masuk ke direktori aplikasi
cd /var/www/ngajidigital/ngaji-digital-api

# Pull perubahan terbaru dari GitHub
git pull

# Instal dependensi baru (jika ada)
npm install

# Restart aplikasi
pm2 restart ngaji-digital-api
```

## 10. Troubleshooting Tambahan

### Masalah: API Tidak Dapat Diakses dari Frontend

Periksa konfigurasi CORS di `server.js`:

```bash
nano server.js
```

Pastikan domain frontend (`https://ngajidigital.netlify.app`) sudah diizinkan di konfigurasi CORS.

### Masalah: File Kitab Tidak Ditemukan

```bash
# Periksa apakah file Kitab ada
ls -la "Kitab-Mukhtashor Jiddan Syarah.md"

# Jika tidak ada, download dari repositori cadangan (jika tersedia)
# atau buat secara manual dengan konten yang sesuai
```

### Masalah: PM2 Crash atau Restart Terus-menerus

```bash
# Lihat log detail
pm2 logs ngaji-digital-api --lines 200

# Cek penggunaan memori
pm2 monit
``` 