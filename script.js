const imagens = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];
let cartasViradas = [];
let cartasAcertadas = 0;
let jogadorAtual = 1;
let pontosJogador1 = 0;
let pontosJogador2 = 0;
let tempo = 0;
let cronometro;

const somVirar = document.getElementById("som-virar");
const somAcerto = document.getElementById("som-acerto");
const somFim = document.getElementById("som-fim");
const somInicio = document.getElementById("som-inicio");
const somLoop = document.getElementById("som-loop");

let musicaAtiva = true;
let sonsAtivos = true;

function iniciarJogo() {
  document.getElementById("mensagem-final").style.display = "none";
  const tabuleiro = document.getElementById("tabuleiro");
  tabuleiro.innerHTML = "";

  const pares = [...imagens, ...imagens];
  embaralhar(pares);

  pares.forEach((icone, i) => {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.icone = icone;
    carta.dataset.index = i;
    carta.style.backgroundImage = "url('verso.jpg')";
    carta.addEventListener("click", virarCarta);
    tabuleiro.appendChild(carta);
  });

  cartasViradas = [];
  cartasAcertadas = 0;
  jogadorAtual = 1;
  pontosJogador1 = 0;
  pontosJogador2 = 0;
  tempo = 0;
  atualizarPlacar();
  atualizarTimer();
  clearInterval(cronometro);
  cronometro = setInterval(() => {
    tempo++;
    atualizarTimer();
  }, 1000);

  if (musicaAtiva) somLoop.play();
  if (sonsAtivos) somInicio.play();
}

function embaralhar(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function virarCarta(e) {
  const carta = e.target;
  if (cartasViradas.length < 2 && !carta.classList.contains("acertada") && !cartasViradas.includes(carta)) {
    carta.style.backgroundImage = "";
    carta.textContent = carta.dataset.icone;
    if (sonsAtivos) somVirar.play();
    cartasViradas.push(carta);

    if (cartasViradas.length === 2) {
      setTimeout(verificarPar, 800);
    }
  }
}

function verificarPar() {
  const [c1, c2] = cartasViradas;
  if (c1.dataset.icone === c2.dataset.icone) {
    c1.classList.add("acertada");
    c2.classList.add("acertada");
    if (sonsAtivos) somAcerto.play();

    cartasAcertadas += 2;
    if (jogadorAtual === 1) pontosJogador1++;
    else pontosJogador2++;

    atualizarPlacar();

    if (cartasAcertadas === imagens.length * 2) {
      clearInterval(cronometro);
      mostrarMensagemFinal();
      if (sonsAtivos) somFim.play();
    }
  } else {
    setTimeout(() => {
      c1.textContent = "";
      c1.style.backgroundImage = "url('verso.jpg')";
      c2.textContent = "";
      c2.style.backgroundImage = "url('verso.jpg')";
    }, 400);

    jogadorAtual = jogadorAtual === 1 ? 2 : 1;
    atualizarPlacar();
  }

  cartasViradas = [];
}

function atualizarPlacar() {
  document.getElementById("jogador1").textContent = `🔵 ${pontosJogador1}`;
  document.getElementById("jogador2").textContent = `🔴 ${pontosJogador2}`;
  document.getElementById("jogador1").classList.toggle("ativo", jogadorAtual === 1);
  document.getElementById("jogador2").classList.toggle("ativo", jogadorAtual === 2);
}

function atualizarTimer() {
  document.getElementById("timer").textContent = `Tempo: ${tempo}s`;
}

function mostrarMensagemFinal() {
  const msg = document.getElementById("mensagem-final");
  msg.style.display = "block";
  if (pontosJogador1 > pontosJogador2) {
    msg.textContent = "🔵 Você Venceu!";
    msg.style.color = "blue";
  } else if (pontosJogador2 > pontosJogador1) {
    msg.textContent = "🔴 Você Venceu!";
    msg.style.color = "red";
  } else {
    msg.textContent = "🟡 Empate!";
    msg.style.color = "yellow";
  }
}

function toggleMenu() {
  const menu = document.getElementById("menu-config");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleMusica() {
  musicaAtiva = !musicaAtiva;
  if (musicaAtiva) {
    somLoop.play();
  } else {
    somLoop.pause();
  }
}

function toggleSons() {
  sonsAtivos = !sonsAtivos;
  somVirar.volume = sonsAtivos ? 0.4 : 0;
  somAcerto.volume = sonsAtivos ? 0.3 : 0;
  somFim.volume = sonsAtivos ? 0.4 : 0;
  somInicio.volume = sonsAtivos ? 0.02 : 0;
}

iniciarJogo();
