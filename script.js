
const video = document.querySelector('#video');
var nono = 'OFF';

function startStreamVideo(){

    nono = 'ON';
    videoFrame();
    document.querySelector('#showme').play();
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    }).then(stream => {
        video.srcObject = stream;
    }).catch(console.error)
};

function stopStreamedVideo() {

    nono = 'OFF';
    videoFrame();
    document.querySelector('#bye').play();
    const tracks = video.srcObject.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    video.srcObject = null;
};

function playAudio(){
    document.querySelector('#hello').play();
}

function videoFrame(){
    const frame = document.querySelector('#video-frame');
    if(nono === 'OFF'){
        frame.setAttribute("style", "cursor:help");
        frame.addEventListener('mouseover', playAudio);
        video.classList.add('hidden');
    } else {
        frame.setAttribute("style", "cursor:inherit");
        frame.removeEventListener('mouseover', playAudio);
        video.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed. Nono is ready!');
    videoFrame();
    document.querySelector('#btn-start').addEventListener('click', startStreamVideo);
    document.querySelector('#btn-stop').addEventListener('click', stopStreamedVideo);
});
