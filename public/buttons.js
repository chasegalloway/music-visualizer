const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');

function playAudio() {
    if (isPlaying) return;

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    source.start(0);
    isPlaying = true;

    source.onended = () => {
        isPlaying = false;
    };
}

function pauseAudio() {
    if (source) {
        source.stop();
        isPlaying = false;
    }
}

playButton.addEventListener('click', () => {
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    playAudio();
});

pauseButton.addEventListener('click', () => {
    pauseAudio();
});
