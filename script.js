// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

let canvas = document.getElementById("user-image");
let imagePicker = document.getElementById("image-input");
let clearButton = document.querySelector("button[type='reset']");
let readTextButton = document.querySelector("button[type='button']");
let textTop = document.getElementById("text-top");
let textBottom = document.getElementById("text-bottom");
let generateButton = document.querySelector("button[type='submit']");
let voicePicker = document.getElementById("voice-selection");
let voiceSynth = window.speechSynthesis;
let voiceVolumeBar = document.querySelector("input[type='range']");
let form = document.getElementById("generate-meme");

let voiceVolume = voiceVolumeBar.value;
var voices = []

voiceVolumeBar.addEventListener('change', () =>{
  voiceVolume = voiceVolumeBar.value / 100;
});

readTextButton.addEventListener('click', () =>{
  speek();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
})

imagePicker.addEventListener('change', () => {
  if (imagePicker.files != undefined){
    img.alt = imagePicker.files[0].name;
    img.src = URL.createObjectURL(imagePicker.files[0]);
    console.log("File picked");
  }
});

speechSynthesis.onvoiceschanged = loadVoices;



function loadVoices() {
  voices = voiceSynth.getVoices();
  voicePicker.innerHTML = '';
  for(let i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voicePicker.appendChild(option);
  }
  var selectedIndex = 0;
  if (voicePicker.selectedIndex >= 0) {
     voicePicker.selectedIndex;
  }
  voicePicker.selectedIndex = selectedIndex;
  voicePicker.disabled = false;
}
 
function speek(){
  if (voiceSynth.speaking){
    return
  } else if (textTop.value != "" || textBottom.value != ""){
    let wordsToSpeak = textTop.value + " " + textBottom.value;
    let speach = new SpeechSynthesisUtterance(wordsToSpeak);
    let selectedVoice = voicePicker.selectedOptions[0].getAttribute("data-name");
    for(let i = 0; i < voices.length; i++){
      if (voices[i].name == selectedVoice){
        speach.voice = voices[i];
        break;
      }
    }
    speach.rate = 0.7;
    speach.volume = voiceVolume;
    voiceSynth.speak(speach);
  }
}

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  console.log("rendering");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (img.src != ""){
    let position = getDimmensions(canvas.width, canvas.height, img.width, img.height);
    ctx.beginPath();
    ctx.rect(0, 0, 400, 400);
    ctx.fill();
    ctx.drawImage(img, position.startX, position.startY, position.width, position.height);

    if ((textTop.value != "" || textBottom.value != "") && (generateButton.disabled == true)){
      ctx.font = "Bold 50px Helvetica";
      ctx.lineWidth = 3;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.textAlign = "center";
      if (textTop.value != ""){
        ctx.fillText(textTop.value, canvas.width / 2, 60, canvas.width);
        ctx.strokeText(textTop.value, canvas.width / 2, 60, canvas.width);
      }
      if (textBottom.value != ""){
        ctx.fillText(textBottom.value, canvas.width / 2, canvas.height - 20, canvas.width);
        ctx.strokeText(textBottom.value, canvas.width / 2, canvas.height - 20, canvas.width);
      }
    }
  }
});

generateButton.addEventListener("click", () => {
  let ctx = canvas.getContext("2d");
  ctx.font = "Bold 50px Helvetica";
  ctx.lineWidth = 3;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.textAlign = "center";
  if (textTop.value != ""){
    ctx.fillText(textTop.value, canvas.width / 2, 60, canvas.width);
    ctx.strokeText(textTop.value, canvas.width / 2, 60, canvas.width);
  }
  if (textBottom.value != ""){
    ctx.fillText(textBottom.value, canvas.width / 2, canvas.height - 20, canvas.width);
    ctx.strokeText(textBottom.value, canvas.width / 2, canvas.height - 20, canvas.width);
  }
  generateButton.disabled = true;
  clearButton.disabled = false;
  readTextButton.disabled = false;
});

textTop.addEventListener("change", () => {
  generateButton.disabled = false;
});

textBottom.addEventListener("change", () => {
  generateButton.disabled = false;
});

clearButton.addEventListener("click", () =>{
  console.log("this is happening");
  img.src = "";
  generateButton.disabled = false;
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height)
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
