const emojisBase = ["🐶", "🐱", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦉", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐢", "🐍"];
const emojis = [...emojisBase, ...emojisBase];  // 25 pareslet cartasViradas = [];
let bloqueado = false;
let jogador = 1;
let pontos = {1: 0, 2: 0};
let jogoAcabou = false;
let efeitosAtivos = true;
let musicaAtiva = true;

const somInicio = document.getElementById("som-inicio");
const somVirar = document.getElementById("som-virar");
const somAcerto = document.getElementById("som-acerto");
const somLoop = document.getElementById("som-loop");
const somFim = document.getElementById("som-fim");

const volumes = {
  inicio: 0.02,
  virar: 0.4,
  acerto: 0.3,
  loop: 0.02,
  fim: 0.4
};

for (let [key, value] of Object.entries(volumes)) {
  document.getElementById(`som-${key}`).volume = value;
}

function iniciar() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  iniciarJogo();
}

function iniciarJogo() {
  document.getElementById("tabuleiro").innerHTML = "";
  document.getElementById("resultado").textContent = "";
  pontos = {1: 0, 2: 0};
  document.getElementById("p1").textContent = 0;
  document.getElementById("p2").textContent = 0;
  cartasViradas = [];
  bloqueado = false;
  jogador = 1;
  jogoAcabou = false;

  const cartas = embaralhar([...emojis]);
  cartas.forEach(emoji => criarCarta(emoji));

  if (efeitosAtivos) {
    somInicio.currentTime = 0;
    somInicio.play();
  }

  if (musicaAtiva) {
    somLoop.currentTime = 0;
    somLoop.play();
  }
}

function reiniciarJogo() {
  iniciarJogo();
  document.getElementById("menu-config").style.display = "none";
}

function embaralhar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function criarCarta(emoji) {
  const carta = document.createElement("div");
  carta.classList.add("carta");
  const inner = document.createElement("div");
  inner.classList.add("inner");
  const frente = document.createElement("div");
  frente.classList.add("frente");
  frente.textContent = emoji;
  const verso = document.createElement("div");
  verso.classList.add("verso");
  inner.appendChild(frente);
  inner.appendChild(verso);
  carta.appendChild(inner);
  carta.addEventListener("click", () => virarCarta(carta, emoji));
  document.getElementById("tabuleiro").appendChild(carta);
}

function virarCarta(carta, emoji) {
  if (carta.classList.contains("virada") || jogoAcabou || bloqueado) return;

  if (efeitosAtivos) {
    somVirar.currentTime = 0;
    somVirar.play();
  }

  carta.classList.add("virada");
  cartasViradas.push({carta, emoji});

  if (cartasViradas.length === 2) {
    bloqueado = true;
    const [c1, c2] = cartasViradas;

    if (c1.emoji === c2.emoji) {
      pontos[jogador]++;
      document.getElementById(`p${jogador}`).textContent = pontos[jogador];
      if (efeitosAtivos) {
        somAcerto.currentTime = 0;
        somAcerto.play();
      }
      cartasViradas = [];
      bloqueado = false;
      verificarFim();
    } else {
      setTimeout(() => {
        c1.carta.classList.remove("virada");
        c2.carta.classList.remove("virada");
        cartasViradas = [];
        bloqueado = false;
        jogador = jogador === 1 ? 2 : 1;
      }, 1000);
    }
  }
}

function verificarFim() {
  const todas = document.querySelectorAll(".carta");
  const viradas = document.querySelectorAll(".carta.virada");
  if (todas.length === viradas.length) {
    jogoAcabou = true;
    let resultado = '';
    if (pontos[1] > pontos[2]) {
      resultado = 'Jogador 1 venceu!';
      document.getElementById("resultado").style.color = "blue";
    } else if (pontos[2] > pontos[1]) {
      resultado = 'Jogador 2 venceu!';
      document.getElementById("resultado").style.color = "red";
    } else {
      resultado = 'Empate!';
      document.getElementById("resultado").style.color = "yellow";
    }
    document.getElementById("resultado").textContent = resultado;
    if (efeitosAtivos) {
      somFim.play();
    }
  }
}

function toggleSons() {
  efeitosAtivos = document.getElementById("toggle-som").checked;
}

function toggleMusica() {
  musicaAtiva = document.getElementById("toggle-music").checked;
  if (musicaAtiva) {
    somLoop.play();
  } else {
    somLoop.pause();
  }
}

function toggleMenu() {
  const menu = document.getElementById("menu-config");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function voltarMenu() {
  somLoop.pause();
  document.getElementById("game-container").style.display = "none";
  document.getElementById("menu").style.display = "flex";
}
