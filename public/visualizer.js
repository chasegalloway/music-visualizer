const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioContext;
let analyser;
let dataArray;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const audioData = e.target.result;

        audioContext.decodeAudioData(audioData, (buffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;

            source.connect(analyser);
            analyser.connect(audioContext.destination);

            dataArray = new Uint8Array(analyser.frequencyBinCount);

            source.start();

            visualize();
        });
    };

    reader.readAsArrayBuffer(file);
});

function visualize() {
    requestAnimationFrame(visualize);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const totalBars = 128; 
    const radius = 150;

    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    for (let i = 0; i < totalBars; i++) {
        const value = dataArray[i];
        const angle = (Math.PI * 2 * i) / totalBars;

        const dynamicRadius = radius + volume * 0.3;

        const barHeight = value * 0.7;

        const x1 = centerX + Math.cos(angle) * dynamicRadius;
        const y1 = centerY + Math.sin(angle) * dynamicRadius;
        const x2 = centerX + Math.cos(angle) * (dynamicRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (dynamicRadius + barHeight);

        const color = `hsl(${i / totalBars * 360}, 80%, 50%)`;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
q
    const pulseRadius = radius + volume * 0.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
    ctx.lineWidth = 5;
    ctx.stroke();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
