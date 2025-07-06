# Smart Learning Monitor with AI by Emejleano

🎓 **Smart Learning Monitor with AI** adalah aplikasi desktop berbasis Electron dan Teachable Machine yang membantu pengguna untuk menjaga fokus dan kesehatan selama sesi belajar melalui pemantauan aktivitas menggunakan webcam dan model AI.

## ✨ Fitur Utama

- 🎥 **Pemantauan Webcam**: Menampilkan live feed dari kamera yang dipilih.
- 🤖 **Deteksi Aktivitas Berbasis AI**: Menggunakan model dari [Teachable Machine](https://teachablemachine.withgoogle.com/) untuk mengenali aktivitas pengguna (misalnya: minum, mengantuk, kondisi baik).
- 🔔 **Notifikasi Cerdas**:
  - Mengingatkan pengguna untuk minum dalam rentang waktu yang ditentukan mis. per 30s (dapat dikustomisasi).
  - Memberi peringatan jika terdeteksi mengantuk.
- 📊 **Statistik Real-Time**:
  - Waktu belajar
  - Jumlah minum
  - Deteksi rasa mengantuk
  - Waktu terakhir minum

## 🚀 Teknologi yang Digunakan

- [Electron.js](https://www.electronjs.org/) — Untuk membangun aplikasi desktop lintas platform.
- [Teachable Machine + TensorFlow.js](https://teachablemachine.withgoogle.com/) — Untuk AI image classification berbasis kamera.
- HTML, CSS, JavaScript — Antarmuka dan logika utama aplikasi.

## 🧠 Cara Kerja Singkat

1. Pengguna memilih kamera dari dropdown.
2. Saat klik **Mulai Belajar**, aplikasi:
   - Menampilkan video dari webcam.
   - Memuat model AI.
   - Mendeteksi aktivitas secara real-time.
3. Berdasarkan hasil klasifikasi:
   - Jika terdeteksi "Minum", maka dihitung dan dicatat.
   - Jika "Mengantuk", maka aplikasi memberi peringatan.
   - Jika "Kondisi baik", maka notifikasi disembunyikan.

## 🛠️ Cara Menjalankan Aplikasi

```bash
git clone https://github.com/username/Smart-Learning-Monitor-With-AI.git
cd Smart-Learning-Monitor-With-AI

npm install
npm start
