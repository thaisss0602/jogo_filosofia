// ===================== DADOS DOS PERGAMINHOS =====================
// Cada pergaminho tem: id, local no mapa, narrativa, pergunta,
// alternativas, índice da resposta correta e uma dica.

const PERGAMINHOS = [
  {
    id: 1,
    local: "Entrada de Atenas",
    narrativa: "Bem-vindo, historiador. Você acaba de chegar a Atenas, berço da filosofia. Foi aqui que começaram a buscar explicações para o mundo usando a razão.",
    pergunta: "O que os filósofos passaram a utilizar para explicar o mundo, em vez de apenas aceitar histórias e mitos?",
    alternativas: ["A força física", "A razão", "A sorte", "A magia"],
    correta: 1,
    dica: "Pense no que diferencia a filosofia da mitologia: não é força, sorte ou magia, mas uma capacidade de pensar e argumentar."
  },
  {
    id: 2,
    local: "A Praça (Ágora)",
    narrativa: 'Na praça caminhava Sócrates, um dos filósofos mais famosos da Grécia. Ele costumava dizer: "Só sei que nada sei."',
    pergunta: "Segundo Sócrates, qual é o primeiro passo para aprender algo novo?",
    alternativas: [
      "Acreditar que já sabe tudo",
      "Ignorar as dúvidas",
      "Reconhecer os próprios limites e a própria ignorância",
      "Decorar respostas"
    ],
    correta: 2,
    dica: 'Relembre a frase de Sócrates: "Só sei que nada sei." Isso é sobre admitir algo, não sobre saber tudo.'
  },
  {
    id: 3,
    local: "O Templo",
    narrativa: "Os gregos acreditavam em muitos deuses, mas os filósofos buscavam compreender algo além das histórias mitológicas. Platão, aluno de Sócrates, acreditava que existe um mundo perfeito das ideias.",
    pergunta: "Segundo Platão, o mundo que vemos é:",
    alternativas: [
      "O único mundo que existe",
      "Uma cópia imperfeita das ideias perfeitas",
      "Mais perfeito que o mundo das ideias",
      "Um mundo criado pelos deuses"
    ],
    correta: 1,
    dica: "Para Platão, existe um mundo das ideias perfeito, e o mundo que vemos é apenas um reflexo dele — não o original."
  },
  {
    id: 4,
    local: "A Academia",
    narrativa: "Platão fundou uma escola, onde seus alunos estudavam matemática, política e filosofia. Ele acreditava que a educação ajudava as pessoas a enxergar a verdade.",
    pergunta: "Qual era o nome da escola fundada por Platão?",
    alternativas: ["Liceu", "Biblioteca", "Academia", "Ateneu"],
    correta: 2,
    dica: "O nome dessa escola ainda é usado hoje para se referir a instituições de ensino e estudo."
  },
  {
    id: 5,
    local: "O Jardim de Observação",
    narrativa: "Um dos alunos mais famosos de Platão foi Aristóteles. Ele observou animais, plantas, estrelas e o comportamento humano.",
    pergunta: "Além do pensamento, Aristóteles acreditava que o conhecimento deveria vir da:",
    alternativas: ["Imaginação", "Observação do mundo real", "Mitologia", "Sorte"],
    correta: 1,
    dica: "Pense no que Aristóteles fazia: observava animais, plantas e estrelas. Isso é uma forma de obter conhecimento."
  },
  {
    id: 6,
    local: "O Conselho da Cidade",
    narrativa: "Aristóteles estudou as formas de governo e classificou diferentes maneiras de organizar uma cidade.",
    pergunta: "Ao analisar os governos, Aristóteles procurava identificar quais deles:",
    alternativas: [
      "Eram mais ricos",
      "Tinham mais soldados",
      "Buscavam o bem comum",
      "Possuíam mais templos"
    ],
    correta: 2,
    dica: "Aristóteles não estava interessado em riqueza, exército ou templos, mas no propósito de um bom governo."
  },
  {
    id: 7,
    local: "O Centro de Debates",
    narrativa: "Os filósofos gregos acreditavam que uma cidade forte dependia de cidadãos que pensassem, questionassem e participassem da vida pública. Por isso, Atenas ficou conhecida como um importante centro de debates e conhecimento.",
    pergunta: "Segundo os filósofos gregos, uma cidade forte dependia de cidadãos que:",
    alternativas: [
      "Apenas obedecessem às leis",
      "Pensassem, questionassem e participassem da vida pública",
      "Ficassem afastados da política",
      "Apenas trabalhassem"
    ],
    correta: 1,
    dica: "A resposta está na ideia de participação ativa, não em obediência passiva ou afastamento."
  },
  {
    id: 8,
    local: "O Tesouro Final",
    narrativa: "Parabéns, historiador! Você percorreu os caminhos dos grandes pensadores da Grécia Antiga. Aprendeu sobre Sócrates e sua humildade diante do conhecimento, sobre Platão e o mundo das ideias, e sobre Aristóteles e seus estudos sobre a natureza e as formas de governo. Você descobriu o maior tesouro de todos.",
    pergunta: "Qual foi o maior tesouro descoberto durante esta jornada?",
    alternativas: ["Ouro e prata", "Poder político", "Sabedoria e conhecimento", "Fama e riqueza"],
    correta: 2,
    dica: "Pense em tudo que você aprendeu nesta jornada: não é algo material, mas algo que carregamos na mente."
  }
];
