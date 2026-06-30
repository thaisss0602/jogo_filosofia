// ===================== ESTADO DO JOGO =====================

const estadoJogo = {
  nomeJogador: "",
  progressoAtual: 1,        // posição sequencial (1 a 8)
  dicasUsadas: 0,
  pergaminhoAberto: null,
  alternativaSelecionada: null,
  tentativasNoPergaminho: 0,
  tempoInicio: null,
  tempoFinal: null,
  cronometroInterval: null,
  sequenciaEmbaralhada: []  // array de pergaminhos na ordem aleatória desta sessão
};

// ===================== EMBARALHAMENTO =====================

// Embaralha um array in-place usando Fisher-Yates
function embaralhar(array) {
  const arr = [...array]; // copia para não mutar o original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Retorna um pergaminho com as alternativas embaralhadas,
// atualizando o índice "correta" para a nova posição.
function embaralharAlternativas(pergaminho) {
  const indices = embaralhar([0, 1, 2, 3]);
  const novasAlternativas = indices.map(i => pergaminho.alternativas[i]);
  const novaCorreta = indices.indexOf(pergaminho.correta);
  return { ...pergaminho, alternativas: novasAlternativas, correta: novaCorreta };
}

// Gera a sequência embaralhada para esta sessão:
// - Pergaminho 1 (introdução) e Pergaminho 8 (conclusão) ficam fixos
// - Os pergaminhos do meio (2 ao 7) são embaralhados entre si
// - As alternativas de TODOS os 8 são embaralhadas
function gerarSequenciaEmbaralhada() {
  const primeiro = PERGAMINHOS[0];
  const ultimo = PERGAMINHOS[PERGAMINHOS.length - 1];
  const meio = PERGAMINHOS.slice(1, PERGAMINHOS.length - 1);

  const sequencia = [primeiro, ...embaralhar(meio), ultimo];
  return sequencia.map(embaralharAlternativas);
}

// Retorna o pergaminho da posição atual (1-indexed)
function pergaminhoAtual() {
  return estadoJogo.sequenciaEmbaralhada[estadoJogo.progressoAtual - 1];
}

// ===================== NAVEGAÇÃO ENTRE TELAS =====================

function mostrarTela(idTela) {
  document.querySelectorAll(".tela").forEach((tela) => {
    tela.classList.remove("tela-ativa");
  });
  document.getElementById(idTela).classList.add("tela-ativa");
}

// ===================== TELA 1: NOME =====================

const inputNome = document.getElementById("input-nome");
const erroNomeEl = document.getElementById("erro-nome");
const btnComecar = document.getElementById("btn-comecar");

btnComecar.addEventListener("click", () => {
  const nome = inputNome.value.trim();
  if (nome.length === 0) {
    erroNomeEl.textContent = "Por favor, digite seu nome para continuar.";
    return;
  }
  if (nome.length > 20) {
    erroNomeEl.textContent = "O nome deve ter no máximo 20 caracteres.";
    return;
  }
  erroNomeEl.textContent = "";
  iniciarJogo(nome);
});

inputNome.addEventListener("keypress", (e) => {
  if (e.key === "Enter") btnComecar.click();
});

document.getElementById("btn-ver-ranking-inicio").addEventListener("click", () => {
  exibirTelaRanking();
});

// ===================== INICIAR JOGO =====================

function iniciarJogo(nome) {
  estadoJogo.nomeJogador = nome;
  estadoJogo.progressoAtual = 1;
  estadoJogo.dicasUsadas = 0;
  estadoJogo.tempoInicio = Date.now();
  estadoJogo.sequenciaEmbaralhada = gerarSequenciaEmbaralhada();

  document.getElementById("nome-jogador-exibido").textContent = `👤 ${nome}`;

  iniciarCronometro();
  atualizarMapaENavegar();
  mostrarTela("tela-mapa");
}

// ===================== CRONÔMETRO =====================

function iniciarCronometro() {
  pararCronometro();
  estadoJogo.cronometroInterval = setInterval(() => {
    const segundosDecorridos = Math.floor((Date.now() - estadoJogo.tempoInicio) / 1000);
    document.getElementById("cronometro").textContent = formatarTempo(segundosDecorridos);
  }, 1000);
}

function pararCronometro() {
  if (estadoJogo.cronometroInterval) {
    clearInterval(estadoJogo.cronometroInterval);
    estadoJogo.cronometroInterval = null;
  }
}

// ===================== MAPA =====================

function atualizarMapaENavegar() {
  document.getElementById("progresso-atual").textContent =
    Math.min(estadoJogo.progressoAtual, estadoJogo.sequenciaEmbaralhada.length);

  // O mapa usa progressoAtual como posição sequencial (1 a 8)
  // Os pontos são os mesmos; só o conteúdo muda por embaralhamento
  renderizarMapa(estadoJogo.progressoAtual, abrirPergaminhoPorPosicao);
}

// ===================== MODAL DO PERGAMINHO =====================

const modalPergaminho = document.getElementById("modal-pergaminho");
const elTitulo = document.getElementById("pergaminho-numero");
const elNarrativa = document.getElementById("pergaminho-narrativa");
const elPergunta = document.getElementById("pergaminho-pergunta");
const elAlternativas = document.getElementById("pergaminho-alternativas");
const elFeedback = document.getElementById("pergaminho-feedback");
const elDica = document.getElementById("pergaminho-dica");
const btnConfirmar = document.getElementById("btn-confirmar-resposta");
const btnFechar = document.getElementById("btn-fechar-pergaminho");

// O mapa chama com o id do ponto; convertemos para posição na sequência
function abrirPergaminhoPorPosicao(idPonto) {
  // idPonto é a posição sequencial (1-8) no mapa
  // nós mapeamos diretamente para o índice na sequência embaralhada
  const pergaminho = estadoJogo.sequenciaEmbaralhada[idPonto - 1];
  if (!pergaminho) return;

  estadoJogo.pergaminhoAberto = pergaminho;
  estadoJogo.alternativaSelecionada = null;
  estadoJogo.tentativasNoPergaminho = 0;

  elTitulo.textContent = `Pergaminho ${romanizar(idPonto)}`;
  elNarrativa.textContent = pergaminho.narrativa;
  elPergunta.textContent = pergaminho.pergunta;
  elFeedback.textContent = "";
  elFeedback.className = "feedback-msg";
  elDica.textContent = "";
  btnConfirmar.disabled = false;
  btnConfirmar.textContent = "Confirmar Resposta";

  elAlternativas.innerHTML = "";
  pergaminho.alternativas.forEach((texto, index) => {
    const item = document.createElement("label");
    item.className = "alternativa-item";
    item.innerHTML = `
      <input type="radio" name="alternativa" value="${index}">
      <span>${String.fromCharCode(97 + index)}) ${texto}</span>
    `;
    item.addEventListener("click", () => selecionarAlternativa(index));
    elAlternativas.appendChild(item);
  });

  modalPergaminho.classList.add("modal-ativo");
}

function fecharPergaminho() {
  modalPergaminho.classList.remove("modal-ativo");
  estadoJogo.pergaminhoAberto = null;
}

function selecionarAlternativa(index) {
  estadoJogo.alternativaSelecionada = index;
  document.querySelectorAll(".alternativa-item").forEach((el, i) => {
    el.classList.toggle("selecionada", i === index);
  });
}

function romanizar(numero) {
  const romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  return romanos[numero - 1] || numero;
}

btnFechar.addEventListener("click", fecharPergaminho);

btnConfirmar.addEventListener("click", () => {
  const pergaminho = estadoJogo.pergaminhoAberto;
  if (!pergaminho) return;

  if (estadoJogo.alternativaSelecionada === null) {
    elFeedback.className = "feedback-msg erro";
    elFeedback.textContent = "Selecione uma alternativa antes de confirmar.";
    return;
  }

  estadoJogo.tentativasNoPergaminho++;
  const itens = document.querySelectorAll(".alternativa-item");

  if (estadoJogo.alternativaSelecionada === pergaminho.correta) {
    itens[pergaminho.correta].classList.add("correta");
    elFeedback.className = "feedback-msg sucesso";
    elFeedback.textContent = "Correto! O pergaminho seguinte foi desbloqueado.";
    elDica.textContent = "";
    btnConfirmar.disabled = true;
    soltarConfetes();

    setTimeout(() => {
      avancarProgresso();
      fecharPergaminho();
    }, 1200);

  } else {
    itens[estadoJogo.alternativaSelecionada].classList.add("incorreta");
    elFeedback.className = "feedback-msg erro";
    elFeedback.textContent = "Resposta incorreta. Tente novamente.";

    if (estadoJogo.tentativasNoPergaminho === 1) {
      estadoJogo.dicasUsadas++;
      elDica.textContent = `💡 Dica: ${pergaminho.dica}`;
    }
  }
});

function avancarProgresso() {
  if (estadoJogo.progressoAtual < estadoJogo.sequenciaEmbaralhada.length) {
    estadoJogo.progressoAtual++;
    atualizarMapaENavegar();
  } else {
    finalizarJogo();
  }
}

// ===================== CONFETES AO ACERTAR PERGUNTA =====================

function soltarConfetes() {
    const duracao = 1200;
    const fim = Date.now() + duracao;

    (function frame() {

        confetti({
            particleCount: 8,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.7 }
        });

        confetti({
            particleCount: 8,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.7 }
        });

        if (Date.now() < fim) {
            requestAnimationFrame(frame);
        }
    })();
}

