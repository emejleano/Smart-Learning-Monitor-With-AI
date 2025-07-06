const URL = "https://teachablemachine.withgoogle.com/models/mqj_ZV_Li/";
let model, webcam, labelContainer, maxPredictions;
let belajarTimer = 0;
let totalMengantuk = 0;
let totalMinum = 0;
let terakhirMinum = "-";
let sudahMunculMinum = false;
let sudahJalan = false;
let timerInterval = null;
let isNotificationShowing = false;

// Audio untuk notifikasi minum
const audioMinum = new Audio("music/minum.mp3");
audioMinum.loop = true;

// Populate dropdown kamera saat halaman siap
window.addEventListener("DOMContentLoaded", async () => {
    const select = document.getElementById("camera-select");
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === "videoinput");
        
        videoDevices.forEach((device, index) => {
            const option = document.createElement("option");
            option.value = device.deviceId;
            option.text = device.label || `Kamera ${index + 1}`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Gagal mendapatkan perangkat kamera:", err);
    }
});

async function init() {
    if (sudahJalan) return;
    
    try {
        sudahJalan = true;
        
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
        // Load model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        // Setup webcam
        const selectedDeviceId = document.getElementById("camera-select").value;
        webcam = new tmImage.Webcam(200, 200, true);
        
        const webcamConfig = selectedDeviceId ? { deviceId: selectedDeviceId } : undefined;
        await webcam.setup(webcamConfig);
        await webcam.play();
        
        // Start prediction loop
        window.requestAnimationFrame(loop);
        
        // Setup webcam container
        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = "";
        webcamContainer.appendChild(webcam.canvas);
        
        // Setup label container
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
        
        // Start timer
        startTimer();
        
    } catch (err) {
        console.error("Error saat inisialisasi:", err);
        alert("Gagal mengakses kamera: " + err.message);
        sudahJalan = false;
    }
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        belajarTimer++;
        updateDisplay("belajar-time", belajarTimer);
        
        // Notifikasi minum setiap 30 detik (untuk testing, bisa diubah ke 1800 untuk 30 menit)
        if (belajarTimer % 30 === 0 && !sudahMunculMinum) {
            tampilkanNotifikasi("Minum dulu broh!");
            playAudio();
            sudahMunculMinum = true;
        }
    }, 1000);
}

function playAudio() {
    audioMinum.play().catch(err => {
        console.log("Audio tidak bisa diputar:", err);
    });
}

function stopAudio() {
    audioMinum.pause();
    audioMinum.currentTime = 0;
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

async function predict() {
    if (!model || !webcam || !webcam.canvas) return;
    
    try {
        const prediction = await model.predict(webcam.canvas);
        prediction.sort((a, b) => b.probability - a.probability);
        
        const top = prediction[0];
        
        // Update label display
        for (let i = 0; i < prediction.length && i < labelContainer.childNodes.length; i++) {
            labelContainer.childNodes[i].innerHTML = 
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        }
        
        // Handle predictions
        if (top.className === "Minum" && top.probability > 0.9) {
            handleMinumDetection();
        } else if (top.className === "Mengantuk" && top.probability > 0.9) {
            handleMengantukDetection();
        } else if (!sudahMunculMinum && !isNotificationShowing) {
            sembunyikanNotifikasi();
        }
        
    } catch (err) {
        console.error("Error saat prediksi:", err);
    }
}

function handleMinumDetection() {
    if (sudahMunculMinum) {
        sembunyikanNotifikasi();
        stopAudio();
        sudahMunculMinum = false;
        
        totalMinum++;
        updateDisplay("total-minum", totalMinum);
        
        terakhirMinum = new Date().toLocaleTimeString();
        updateDisplay("terakhir-minum", terakhirMinum);
    }
}

function handleMengantukDetection() {
    if (!isNotificationShowing) {
        tampilkanNotifikasi("Kamu terlihat mengantuk! Istirahat sebentar yuk!");
        isNotificationShowing = true;
        
        totalMengantuk++;
        updateDisplay("total-mengantuk", totalMengantuk);
        
        // Hilangkan notifikasi mengantuk setelah 5 detik
        setTimeout(() => {
            sembunyikanNotifikasi();
            isNotificationShowing = false;
        }, 5000);
    }
}

function tampilkanNotifikasi(pesan) {
    const notifikasi = document.getElementById("notifikasi");
    if (notifikasi) {
        notifikasi.innerHTML = pesan;
        notifikasi.style.display = "block";
    }
}

function sembunyikanNotifikasi() {
    const notifikasi = document.getElementById("notifikasi");
    if (notifikasi) {
        notifikasi.innerHTML = "";
        notifikasi.style.display = "none";
    }
}

function updateDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Fungsi untuk menghentikan webcam dan timer
function stopWebcam() {
    if (webcam) {
        webcam.stop();
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    stopAudio();
    sudahJalan = false;

    // Kosongkan tampilan webcam dan label
    document.getElementById("webcam-container").innerHTML = '<p class="placeholder">Kamera akan muncul di sini</p>';
    document.getElementById("label-container").innerHTML = '<div class="detection-item">Menunggu deteksi...</div>';
    sembunyikanNotifikasi();
}


// Cleanup saat halaman ditutup
window.addEventListener("beforeunload", () => {
    stopWebcam();
});