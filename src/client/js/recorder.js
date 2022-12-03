import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const files = {
    webm: "recording.webm",
    output: "output.mp4",
    thumbnail: "thumbnail.jpg",
};

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");
const audioOnly = document.getElementById("audioOnly");

let recordSetting = {
    audio: true,
    video: false,
};
let stream;
let recorder;
let recorderTimeout = null;
let videoFile;

const downloadFfmpegConvertedFile = (ffmpeg, filename, filetype) => {
    const ffmpegFile = ffmpeg.FS("readFile", filename);
    const ffmpegBlob = new Blob([ffmpegFile.buffer], { type: filetype });
    const ffmpegUrl = URL.createObjectURL(ffmpegBlob);

    const a = document.createElement("a");
    a.href = ffmpegUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    ffmpeg.FS("unlink", filename);
    URL.revokeObjectURL(ffmpegUrl);
};

const handleDownload = async () => {
    actionBtn.innerText = "Transcoding..";
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.webm, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.webm, "-r", "60", files.output);

    await ffmpeg.run(
        "-i",
        files.webm,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumbnail
    );

    ffmpeg.FS("unlink", files.webm);

    downloadFfmpegConvertedFile(ffmpeg, files.output, "video/mp4");
    if (recordSetting.video) {
        downloadFfmpegConvertedFile(ffmpeg, files.thumbnail, "image/jpg");
    }

    URL.revokeObjectURL(videoFile);

    video.srcObject = null;

    actionBtn.innerText = "Start Recording";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleStart);
};

const stopRecording = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStop = () => {
    if (recorderTimeout) {
        clearTimeout(recorderTimeout);
    }

    stopRecording();
};

const handleStart = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();

    recorderTimeout = setTimeout(() => {
        stopRecording();
    }, 5000);
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
        recordSetting.video = { width: 1024, height: 576 };
    }

    init();
};

init();

actionBtn.addEventListener("click", handleStart);
audioOnly.addEventListener("input", handelAudioOnly);
