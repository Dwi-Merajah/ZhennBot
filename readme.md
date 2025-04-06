---

ZhennBot

Bot Telegram modular berbasis Node.js menggunakan library node-telegram-bot-api. Bot ini mendukung sistem plugin, database lokal sederhana, menu interaktif, dan manajemen event yang terstruktur.

Fitur Utama

Sistem plugin dinamis

Penyimpanan data lokal dalam bentuk objek JavaScript

Menu interaktif berdasarkan kategori

Auto-reload main.js saat terjadi error

Penanganan error tingkat lanjut & stabil


Instalasi

git clone https://github.com/Dwi-Merajah/ZhennBot
cd ZhennBot
npm install

Konfigurasi

Buat file .env dan isi dengan:

BOT_TOKEN=token_telegram_anda

Menjalankan Bot

node index.js

Struktur Proyek

Cara Menambahkan Plugin

Buat file .js di dalam folder plugins/ dengan struktur seperti ini:

exports.run = {
  usage: ['perintah'],
  use: '[opsional]',
  category: 'Kategori',
  async: async (m, { conn }) => {
    // Logika plugin
    await conn.reply(m.chat, 'Halo dunia!', m.msg);
  },
  error: false,
  cache: true,
  location: __filename
};

License

MIT License


---