# ZhennBot

**ZhennBot** adalah bot Telegram modular berbasis **Node.js** yang dibangun menggunakan library [`node-telegram-bot-api`](https://github.com/yagop/node-telegram-bot-api). Bot ini dirancang dengan sistem plugin yang fleksibel, penyimpanan data lokal sederhana, menu interaktif berdasarkan kategori, dan manajemen event yang terstruktur.

---

## ✨ Fitur Utama

- **Sistem Plugin Dinamis** — Tambah atau ubah fitur tanpa menyentuh inti bot.
- **Penyimpanan Data Lokal** — Gunakan objek JavaScript sebagai database sederhana.
- **Menu Interaktif** — Tampilkan perintah berdasarkan kategori secara rapi.
- **Auto Reload** — `main.js` akan otomatis me-reload saat terjadi error.
- **Stabil & Siap Pakai** — Penanganan error yang kokoh untuk penggunaan jangka panjang.

---

## ⚙️ Instalasi

```bash
git clone https://github.com/Dwi-Merajah/ZhennBot
cd ZhennBot
npm install
```

---

## ⚡ Konfigurasi

Buat file `.env` di root folder, lalu isi:

```env
BOT_TOKEN=token_telegram_anda
BOT_NAME=ZhennBot
OWNER_ID=123456789
```

---

## ▶️ Menjalankan Bot

```bash
node index.js
```

---

## 📁 Struktur Proyek

| File / Folder     | Fungsi                                                                 |
|-------------------|------------------------------------------------------------------------|
| `index.js`        | Entry point utama, memulai bot dan menangani error global.             |
| `main.js`         | Mengatur koneksi, load plugin, simpan database, dan proses pesan.      |
| `handler.js`      | Menangani command yang dikirim user, berdasarkan plugin aktif.         |
| `menu.js`         | Plugin menu utama, menampilkan daftar command berdasarkan kategori.    |
| `config.json`     | File konfigurasi dasar (dapat digunakan untuk keperluan tambahan).     |
| `plugins/`        | Folder tempat menyimpan semua plugin bot.                              |
| `media/cover.jpg` | Gambar pendukung menu (opsional tapi direkomendasikan).                |

---

## 🧩 Menambahkan Plugin Baru

Tambahkan file `.js` ke dalam folder `plugins/` dengan struktur seperti berikut:

```js
exports.run = {
  usage: ['perintah'],
  use: '[opsional]',
  category: 'Kategori',
  async: async (m, { conn }) => {
    await conn.reply(m.chat, 'Halo dunia!', m.msg);
  },
  error: false,
  cache: true,
  location: __filename
};
```

---

## 📜 Lisensi

Distribusi proyek ini berada di bawah lisensi **MIT License** — bebas digunakan, dimodifikasi, dan dibagikan.
