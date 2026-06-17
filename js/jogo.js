// ===================== ESTADO DO JOGO =====================

const estadoJogo = {
  nomeJogador: "",
  progressoAtual: 1,        // id do próximo pergaminho a ser resolvido
  dicasUsadas: 0,
  pergaminhoAberto: null,   // objeto do pergaminho atualmente aberto
  alternativaSelecionada: null,
  tentativasNoPergaminho: 0,
  tempoInicio: null,
  tempoFinal: null,
  cronometroInterval: null
};

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
    Math.min(estadoJogo.progressoAtual, PERGAMINHOS.length);

  renderizarMapa(estadoJogo.progressoAtual, abrirPergaminho);
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

function abrirPergaminho(id) {
  const pergaminho = PERGAMINHOS.find((p) => p.id === id);
  if (!pergaminho) return;

  estadoJogo.pergaminhoAberto = pergaminho;
  estadoJogo.alternativaSelecionada = null;
  estadoJogo.tentativasNoPergaminho = 0;

  elTitulo.textContent = `Pergaminho ${romanizar(pergaminho.id)}`;
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
    // Resposta correta
    itens[pergaminho.correta].classList.add("correta");
    elFeedback.className = "feedback-msg sucesso";
    elFeedback.textContent = "Correto! O pergaminho seguinte foi desbloqueado.";
    elDica.textContent = "";
    btnConfirmar.disabled = true;

    setTimeout(() => {
      avancarProgresso();
      fecharPergaminho();
    }, 1200);

  } else {
    // Resposta incorreta
    itens[estadoJogo.alternativaSelecionada].classList.add("incorreta");
    elFeedback.className = "feedback-msg erro";
    elFeedback.textContent = "Resposta incorreta. Tente novamente.";

    if (estadoJogo.tentativasNoPergaminho === 1) {
      // Mostra dica apenas após a primeira tentativa errada
      estadoJogo.dicasUsadas++;
      elDica.textContent = `💡 Dica: ${pergaminho.dica}`;
    }
  }
});

function avancarProgresso() {
  if (estadoJogo.progressoAtual < PERGAMINHOS.length) {
    estadoJogo.progressoAtual++;
    atualizarMapaENavegar();
  } else {
    finalizarJogo();
  }
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
