# Os Caminhos da Sabedoria — Jogo da Grécia Antiga

Jogo educativo de exploração filosófica em HTML, CSS e JavaScript puro, com ranking salvo em um banco de dados Postgres (via Supabase).

## Estrutura de arquivos

```
jogo-grecia/
├── index.html              Tela principal e estrutura de todas as telas
├── css/
│   └── style.css           Estilo visual (tema grego/mármore/pergaminho)
├── js/
│   ├── supabase-config.js  Credenciais de conexão com o Supabase
│   ├── pergaminhos.js      Dados dos 8 pergaminhos (narrativa, perguntas, dicas)
│   ├── mapa.js              Geração do mapa SVG e dos pontos clicáveis
│   ├── jogo.js              Lógica principal: telas, cronômetro, pontuação
│   └── ranking.js           Envio e listagem do ranking via Supabase
└── supabase-setup.sql      Script SQL para criar a tabela do ranking
```

## Passo a passo: configurar o Supabase

### 1. Criar a conta e o projeto

1. Acesse **https://supabase.com** e clique em "Start your project".
2. Crie uma conta (pode usar GitHub ou e-mail).
3. Clique em **"New Project"**.
4. Preencha:
   - **Name**: `jogo-grecia` (ou outro nome)
   - **Database Password**: crie uma senha forte e **guarde-a** (não é a chave usada no código, mas é importante)
   - **Region**: escolha a região mais próxima (ex: South America)
5. Clique em **"Create new project"** e aguarde alguns minutos enquanto o banco é provisionado.

### 2. Criar a tabela do ranking

1. No menu lateral do projeto, clique em **"SQL Editor"**.
2. Clique em **"New query"**.
3. Copie todo o conteúdo do arquivo `supabase-setup.sql` (incluído neste projeto) e cole no editor.
4. Clique em **"Run"** (ou Ctrl+Enter).
5. Você verá uma mensagem de sucesso. Isso cria a tabela `ranking` já com as permissões corretas.

Você pode confirmar que a tabela foi criada acessando **"Table Editor"** no menu lateral — a tabela `ranking` deve aparecer lá com as colunas `id`, `nome`, `pontuacao`, `tempo_segundos` e `criado_em`.

### 3. Obter a URL e a chave da API

1. No menu lateral, clique no ícone de engrenagem **"Project Settings"**.
2. Clique em **"API"**.
3. Copie os dois valores:
   - **Project URL** → algo como `https://xxxxxxxxxxxx.supabase.co`
   - **Project API keys → `anon` `public`** → uma chave longa começando com `eyJ...`

   ⚠️ **Nunca use a chave `service_role`** no front-end — ela tem permissões totais e deve ficar em segredo. Use sempre a `anon public`.

### 4. Colar as credenciais no projeto

Abra o arquivo `js/supabase-config.js` e substitua:

```javascript
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO";
const SUPABASE_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO";
```

pelos valores que você copiou no passo 3.

### 5. Rodar o jogo

Como o jogo faz requisições (para o Supabase), alguns navegadores bloqueiam isso se você simplesmente abrir o `index.html` com duplo clique (protocolo `file://`). O mais seguro é servir os arquivos por um servidor local simples:

**Opção A — usando Python (geralmente já instalado):**
```bash
cd jogo-grecia
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador.

**Opção B — usando a extensão "Live Server" do VS Code:**
Clique com o botão direito no `index.html` e escolha "Open with Live Server".

## Como o jogo funciona

1. **Tela de nome**: o jogador digita o nome (estilo Kahoot).
2. **Mapa**: 8 pontos representando locais da Grécia Antiga. Apenas o ponto do pergaminho atual está desbloqueado; os seguintes ficam acinzentados/bloqueados, e os já concluídos ficam marcados com ✓.
3. **Pergaminho (modal)**: ao clicar no ponto desbloqueado, abre a narrativa + pergunta de múltipla escolha.
   - Resposta certa → desbloqueia o próximo ponto automaticamente.
   - Resposta errada → mostra uma dica (na primeira tentativa errada) e permite tentar novamente, sem limite de tentativas.
4. **Vitória**: ao acertar o Pergaminho VIII, é exibido o tempo total, dicas usadas e a pontuação final, e o resultado é enviado automaticamente ao ranking no Supabase.
5. **Ranking**: lista todos os resultados salvos, ordenados por pontuação (maior primeiro) e, em caso de empate, por tempo (menor primeiro).

## Fórmula de pontuação

```
pontuação = 1000 − (dicas_usadas × 50) − (tempo_em_segundos × 1)
```

(nunca fica negativa; o mínimo é 0). Você pode ajustar os pesos diretamente na função `calcularPontuacao` em `js/jogo.js`.

## Personalizações futuras

- **Imagem de mapa real**: hoje o mapa é desenhado em SVG (formas simples representando colinas, templo e mar). Se você tiver uma imagem própria da Grécia Antiga, posso adaptar o `mapa.js` para usar uma imagem de fundo (`<image>` dentro do SVG, ou um `<div>` com `background-image`) e reposicionar os pontos sobre ela.
- **Mais perguntas/pergaminhos**: basta adicionar novos objetos no array `PERGAMINHOS` em `pergaminhos.js` e uma posição correspondente em `POSICOES_PONTOS` no `mapa.js`.
