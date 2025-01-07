const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const visualizerSelect = document.getElementById('visualizer-select');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let source;
let isPlaying = false;

let selectedVisualizer = 'circular-bars';

visualizerSelect.addEventListener('change', () => {
    selectedVisualizer = visualizerSelect.value;
});

function setupVisualizer() {
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; 
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    visualize();
}

function visualize() {
    requestAnimationFrame(visualize);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedVisualizer === 'circular-bars') {
        drawCircularBars();
    } else if (selectedVisualizer === 'soundwave') {
        drawRGBSoundwave();
    }
}

function drawCircularBars() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const totalBars = 100;
    const radius = 125;

    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    for (let i = 0; i < totalBars; i++) {
        const value = dataArray[i];
        const angle = (Math.PI * 2 * i) / totalBars;

        const dynamicRadius = radius + volume * 0.3;

        const barHeight = Math.log10(1 + value) * 60;
        const x1 = centerX + Math.cos(angle) * dynamicRadius;
        const y1 = centerY + Math.sin(angle) * dynamicRadius;
        const x2 = centerX + Math.cos(angle) * (dynamicRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (dynamicRadius + barHeight);

        const color = `hsl(${i / totalBars * 360}, 80%, 50%)`;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    const pulseRadius = radius + volume * 0.7;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
    ctx.lineWidth = 5;
    ctx.stroke();
}

function drawRGBSoundwave() {
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    const centerY = canvas.height / 2;

    for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];
        const barHeight = value * 1.5; 

        const frequencyPercent = i / dataArray.length;
        const red = Math.sin(0.3 * Math.PI * frequencyPercent) * 127 + 128;
        const green = Math.sin(0.3 * Math.PI * frequencyPercent + 2) * 127 + 128;
        const blue = Math.sin(0.3 * Math.PI * frequencyPercent + 4) * 127 + 128;

        ctx.fillStyle = `rgb(${Math.floor(red)}, ${Math.floor(green)}, ${Math.floor(blue)})`;

        const x = i * barWidth;
        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
    }
}

// Handle resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
