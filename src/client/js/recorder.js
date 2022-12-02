const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");
const audioOnly = document.getElementById("audioOnly");

let recordSetting = {
    audio: true,
    video: false,
};
let stream;

const handleStop = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => console.log(event);
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 10000);
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia(recordSetting);
    video.srcObject = stream;
    video.play();
};

const handelAudioOnly = () => {
    if (audioOnly.checked) {
        recordSetting.video = false;
    } else {
        recordSetting.video = true;
    }

    init();
};

init();

startBtn.addEventListener("click", handleStart);
audioOnly.addEventListener("input", handelAudioOnly);