// ===================== FINALIZAÇÃO DO JOGO =====================

function calcularPontuacao(tempoEmSegundos, dicasUsadas) {
  const PONTOS_BASE = 1000;
  const PENALIDADE_POR_DICA = 50;
  const PENALIDADE_POR_SEGUNDO = 1;

  let pontuacao = PONTOS_BASE
    - (dicasUsadas * PENALIDADE_POR_DICA)
    - (tempoEmSegundos * PENALIDADE_POR_SEGUNDO);

  return Math.max(pontuacao, 0);
}

async function finalizarJogo() {
  pararCronometro();
  estadoJogo.tempoFinal = Date.now();
  const tempoTotalSegundos = Math.floor((estadoJogo.tempoFinal - estadoJogo.tempoInicio) / 1000);
  const pontuacaoFinal = calcularPontuacao(tempoTotalSegundos, estadoJogo.dicasUsadas);

  document.getElementById("vitoria-nome").textContent = estadoJogo.nomeJogador;
  document.getElementById("vitoria-tempo").textContent = formatarTempo(tempoTotalSegundos);
  document.getElementById("vitoria-dicas").textContent = estadoJogo.dicasUsadas;
  document.getElementById("vitoria-pontuacao").textContent = pontuacaoFinal;

  const statusEnvio = document.getElementById("vitoria-status-envio");
  statusEnvio.textContent = "Salvando seu resultado no ranking...";

  mostrarTela("tela-vitoria");

  const resultado = await enviarResultadoRanking(
    estadoJogo.nomeJogador,
    pontuacaoFinal,
    tempoTotalSegundos
  );

  if (resultado.sucesso) {
    statusEnvio.textContent = "Resultado salvo no ranking com sucesso!";
  } else {
    statusEnvio.textContent = "Não foi possível salvar seu resultado no ranking.";
  }
}

// ===================== BOTÕES DE NAVEGAÇÃO FINAL =====================

document.getElementById("btn-ver-ranking-vitoria").addEventListener("click", () => {
  exibirTelaRanking();
});

document.getElementById("btn-jogar-novamente").addEventListener("click", () => {
  inputNome.value = "";
  mostrarTela("tela-nome");
});

document.getElementById("btn-voltar-inicio").addEventListener("click", () => {
  mostrarTela("tela-nome");
});