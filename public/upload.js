let audioContext;
let audioBuffer;
let analyser;
let dataArray;

const fileInput = document.getElementById('file-input');

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
            audioBuffer = buffer;
            setupVisualizer();   
        });
    };

    reader.readAsArrayBuffer(file);
});
