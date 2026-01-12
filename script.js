const calls = [
  {
    name: "Camilin",
    img: "img/camilin.jpeg",
    audios: ["audio/camilin.mp3"],
    text: "... Hermana Kenia... yo te amo mucho ❤"
  },
  {
    name: "Cristian",
    img: "img/cristian.jpeg",
    audios: ["audio/cristian.mp3"],
    text: "... Aló, Kenia... hola, sí... soy tu queridísimo hermano, jeje... te quiero decir que te quiero mucho y siempre estarás en mi corazón, y pase lo que pase serás mi hermana siempre y nunca te olvidaré... te queremos aquí y todos los demás..."
  },
  {
    name: "CELO",
    img: "img/domenica.jpeg",
    audios: ["audio/domenica.mp3"],
    text: "Holi Wadeface pues quiero decirte que te quiero mucho y te amo mucho. Eres la mejor hermana en este mundo y, pues, te mando un beso Wadeface ... y ya sabes que somos la una para la otra, jaja ❤..."
  },
  {
    name: "Jessica",
    img: "img/jessica.jpeg",
    audios: ["audio/jessica.mp3"],
    text: "Kenia querida... agradezco tanto a Dios por haberte puesto en mi camino... para mí, verte crecer así ha sido lo más maravilloso, y ver cumplir cada sueño, cada meta que tienes, me llena de orgullo y satisfacción... sigue así, mi niña hermosa, hasta lograr tu sueño más preciado... recuerda que te amo ❤ y que siempre puedes contar conmigo..."
  },
  {
    name: "Momy",
    img: "img/momy.jpeg",
    audios: ["audio/momy.mp3"],
    text: "Mi niña, te amo un montón, mi corazón. Me siento muy orgullosa de ti. Que Dios te bendiga enormemente a lo largo de tu vida, mi amor, y que se cumplan todos tus sueños, mi corazón. Te amo, te quiero mucho, te respeto bastante... eres lo mejo- lo mejor... una de las tres cosillas que Dios me ha bendecido enormemente, mi amor. Mi peque grandota... te amo, mi amor ❤..."
  },
  {
    name: "Dady",
    img: "img/dady.jpeg",
    audios: [
      "audio/dady1.mp3",
      "audio/dady2.mp3",
      "audio/dady3.mp3"
    ],
    text: "Hola, mija... te envié este audio para decirte esto: que me siento muy orgulloso de ti... de que tengas esa actitud, y que tengas muchos éxitos... siempre me voy a sentir orgulloso de todos, pero, mijita, tú vas demostrando cada día que eres mejor... eso es lo bueno, querer ser una señorita de bien... que viva la patria."
  }
];

let finalIndex = 0;
let finalTimeout = null;

const finalDialogs = [
  "Espero de todo corazón......",
  "Que te haya gustado.......",
  "Y bueno mi amor, espero de todo corazón que te haya gustado...",
  "Este quería que sea especial y no me quise incluir..",
  "Te amo demasiado mi princesita hermosa",
  "Un besote mi pequeño embudo"
];


let typingInterval = null;
let callStarted = false;

let index = 0;
let audioIndex = 0;
let callAudio = new Audio();

let timerInterval = null;
let seconds = 0;

// Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
let sourceNode = null;
let gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);


document.getElementById("startBtn").onclick = () => {
  // 🔹 Importante para celulares
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("callScreen").classList.remove("hidden");

  bgMusic.play();
  document.getElementById("callScreen").classList.add("fade-in");

  loadCall();
  setInterval(createFlower, 1200);
};

