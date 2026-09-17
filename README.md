# Mundo Léo — Protótipo do jogo de mesada e responsabilidades

Protótipo funcional de um app gamificado para crianças, feito com **React + TypeScript + Vite + Tailwind CSS v4**. Roda 100% no navegador, sem backend, com dados salvos em `localStorage`.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente `http://localhost:5173`). Para testar no celular Android pela rede local, use `npm run dev -- --host` e acesse o IP mostrado no terminal pelo navegador do celular (o computador e o celular precisam estar na mesma rede Wi-Fi).

## O que foi implementado

- **Tela inicial (criança)**: personagem, nível, barra de XP, moedas, mesada simulada e missões do dia com botão "Completei".
- **Animação de recompensa**: confete + números de XP/moedas/dinheiro subindo, e tela especial de "Subiu de nível".
- **Sistema de XP e nível**: 10 níveis com curva progressiva (`src/utils/levels.ts`).
- **Missões**: hábitos, responsabilidades e missões especiais, com frequência diária/semanal.
- **Loja**: 6 categorias (roupas, cabelos, acessórios, casa, pet, especiais), compra com moedas, mensagem quando faltam moedas.
- **Personagem**: avatar em SVG customizável (tom de pele, estilo de cabelo grátis; roupas/cabelo/acessórios desbloqueados na loja).
- **Pet**: escolha entre cachorro, gato ou coelho; indicadores de felicidade, fome, energia e higiene; ações de alimentar, brincar, banho e dormir.
- **Minha Casa**: quarto simples que exibe os itens de decoração comprados.
- **Desafios e Conquistas**: desafios com barra de progresso e conquistas bloqueadas/desbloqueadas.
- **Área dos pais**: painel separado (mais neutro) com resumo, meta mensal, cadastro de novas tarefas, lista de pendentes/concluídas e histórico.
- **Persistência**: tudo salvo em `localStorage`; há um botão "Resetar dados" na área dos pais para voltar ao estado inicial de testes.
- **Dados de demonstração**: criança fictícia "Léo", 8 anos, nível 3, com o pet "Bolt".

## Arquivos principais

```
src/
  types/index.ts          → todos os tipos (Task, Child, Pet, ShopItem, etc.)
  data/initialData.ts     → dados fictícios iniciais (Léo, tarefas, loja, desafios)
  services/storage.ts     → leitura/escrita no localStorage
  utils/levels.ts         → cálculo de nível a partir do XP
  hooks/useGameState.ts   → estado central do jogo e todas as ações (completar missão, comprar item, cuidar do pet, etc.)
  components/             → peças reutilizáveis (Character, TaskCard, XPBar, PetCard, ShopItemCard, RewardAnimation, BottomNavigation...)
  pages/                  → telas (Home, Missions, Pet, House, Shop, Character, ParentDashboard)
  App.tsx                 → navegação entre telas
```

## Como testar o roteiro completo

1. Abra o app → veja o personagem, nível 3 e as missões do Léo.
2. Toque em "Completei" numa missão → animação de recompensa, XP e moedas sobem.
3. Complete missões suficientes para subir de nível → tela "Subiu de nível!".
4. Vá em Loja → compre um item de roupa ou acessório (se tiver moedas).
5. Vá em Perfil → equipe o item comprado no personagem.
6. Vá em Casa → veja os itens de decoração comprados.
7. Vá em Pet → alimente, brinque, dê banho ou deixe o pet dormir.
8. Volte para Início → veja Desafios e Conquistas na aba Missões.
9. Toque em "Área dos pais" → veja o resumo, cadastre uma nova tarefa e volte para a área da criança para vê-la aparecer.
10. Atualize a página (F5): tudo continua salvo. Use "Resetar dados" na área dos pais para recomeçar.

## Atualizações da Fase 4 — Backend e sincronização na nuvem

Agora dá pra sincronizar os dados da família entre aparelhos diferentes (o celular dos pais e o da criança, por exemplo) usando uma conta gratuita. Como não é possível eu hospedar um servidor permanente, usei o **Firebase** (do Google) — autenticação por e-mail/senha e banco de dados em tempo real (Firestore), tudo no plano gratuito.

**Como funciona:**
- Na "Área dos pais", uma nova seção "☁️ Sincronizar entre aparelhos" permite criar uma conta ou entrar numa já existente.
- Ao entrar com a mesma conta em outro aparelho, os dados da família (todos os perfis de criança, progresso, tarefas, etc.) aparecem sincronizados automaticamente — mudanças em um aparelho refletem no outro em tempo real.
- Sem login, o app continua funcionando 100% offline, salvando localmente, como antes.
- **Importante**: nessa versão, os dois aparelhos usam a **mesma conta/senha** (é o jeito mais simples de ter sincronização de verdade sem construir um sistema de permissões separado por criança). Ou seja, se a criança tiver o próprio celular, ela entra com o mesmo e-mail/senha que os pais usam — não é uma conta "infantil" separada. Um sistema de contas por perfil (pai/mãe/criança com permissões diferentes) é possível depois, mas é um projeto à parte.

