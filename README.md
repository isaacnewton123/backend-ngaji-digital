# NgajiDigital - Backend API

<div align="center">
  <h3>API Backend untuk NgajiDigital - Platform Pembelajaran Islam berbasis AI</h3>
</div>

## 📖 Tentang Backend

Backend API NgajiDigital berfungsi sebagai otak di balik aplikasi pembelajaran Islam berbasis AI. Backend ini bertanggung jawab untuk:

1. Menyediakan endpoint API untuk frontend
2. Mengintegrasikan dengan Google Gemini AI API
3. Mengelola konteks percakapan dan sesi pengguna
4. Menyediakan konten dari kitab "Mukhtashor Jiddan Syarah" sebagai sumber pengetahuan

### 🛠️ Teknologi

- Node.js
- Express.js
- Google Generative AI (Gemini API)
- Sistem manajemen sesi sederhana berbasis memori

## 🚀 Instalasi dan Penggunaan

### Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM atau Yarn
- API Key dari Google AI Studio (Gemini API)

### Mendapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://ai.google.dev/)
2. Buat akun atau masuk dengan akun Google
3. Di dashboard, pilih "Get API key"
4. Buat API key baru atau gunakan yang sudah ada
5. Salin API key

### Cara Instalasi

Untuk pengguna Windows, kami menyediakan script PowerShell untuk mempermudah instalasi:

```powershell
# Clone repositori (jika belum)
git clone https://github.com/isaacnewton123/ngaji-digital.git
cd ngaji-digital/Backend/ngaji-digital-api

# Jalankan script setup
.\setup.ps1
# Ikuti instruksi di layar untuk memasukkan Gemini API Key
```

Atau gunakan cara manual:

```bash
# Clone repositori (jika belum)
git clone https://github.com/isaacnewton123/ngaji-digital.git
cd ngaji-digital/Backend/ngaji-digital-api

# Install dependensi
npm install

# Buat file .env dan masukkan API key Gemini Anda
echo "PORT=5000" > .env
echo "GEMINI_API_KEY=your_api_key_here" >> .env
# Ganti 'your_api_key_here' dengan API key yang Anda dapatkan

# Jalankan server
npm run dev
```

Server akan berjalan pada [http://localhost:5000](http://localhost:5000).

## 📡 API Endpoints

### 1. Cek Status API

```
GET /api/health
```

Respons:
```json
{
  "status": "ok",
  "kitabLoaded": true,
  "apiKeyStatus": "configured",
  "modelConfig": {
    "primaryModel": "gemini-2.0-flash",
    "fallbackModels": ["gemini-1.5-pro", "gemini-1.0-pro"],
    "responseLanguage": "Bahasa Indonesia",
    "markdownSupport": true
  }
}
```

### 2. Chat dengan AI

```
POST /api/chat
```

Body Request:
```json
{
  "message": "Apa itu i'rab?",
  "sessionId": "optional-session-id"
}
```

Respons:
```json
{
  "response": "Jawaban AI dalam format Markdown",
  "sessionId": "session-id-for-conversation"
}
```

## 🧩 Struktur Proyek

```
ngaji-digital-api/
├── utils/                  # Utilitas dan helper
│   └── kitabLoader.js      # Loader untuk file kitab
├── .env                    # Konfigurasi environment
├── Kitab-Mukhtashor Jiddan Syarah.md  # Sumber pengetahuan AI
├── package.json            # Dependensi dan script
├── server.js               # Entry point aplikasi
└── setup.ps1               # Script setup untuk Windows
```

## 🔍 Fitur Utama

1. **Integrasi Google Gemini API**: Menggunakan model AI terbaru (gemini-2.0-flash) dengan fallback ke model alternatif jika diperlukan.

2. **Pemrosesan Bahasa Indonesia**: AI dikonfigurasi untuk selalu merespons dalam Bahasa Indonesia.

3. **Manajemen Sesi**: Melacak percakapan agar AI bisa memberikan respons kontekstual.

4. **Kontrol Sumber Pengetahuan**: AI hanya menggunakan kitab "Mukhtashor Jiddan Syarah" sebagai sumber informasi.

5. **Respons Markdown**: AI menyusun jawaban dalam format Markdown untuk meningkatkan keterbacaan.

6. **Salam Pembuka**: AI selalu memulai percakapan baru dengan "Assalamualaikum warahmatullahi wabarakatuh".

## ⚠️ Troubleshooting

### Error: models/gemini-pro is not found

Jika Anda melihat error ini, kemungkinan penyebabnya:

1. **API Key tidak valid**: Periksa API key Anda di file `.env`
2. **Versi model tidak tersedia**: Aplikasi ini menggunakan model `gemini-2.0-flash` dengan fallback ke `gemini-1.5-pro` dan `gemini-1.0-pro`. Jika semua model tidak tersedia untuk API key Anda, hubungi dukungan Google AI.
3. **Kuota habis**: Google membatasi penggunaan API gratis. Periksa kuota Anda di [Google AI Studio](https://ai.google.dev/).

## 👥 Kontributor

- [Isaac Newton](https://github.com/isaacnewton123) - Developer & Maintainer

## 📝 Lisensi

Hak Cipta © 2024 NgajiDigital. Seluruh hak cipta dilindungi.

## 🔗 Tautan

- [Website](https://isaacnewton.site)
- [Twitter/X](https://x.com/isaac_newton252)
- [GitHub](https://github.com/isaacnewton123) 