function loadCall() {
  const c = calls[index];

  // 🎚️ Volumen especial para CELO y Jessica
  if (c.name === "CELO" || c.name === "Jessica") {
    gainNode.gain.value = 1.5; // 150%
  } else {
    gainNode.gain.value = 1.0; // normal
  }

  audioIndex = 0;
  callStarted = false;

  stopTimer();

  // Reset timer
  const timer = document.getElementById("callTimer");
  timer.innerText = "00:00";
  timer.classList.remove("show");

  // Datos del contacto
  document.getElementById("callerName").innerText = c.name;
  document.getElementById("callerImg").src = c.img;

  // Reset UI
  document.getElementById("playSlider").value = 0;
  stopTyping();

  const status = document.getElementById("callStatus");
  status.innerText = "Llamando…";
  status.classList.remove("active");

  // 🔊 Preparar audio
  callAudio = new Audio(c.audios[audioIndex]);

  // 👉 Evento onended (MUY IMPORTANTE)
  callAudio.onended = () => {
    audioIndex++;

    if (audioIndex < calls[index].audios.length) {
      callAudio.src = calls[index].audios[audioIndex];
      callAudio.play();
    } else {
      bgMusic.volume = 0.6;
      stopTimer();
      document.getElementById("callTimer").classList.remove("show");
    }
  };
  // 👉 MOSTRAR DE NUEVO LA BARRA
  document.querySelector(".slider").classList.remove("hide");
}

document.getElementById("playSlider").oninput = (e) => {
  if (e.target.value >= 95 && !callStarted) {
    callStarted = true;

    bgMusic.volume = 0.15;
    callAudio.play();

    // Ocultar slider
    document.querySelector(".slider").classList.add("hide");

    const status = document.getElementById("callStatus");
    status.innerText = "Llamada en transcurso";

    const timer = document.getElementById("callTimer");
    timer.classList.add("show");

    startTimer();
    typeText(calls[index].text);
  }
};


document.getElementById("hangBtn").onclick = () => {
  stopTyping();
  callAudio.pause();
  stopTimer();

  // 👉 SI ES DADY → FINAL
  if (index === calls.length - 1) {
    startFinalScene();
    return;
  }

  const screen = document.getElementById("callScreen");
  bgMusic.volume = 0.6;

  screen.classList.add("fade-out");
  screen.classList.remove("fade-in");

  setTimeout(() => {
    index++;
    loadCall();
    screen.classList.remove("fade-out");
    screen.classList.add("fade-in");
  }, 600);
};


function typeText(text) {
  let i = 0;
  const box = document.getElementById("textBox");

  if (typingInterval) clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    box.innerText = text.slice(0, i) + "|";
    i++;

    if (i > text.length) {
      clearInterval(typingInterval);
      typingInterval = null;
      box.innerText = text; // quita el cursor al final
    }
  }, 60); // 🔹 más lento (puedes subir a 100 si quieres)
}

function startTimer() {
  seconds = 0;
  updateTimer();

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimer() {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  document.getElementById("callTimer").innerText = `${min}:${sec}`;
}

function createFlower() {
  const flower = document.createElement("img");
  const imgs = ["img/flor1.png", "img/flor2.png", "img/flor3.png"];

  flower.src = imgs[Math.floor(Math.random() * imgs.length)];
  flower.className = "flower";
  flower.style.width = `${26 + Math.random() * 40}px`; // Tamaño aleatorio 

  // Márgenes laterales
  const side = Math.random() > 0.5 ? "left" : "right";
  flower.style[side] = `${Math.random() * 20}px`;

  flower.style.animationDuration = `${8 + Math.random() * 6}s`;

  document.querySelector(".flowers").appendChild(flower);

  setTimeout(() => flower.remove(), 15000);
}


function stopTyping() {
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }
  document.getElementById("textBox").innerText = "";
}




function startFinalScene() {
  const overlay = document.getElementById("finalOverlay");
  const text = document.getElementById("finalText");

  overlay.classList.add("show");
  finalIndex = 0;

  function showNext() {
    if (finalIndex >= finalDialogs.length) return;

    text.innerText = finalDialogs[finalIndex];
    text.classList.add("show");

    finalTimeout = setTimeout(() => {
      text.classList.remove("show");
      finalIndex++;

      setTimeout(showNext, 900);
    }, 2400);
  }

  setTimeout(showNext, 1000);
}

