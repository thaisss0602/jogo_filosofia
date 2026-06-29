// ===================== MÓDULO DE RANKING (SUPABASE + REALTIME) =====================

const NOME_TABELA_RANKING = "ranking";
let canalRealtime = null; // guarda a inscrição do canal para poder cancelar depois

// ===================== INSERIR RESULTADO =====================

async function enviarResultadoRanking(nome, pontuacao, tempoEmSegundos) {
  try {
    const { error } = await supabaseClient
      .from(NOME_TABELA_RANKING)
      .insert([{ nome, pontuacao, tempo_segundos: tempoEmSegundos }]);

    if (error) {
      console.error("Erro ao enviar resultado:", error);
      return { sucesso: false, erro: error.message };
    }
    return { sucesso: true };
  } catch (e) {
    console.error("Erro inesperado ao enviar resultado:", e);
    return { sucesso: false, erro: "Falha de conexão com o servidor." };
  }
}

// ===================== BUSCAR RANKING =====================

async function buscarRanking() {
  try {
    const { data, error } = await supabaseClient
      .from(NOME_TABELA_RANKING)
      .select("nome, pontuacao, tempo_segundos, criado_em")
      .order("pontuacao", { ascending: false })
      .order("tempo_segundos", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Erro ao buscar ranking:", error);
      return { sucesso: false, erro: error.message };
    }
    return { sucesso: true, dados: data };
  } catch (e) {
    console.error("Erro inesperado ao buscar ranking:", e);
    return { sucesso: false, erro: "Falha de conexão com o servidor." };
  }
}

// ===================== RENDERIZAR TABELA =====================

async function renderizarTabelaRanking() {
  const carregando = document.getElementById("ranking-carregando");
  const erroDiv = document.getElementById("ranking-erro");
  const tabela = document.getElementById("tabela-ranking");
  const corpo = document.getElementById("ranking-corpo");

  carregando.style.display = "block";
  erroDiv.style.display = "none";
  tabela.style.display = "none";
  corpo.innerHTML = "";

  const resultado = await buscarRanking();

  carregando.style.display = "none";

  if (!resultado.sucesso) {
    erroDiv.style.display = "block";
    erroDiv.textContent = "Não foi possível carregar o ranking. Verifique a configuração do Supabase.";
    return;
  }

  if (!resultado.dados || resultado.dados.length === 0) {
    erroDiv.style.display = "block";
    erroDiv.classList.remove("erro-msg");
    erroDiv.textContent = "Ainda não há jogadores no ranking. Seja o primeiro!";
    return;
  }

  resultado.dados.forEach((registro, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${index + 1}</td>
      <td>${escaparHTML(registro.nome)}</td>
      <td>${registro.pontuacao}</td>
      <td>${formatarTempo(registro.tempo_segundos)}</td>
      <td>${formatarData(registro.criado_em)}</td>
    `;
    corpo.appendChild(linha);
  });

  tabela.style.display = "table";
}

// ===================== REALTIME =====================

function iniciarRealtimeRanking() {
  // Cancela qualquer inscrição anterior para evitar duplicatas
  pararRealtimeRanking();

  canalRealtime = supabaseClient
    .channel("ranking-ao-vivo")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: NOME_TABELA_RANKING },
      () => {
        // Quando qualquer novo resultado for inserido no banco por qualquer jogador,
        // rebusca e rerenderiza a tabela inteira (garante ordenação correta)
        renderizarTabelaRanking();
      }
    )
    .subscribe();
}

function pararRealtimeRanking() {
  if (canalRealtime) {
    supabaseClient.removeChannel(canalRealtime);
    canalRealtime = null;
  }
}

// ===================== EXIBIR TELA DE RANKING =====================

async function exibirTelaRanking() {
  mostrarTela("tela-ranking");
  await renderizarTabelaRanking();
  iniciarRealtimeRanking(); // começa a escutar atualizações em tempo real
}

// Para o realtime quando o usuário sai da tela de ranking
// (qualquer botão que leve para outra tela vai chamar mostrarTela,
// então monitoramos cliques nos botões de saída do ranking)
document.getElementById("btn-voltar-inicio").addEventListener("click", () => {
  pararRealtimeRanking();
});

// ===================== UTILITÁRIOS =====================

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60).toString().padStart(2, "0");
  const seg = Math.floor(segundos % 60).toString().padStart(2, "0");
  return `${min}:${seg}`;
}

function formatarData(isoString) {
  if (!isoString) return "-";
  const data = new Date(isoString);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}