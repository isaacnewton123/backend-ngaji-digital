# Panduan Menjalankan Backend dengan PM2

## Prasyarat
- NodeJS dan NPM sudah terinstal
- Server dengan akses root (untuk menginstall PM2 secara global)

## Langkah-langkah Instalasi PM2

1. Instal PM2 secara global:
```bash
npm install -g pm2
```

2. Jalankan aplikasi menggunakan file konfigurasi:
```bash
cd /path/to/backend/ngaji-digital-api
pm2 start ecosystem.config.js
```

3. Atau jalankan tanpa file konfigurasi:
```bash
pm2 start server.js --name "ngaji-digital-api" --env production
```

4. Lihat status aplikasi:
```bash
pm2 status
```

5. Lihat log:
```bash
pm2 logs ngaji-digital-api
```

6. Mengatur PM2 agar dijalankan saat startup server:
```bash
pm2 startup
# Ikuti instruksi yang muncul
pm2 save
```

7. Restart aplikasi:
```bash
pm2 restart ngaji-digital-api
```

8. Menghentikan aplikasi:
```bash
pm2 stop ngaji-digital-api
```

## Panduan Konfigurasi Nginx

1. Salin file `nginx.conf` ke direktori Nginx:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/ngajidigital
```

2. Buat symlink ke sites-enabled:
```bash
sudo ln -s /etc/nginx/sites-available/ngajidigital /etc/nginx/sites-enabled/
```

3. Tes konfigurasi Nginx:
```bash
sudo nginx -t
```

4. Restart Nginx:
```bash
sudo systemctl restart nginx
```

## Troubleshooting

1. Jika aplikasi tidak dapat diakses, periksa status PM2:
```bash
pm2 status
```

2. Periksa log PM2:
```bash
pm2 logs ngaji-digital-api
```

3. Periksa log Nginx:
```bash
sudo tail -f /var/log/nginx/ngajidigital.error.log
```

4. Pastikan port 5001 tidak diblokir oleh firewall:
```bash
sudo ufw status
# Jika perlu, buka port
sudo ufw allow 5001
```

5. Periksa apakah aplikasi berjalan dengan benar pada port 5001:
```bash
curl http://localhost:5001/api/health
``` 