const icons = ["👻","🕷️","🕸️","👁️","🧪","🪦","🎃","🦇"];

const flipSound = document.getElementById("flipSound");

function playSound() {
  flipSound.currentTime = 0;
  flipSound.play();
}

function getCardDesign(symbol) {
  return `
    <div class="face front">
      <div class="icon">${symbol}</div>
    </div>
    <div class="face back"></div>
  `;
}

let first, second, lock;
let flips, time, matches;
let timer;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* 💥 PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = Math.random() * 6 + 2;
    this.speedY = Math.random() * 3 + 1;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
  }

  update() {
    this.y -= this.speedY;
    this.size -= 0.02;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  for (let i = 0; i < 120; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach((p, i) => {
    p.update();
    p.draw();

    if (p.size <= 0) {
      particlesArray.splice(i, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}

function startGame() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  let cards = shuffle([...icons, ...icons]);

  first = null;
  second = null;
  lock = false;
  flips = 0;
  time = 0;
  matches = 0;

  document.getElementById("flips").textContent = flips;
  document.getElementById("time").textContent = time;
  document.getElementById("overlay").style.display = "none";

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById("time").textContent = time;
  }, 1000);

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = getCardDesign(symbol);

    card.onclick = () => {
      if (lock || card.classList.contains("flip")) return;

      playSound();

      card.classList.add("flip");
      flips++;
      document.getElementById("flips").textContent = flips;

      if (!first) {
        first = card;
      } else {
        second = card;
        lock = true;

        if (first.querySelector(".icon").textContent === second.querySelector(".icon").textContent) {
          matches++;
          first = null;
          second = null;
          lock = false;

          if (matches === icons.length) {
            clearInterval(timer);
            document.getElementById("overlay").style.display = "flex";
            createParticles();
            animateParticles();
          }
        } else {
          setTimeout(() => {
            first.classList.remove("flip");
            second.classList.remove("flip");
            first = null;
            second = null;
            lock = false;
          }, 600);
        }
      }
    };

    board.appendChild(card);
  });
}

startGame();