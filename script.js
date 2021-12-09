/**
 * VARIABLES
 */

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btns = document.querySelectorAll('.btn');
const icones = document.querySelectorAll('.fas');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');

var model = undefined;
var captureImage;
var offTags = document.querySelectorAll('.off');
var identifiedObjects = [];


/**
 * FONCTIONS
 */

// Lance le demarrage du stream video
function startStreamVideo(){
    if (!model) {
        return;
      }
    // Gère l'affichage du frame de la video en off
    handleVideoFrame(1);
    // Lecture audio
    document.querySelector('#showme').play();
    // Invite l'utilisateur à autoriser l'utilisation de la vidéo
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    }).then(stream => {
        // Retour de la promise MediaStream stockée dans la propriété srcObject de video
        video.srcObject = stream;
        //video.addEventListener('loadeddata', imageRecognition);
    }).catch(console.error);
    // Appelle la fonction de capture d'image toutes les 1 seconde
    captureImage = setInterval(snapshot, 1000);


};

// Fonction de capture d'image du stream puis de reconnaissance
function snapshot(){
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    imageRecognition();
    //console.log(canvas);
}

// Fonction de la reconnaissance d'objet sur l'image
function imageRecognition(){
    var result = document.querySelector('.result');
    // Detecte l'objet dans l'image
    model.detect(canvas).then(predictions => {
        //console.log('Predictions: ', predictions);
        if(predictions[0] !== undefined && predictions[0].score > 0.70){
            // Affiche les prédictions au-dessus de 0.70
            result.innerHTML = predictions[0].class + ' at '+ Math.round(parseFloat(predictions[0].score)*100) + '%';
            // Stocke la prédiction dans un tableau des objets identifiés
            if(!identifiedObjects.includes(predictions[0].class)){
                identifiedObjects.push(predictions[0].class);
            }
        }
    });
}

// Interrompt le stream video
function stopStreamedVideo() {
    //stoppe la capture d'image
    clearInterval(captureImage);
    // Gère l'affichage du frame de la video en off
    handleVideoFrame(0);
    // Lecture audio
    document.querySelector('#bye').play();
    // Arrête le tracking du media
    const tracks = video.srcObject.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    video.srcObject = null;

    // Affiche les objets identifiés
    for(i =0 ; i < identifiedObjects.length; i++){
        console.log(identifiedObjects[i]);
    }
};


//Fonction de lecture de l'audio en fonction du dataset de l'élément
function playAudio(){
    //console.log(this.dataset.audio);
    document.querySelector('#'+this.dataset.audio).play();
}

//Fonction de gestion de l'affichage des éléments en fonction de l'état on/off de Nono
function handleVideoFrame(state){
    const frame = document.getElementById('video-frame');

    // Nono OFF (STOP)
    if(state === 0){
        // modifie le curseur sur la tête de nono
        frame.setAttribute("style", "cursor: help");
        // ajoute l'event lecture audio quand la souris passe sur la tête de nono
        frame.addEventListener('mouseover', playAudio);
        // ajoute la classe hidden pour les éléments à cacher
        for(i =0 ; i < offTags.length; i++){
            offTags[i].classList.add('hidden');
        }
    } 
    // Nono ON (PLAY)
    else {
        // modifie le curseur sur la tête de nono
        frame.setAttribute("style", "cursor: inherit");
        // retire l'event lecture audio quand la souris passe sur la tête de nono
        frame.removeEventListener('mouseover', playAudio);
        // retire la classe hidden pour les éléments à faire apparaitre
        for(i =0 ; i < offTags.length; i++){
            offTags[i].classList.remove('hidden');
        }
    }
}


/**
 * EXECUTION DU CODE
 */

// Ecouteur d'évènement sur le chargement du DOM
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed.');
    //Chargement du model CoCoSsd
    cocoSsd.load().then(function (loadedModel) {
        model = loadedModel;
        //si le model est chargé
        if(model !== undefined){
            console.log('Model fully loaded. Nono is ready!');
            //cache le loader
            document.getElementById('loader').classList.add('hidden');
            //affiche les boutons play et stop
            for(i =0 ; i < btns.length; i++){
                btns[i].classList.remove('hidden');
            }
            //ajoute un ecouteur d'évènement sur le bouton "play"
            btnStart.addEventListener('click', startStreamVideo);
            //ajoute un ecouteur d'évènement sur le bouton "stop"
            btnStop.addEventListener('click', stopStreamedVideo);
            //gére l'affichage du frame de la video en off
            handleVideoFrame(0);
        }
    });

});