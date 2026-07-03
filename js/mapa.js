// ===================== MÓDULO DO MAPA =====================
// Gera um mapa ilustrado em SVG (placeholder estilizado da Grécia
// Antiga) com 8 pontos posicionados, representando cada pergaminho.

// Posições (x, y) dos pontos dentro do viewBox 0 0 900 560
const POSICOES_PONTOS = [
  { x: 90,  y: 460 }, // 1 - Entrada de Atenas
  { x: 230, y: 340 }, // 2 - Praça (Ágora)
  { x: 400, y: 430 }, // 3 - Templo
  { x: 520, y: 260 }, // 4 - Academia
  { x: 650, y: 380 }, // 5 - Jardim de Observação
  { x: 380, y: 180 }, // 6 - Conselho da Cidade
  { x: 700, y: 160 }, // 7 - Centro de Debates
  { x: 800, y: 90 }   // 8 - Tesouro Final
];

function gerarFundoIlustrado() {
  return `
    <defs>
      <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bfe3e8"/>
        <stop offset="100%" stop-color="#eaddb5"/>
      </linearGradient>
      <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3f8fa3"/>
        <stop offset="100%" stop-color="#235f6e"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="900" height="560" fill="url(#ceu)"/>
    <rect x="0" y="400" width="900" height="160" fill="url(#mar)"/>

    <ellipse cx="120" cy="420" rx="220" ry="60" fill="#c9a96b" opacity="0.5"/>
    <ellipse cx="650" cy="430" rx="280" ry="70" fill="#bb9657" opacity="0.45"/>
    <ellipse cx="430" cy="450" rx="300" ry="50" fill="#d8c08a" opacity="0.4"/>

    <g opacity="0.85">
      <rect x="350" y="120" width="220" height="14" fill="#e8e2d0"/>
      <rect x="360" y="60" width="14" height="60" fill="#e8e2d0"/>
      <rect x="400" y="60" width="14" height="60" fill="#e8e2d0"/>
      <rect x="440" y="60" width="14" height="60" fill="#e8e2d0"/>
      <rect x="480" y="60" width="14" height="60" fill="#e8e2d0"/>
      <rect x="520" y="60" width="14" height="60" fill="#e8e2d0"/>
      <polygon points="345,60 575,60 460,20" fill="#d8cdb0"/>
    </g>

    <g opacity="0.6">
      <rect x="100" y="380" width="10" height="50" fill="#cfc4a3"/>
      <rect x="700" y="300" width="10" height="50" fill="#cfc4a3"/>
      <rect x="250" y="250" width="10" height="50" fill="#cfc4a3"/>
    </g>
  `;
}

function gerarPontoSVG(pergaminho, posicao, status) {
  const classes = `ponto-mapa ${status}`;
  return `
    <g class="${classes}" data-id="${pergaminho.id}" tabindex="0" role="button"
       aria-label="Pergaminho ${pergaminho.id}: ${pergaminho.local}">
      <circle class="circulo-ponto" cx="${posicao.x}" cy="${posicao.y}" r="28"></circle>
      <text class="label-ponto" x="${posicao.x}" y="${posicao.y + 5}">
        ${status === "concluido" ? "✓" : (status === "bloqueado" ? "🔒" : pergaminho.id)}
      </text>
      <text class="label-ponto" x="${posicao.x}" y="${posicao.y + 46}" style="font-size:11px;">
        ${pergaminho.local}
      </text>
    </g>
  `;
}

function renderizarMapa(progressoAtual, onPontoClicado) {
  const container = document.getElementById("mapa-container");

  let pontosSVG = "";
  PERGAMINHOS.forEach((pergaminho, index) => {
    const posicao = POSICOES_PONTOS[index];
    let status;
    if (pergaminho.id < progressoAtual) {
      status = "concluido";
    } else if (pergaminho.id === progressoAtual) {
      status = "desbloqueado";
    } else {
      status = "bloqueado";
    }
    pontosSVG += gerarPontoSVG(pergaminho, posicao, status);
  });

  container.innerHTML = `
    <svg viewBox="0 0 900 560" xmlns="http://www.w3.org/2000/svg">
      ${pontosSVG}
    </svg>
  `;

  const pontos = container.querySelectorAll(".ponto-mapa.desbloqueado");
  pontos.forEach((ponto) => {
    const id = parseInt(ponto.getAttribute("data-id"), 10);
    ponto.addEventListener("click", () => onPontoClicado(id));
    ponto.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") onPontoClicado(id);
    });
  });
}
MAPAEOF