### Como configurar o Firebase (obrigatório para a sincronização funcionar)

Sem isso, a seção de sincronização mostra uma mensagem dizendo que ainda não foi configurado — o resto do app funciona normalmente.

1. Acesse **console.firebase.google.com** e entre com uma conta Google (a mesma do dia a dia serve).
2. Clique em **Adicionar projeto**, dê um nome (ex: "mundo-leo"), pode desativar o Google Analytics (não é necessário), e crie.
3. Dentro do projeto, clique no ícone **`</>`** (Web) para registrar um app web. Dê um apelido (ex: "mundo-leo-web") e clique em registrar — **não** precisa marcar a opção de hospedagem.
4. Ele vai mostrar um bloco de código com um objeto `firebaseConfig = { apiKey: "...", authDomain: "...", ... }`. Copie esses valores.
5. Abra o arquivo `src/services/firebaseConfig.ts` no projeto e substitua os valores `COLE_AQUI_...` pelos que você copiou.
6. No menu lateral do Firebase, vá em **Build → Authentication** → aba **Sign-in method** → habilite **E-mail/senha**.
7. Ainda no menu lateral, vá em **Build → Firestore Database** → **Criar banco de dados** → escolha uma localização (qualquer uma próxima do Brasil, ex: `southamerica-east1`) → pode começar em modo de produção.
8. Dentro do Firestore, vá na aba **Regras** e substitua pelo conteúdo abaixo, depois clique em **Publicar**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /families/{familyId} {
         allow read, write: if request.auth != null && request.auth.uid == familyId;
       }
     }
   }
   ```
   Isso garante que cada família só consegue ler/escrever os próprios dados.
9. Salve o arquivo `firebaseConfig.ts`, rode `npm install` (se ainda não rodou) e `npm run build` (ou suba pro GitHub/StackBlitz como das outras vezes). Pronto — a sincronização já funciona.

## Atualizações da Fase 3 — Múltiplos perfis

- **Vários perfis de criança no mesmo aparelho**: dentro da área dos pais, um seletor no topo mostra todas as crianças cadastradas e permite trocar entre elas com um toque.
- **Adicionar nova criança**: botão "+ Criança" na área dos pais abre um formulário simples (nome e idade). O novo perfil começa do zero (nível 1, sem moedas) e já vem com as mesmas missões padrão, que os pais podem editar depois.
- **Progresso independente por criança**: cada perfil guarda separadamente XP, moedas, potes de dinheiro, tarefas, pet, desafios e conquistas.
- **Importante — sobre "cada criança no próprio celular"**: hoje tudo ainda é salvo só no navegador de um único aparelho (sem backend). Isso quer dizer que:
  - Se **um só celular** é usado pela família, os múltiplos perfis dessa fase resolvem bem: você troca entre os perfis dos filhos no mesmo aparelho.
  - Se a criança tem **o próprio celular**, o progresso dela nesse aparelho fica isolado — não sincroniza automaticamente com o celular dos pais. Isso só será possível de verdade na Fase 4 (backend + sincronização na nuvem), quando cada perfil poder ser acessado de qualquer aparelho com login.
- Progresso salvo antes dessa atualização continua funcionando (migração automática do formato de perfil único para o novo formato com múltiplos perfis).

## Atualizações da Fase 2 — Sistema financeiro (3 potes)

- **Potes de gastar/guardar/compartilhar**: toda vez que a criança ganha dinheiro numa missão, ele é dividido automaticamente entre os três potes, na proporção configurada pelos pais (padrão: 50% gastar, 40% guardar, 10% compartilhar).
- **Tela da criança**: mostra os três potes com o saldo de cada um, logo abaixo do cabeçalho.
- **Área dos pais**: nova seção para ajustar a porcentagem de cada pote (a soma precisa dar 100%) e definir metas opcionais de economia por pote.
- **Relatório semanal**: gráfico de barras simples mostrando quantas missões foram concluídas em cada um dos últimos 7 dias.
- Dados salvos antes dessa atualização continuam funcionando — ao abrir o app, ele migra automaticamente o progresso antigo para o novo formato com potes (o valor acumulado antigo vai inteiro para o pote "gastar").

## Atualizações da Fase 1

- **Editar e excluir tarefas**: na área dos pais, toque em qualquer tarefa da lista para abrir o formulário de edição já preenchido, ou use o botão "Excluir" ao lado dela.
- **Frequência "dias específicos" funcionando de verdade**: ao escolher essa opção no cadastro, os pais marcam em quais dias da semana a tarefa vale (ex: só terça e quinta). A tarefa só aparece na tela da criança nesses dias, e o card mostra os dias marcados.

## O que ainda é simulado (propositalmente, conforme pedido)

- Não há backend, autenticação nem múltiplos perfis — tudo roda no navegador de um único dispositivo.
- O valor em "dinheiro real" é apenas um contador; não há PIX, cartão ou integração bancária.
- A loja e o inventário não têm limite de estoque.

## Atualizações da Fase 5 — PWA e app Android (via Capacitor)

### PWA (instalável direto do navegador)

O app agora é uma **PWA de verdade**: funciona offline (service worker) e pode ser instalado na tela inicial do Android direto pelo Chrome, sem passar pela Play Store.

**Como testar:**
1. Rode `npm run build` e depois `npm run preview` (ou publique o `dist/` em qualquer lugar — Vercel, Netlify, GitHub Pages)
2. Abra o link no Chrome do Android
3. Vai aparecer um banner (ou o menu ⋮ → "Adicionar à tela inicial" / "Instalar app")
4. O ícone instalado abre em tela cheia, sem barra de endereço, como um app nativo

> Isso **não funciona dentro do preview do StackBlitz** (é uma limitação do iframe deles) — para testar de verdade, precisa publicar o `dist/` em algum lugar acessível, como a seção abaixo mostra com o GitHub Pages, ou qualquer outro serviço de hospedagem estática gratuito.

### App Android nativo (arquivo .apk) — sem precisar de PC

Adicionei o **Capacitor**, que empacota o app web dentro de um projeto Android nativo de verdade. Só que compilar isso normalmente exige Android Studio num computador — como você está usando só o celular, configurei o **GitHub Actions** pra compilar o APK na nuvem automaticamente. Veja o passo a passo completo mais abaixo, na seção "Como gerar o APK pelo celular".

O projeto Android já está pronto dentro da pasta `android/` — não precisa rodar `npx cap add android` de novo.

## Como gerar o APK pelo celular (sem PC)

1. Suba o projeto pro GitHub, do mesmo jeito que já fizemos antes (`git add . && git commit -m "..." && git push`). A pasta `.github/workflows/build-android.yml` já vai junto — é ela que ensina o GitHub a compilar o APK.
2. No navegador, acesse o repositório no GitHub (ex: `github.com/ceulinha/appgame`) e clique na aba **Actions**.
3. Você vai ver um workflow chamado **"Build APK Android"**. Se ele não rodar sozinho após o push, clique nele → **Run workflow** → **Run workflow** de novo pra confirmar.
4. Aguarde a compilação terminar (geralmente 3 a 6 minutos — dá pra sair da tela e voltar depois, ele continua rodando no servidor do GitHub).
5. Quando o círculo ficar verde (✓), clique no workflow concluído → role até **Artifacts**, no final da página → toque em **mundo-leo-apk** para baixar um `.zip` contendo o `app-debug.apk`.
6. No celular, extraia o `.zip` (o próprio gerenciador de arquivos do Android já faz isso, ou use o Termux: `unzip mundo-leo-apk.zip`).
7. Toque no arquivo `app-debug.apk` pra instalar. O Android vai avisar que é de "fonte desconhecida" — isso é esperado (é um app de teste, ainda não publicado na Play Store); toque em **Instalar mesmo assim**.
8. Pronto — o app abre como um aplicativo Android normal, com ícone na gaveta de apps.

> Esse é um **APK de debug**, ótimo pra testar. Pra publicar de verdade na Play Store futuramente, é preciso gerar uma versão "release" assinada digitalmente — isso fica pra quando você decidir seguir com a publicação oficial (é um processo à parte, com taxa única de US$ 25 da conta de desenvolvedor Google).

## Atualizações da Fase 6 — Conteúdo, eventos e evolução

- **Desafios da família**: novos desafios (seção "👨‍👩‍👧‍👦 Desafios da família" na aba Missões) que contam a soma de missões de **todos os perfis de criança juntos** — quando a meta é batida, todos ganham moedas de bônus.
- **Eventos sazonais**: quando um evento está ativo (ex: uma semana especial ou o período de Natal), aparece um banner na tela inicial e todas as missões concluídas nesse período rendem XP/moedas em dobro (ou o multiplicador configurado). Os eventos são definidos em `src/data/initialData.ts` (lista `SEASONAL_EVENTS`) — para criar um novo, basta adicionar um item com data de início/fim.
- **Educação financeira**: um card com "dica financeira do dia" aparece na tela inicial, com uma frase diferente a cada dia sobre os potes, poupança e consumo consciente (lista em `FINANCIAL_TIPS`, fácil de expandir).
- **Evolução do espaço (Quarto → Casa → Mundo)**: a aba "Casa" muda de nome, cor de fundo e mensagem conforme o nível da criança sobe — Quarto (níveis 1-3), Casa (4-6) e Mundo (7-10), com uma dica mostrando em que nível a próxima evolução acontece.

Com isso, o roadmap original de 6 fases está completo! O app já cobre: mecânica de jogo completa, sistema financeiro com potes, múltiplos perfis, sincronização na nuvem, instalação como PWA/Android, e conteúdo de engajamento (desafios, eventos, educação financeira, evolução visual).

## Próximos passos sugeridos (além do roadmap original)

- Publicação oficial na Play Store (assinatura release, ficha da loja, política de privacidade).
- Otimizar o tamanho do app (dividir o código em partes menores/"code splitting") para carregar mais rápido.
- Desafios em família, eventos sazonais, educação financeira, evolução visual do quarto → casa → mundo — Fase 6.
- Contas separadas por papel (pai/mãe/criança com permissões diferentes), notificações push.
