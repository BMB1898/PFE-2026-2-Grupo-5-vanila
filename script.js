// PLAYMAKERZ · script compartilhado por todas as páginas

// Organização:
//   1. Header que muda ao rolar a página
//   2. Menu hambúrguer (celular)
//   3. Submenu "Agendar"
//   4. Animação de entrada das seções
//   5. Perguntas frequentes
//   6. Calendário de agendamento
//   7. Formulário de agendamento

// Número de WhatsApp da empresa (formato internacional, só dígitos).
// Se mudar o número, troque também nos links wa.me do HTML
// (botões "Fale com a gente" de planos.html e "Confirmar pelo WhatsApp"
// das páginas de agendamento).
const WHATSAPP_NUMBER = "5521972657266";

// Monta o link do WhatsApp com uma mensagem já escrita.
// encodeURIComponent troca espaços e acentos por códigos que podem ir na URL.
function criaLinkWhatsapp(mensagem) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
}

// 1. HEADER QUE MUDA AO ROLAR A PÁGINA
// Quando a página desce mais de 10px, o header ganha a classe
// "scrolled", que no CSS deixa o fundo escuro.
const header = document.querySelector(".site-header");

function atualizaHeader() {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

if (header) {
  atualizaHeader();
  // passive: true avisa o navegador que não vamos usar preventDefault(),
  // o que deixa a rolagem mais leve
  window.addEventListener("scroll", atualizaHeader, { passive: true });
}

// 2. MENU HAMBÚRGUER (CELULAR)
// Abre e fecha o menu no clique do botão. Também fecha quando
// a pessoa clica fora do menu ou aperta ESC.
const botaoMenu = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-links");

function fechaMenu() {
  document.body.classList.remove("nav-open");
  botaoMenu.setAttribute("aria-expanded", false);
  botaoMenu.setAttribute("aria-label", "Abrir menu");
}

function alternaMenu() {
  // toggle adiciona a classe se ela não existe (e devolve true)
  // ou remove se ela já existe (e devolve false)
  const estaAberto = document.body.classList.toggle("nav-open");
  botaoMenu.setAttribute("aria-expanded", estaAberto);
  botaoMenu.setAttribute(
    "aria-label",
    estaAberto ? "Fechar menu" : "Abrir menu",
  );
}

if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", alternaMenu);

  // clique fora: se não foi no menu nem no botão, fecha
  document.addEventListener("click", (evento) => {
    if (!menu.contains(evento.target) && !botaoMenu.contains(evento.target)) {
      fechaMenu();
    }
  });

  // clicar em um link do menu também fecha
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fechaMenu);
  });
}

// 3. SUBMENU "AGENDAR"
// No computador, abre no clique do botão "Agendar" (e também ao
// passar o mouse, pelo CSS). Fecha ao clicar fora ou com ESC.
const itemAgendar = document.querySelector(".has-dropdown");
const botaoAgendar = document.querySelector(".dropdown-toggle");

function fechaSubmenu() {
  itemAgendar.classList.remove("open");
  botaoAgendar.setAttribute("aria-expanded", false);
}

function alternaSubmenu() {
  const estaAberto = itemAgendar.classList.toggle("open");
  botaoAgendar.setAttribute("aria-expanded", estaAberto);
}

if (itemAgendar && botaoAgendar) {
  botaoAgendar.addEventListener("click", alternaSubmenu);

  document.addEventListener("click", (evento) => {
    if (!itemAgendar.contains(evento.target)) {
      fechaSubmenu();
    }
  });
}

// ESC fecha o menu do celular e o submenu
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    if (botaoMenu && menu) fechaMenu();
    if (itemAgendar && botaoAgendar) fechaSubmenu();
  }
});

// 4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
// Os elementos com a classe "reveal" começam invisíveis (CSS).
// A cada rolagem, quem já entrou na tela ganha a classe "visible".
const elementosReveal = document.querySelectorAll(".reveal");

function mostraElementosVisiveis() {
  elementosReveal.forEach((elemento) => {
    // posição do topo do elemento em relação ao topo da janela
    const topo = elemento.getBoundingClientRect().top;
    if (topo < window.innerHeight - 40) {
      elemento.classList.add("visible");
    }
  });
}

if (elementosReveal.length > 0) {
  mostraElementosVisiveis();
  window.addEventListener("scroll", mostraElementosVisiveis, { passive: true });
  window.addEventListener("resize", mostraElementosVisiveis);
}

// 5. PERGUNTAS FREQUENTES
// Delegação de eventos: um único listener na lista (dl) descobre
// qual pergunta foi clicada. Só uma resposta fica aberta por vez.
// A abertura em si é feita pelo CSS com a classe "open".
document.querySelectorAll(".faq-list").forEach((lista) => {
  lista.addEventListener("click", (evento) => {
    // closest sobe a partir do elemento clicado até achar o botão da pergunta
    const botao = evento.target.closest(".faq-q");
    if (!botao) return;

    const item = botao.closest(".faq-item");
    const estavaAberto = item.classList.contains("open");

    // fecha todas
    lista.querySelectorAll(".faq-item").forEach((outroItem) => {
      outroItem.classList.remove("open");
      outroItem.querySelector(".faq-q").setAttribute("aria-expanded", false);
    });

    // e abre a clicada, se ela estava fechada
    if (!estavaAberto) {
      item.classList.add("open");
      botao.setAttribute("aria-expanded", true);
    }
  });
});

// 6. CALENDÁRIO DE AGENDAMENTO
// Monta a tabela do mês, marca os dias com vaga e lista os
// horários do dia escolhido como inputs radio.
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_DA_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// Horários de exemplo de cada marca (objeto com arrays).
// Domingo fechado; sábado só de manhã.
const HORARIOS = {
  "One-to-One": {
    semana: [
      "07:00",
      "08:30",
      "10:00",
      "11:30",
      "13:00",
      "14:30",
      "17:00",
      "18:30",
    ],
    sabado: ["08:00", "09:30", "11:00"],
  },
  PKZ: {
    semana: ["14:00", "15:30", "17:00", "18:30"],
    sabado: ["09:00", "10:30"],
  },
};

const calendario = document.querySelector(".calendar");
// a marca vem do atributo data-brand do <body> de cada página de agendamento
const marca = document.body.getAttribute("data-brand") || "One-to-One";

// Hoje à meia-noite, e o último dia que pode ser agendado (60 dias depois)
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);
const ultimoDia = new Date(hoje);
ultimoDia.setDate(ultimoDia.getDate() + 60);

// Estado do calendário: o mês que está na tela e o dia escolhido
let mesNaTela = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
let dataSelecionada = null;

// Devolve os horários livres de um dia (array de strings)
function horariosDoDia(data) {
  const diaDaSemana = data.getDay();
  if (diaDaSemana === 0) return []; // domingo

  const lista =
    diaDaSemana === 6 ? HORARIOS[marca].sabado : HORARIOS[marca].semana;

  // Simula alguns horários já ocupados, sempre iguais para a mesma data
  const semente = data.getDate() * 7 + data.getMonth() * 3 + marca.length;
  return lista.filter((horario, i) => (semente + i * 5) % 4 !== 0);
}

// O dia aceita agendamento? (a partir de amanhã, até o último dia, e com horário livre)
function diaDisponivel(data) {
  return data > hoje && data <= ultimoDia && horariosDoDia(data).length > 0;
}

function primeiroDiaDisponivel() {
  const data = new Date(hoje);
  while (data <= ultimoDia) {
    if (diaDisponivel(data)) return new Date(data);
    data.setDate(data.getDate() + 1);
  }
  return null;
}

// Data no formato AAAA-MM-DD, guardada no input escondido do formulário
function formataData(data) {
  const doisDigitos = (numero) => String(numero).padStart(2, "0");
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

// Monta a tabela do mês: 6 linhas (semanas) x 7 colunas (dias)
function desenhaMes() {
  const ano = mesNaTela.getFullYear();
  const mes = mesNaTela.getMonth();

  calendario.querySelector("[data-cal-title]").textContent =
    `${MESES[mes]} ${ano}`;
  calendario.querySelector(".prev").disabled =
    ano === hoje.getFullYear() && mes === hoje.getMonth();
  calendario.querySelector(".next").disabled =
    new Date(ano, mes + 1, 1) > ultimoDia;

  // começa no domingo da semana em que o mês começa
  const inicio = new Date(ano, mes, 1 - new Date(ano, mes, 1).getDay());
  const corpoTabela = calendario.querySelector("[data-cal-days]");
  corpoTabela.textContent = ""; // limpa o mês anterior

  for (let semana = 0; semana < 6; semana++) {
    const linha = document.createElement("tr");

    for (let dia = 0; dia < 7; dia++) {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + semana * 7 + dia);

      const botao = document.createElement("button");
      botao.type = "button";
      botao.classList.add("cal-day");
      botao.textContent = data.getDate();

      const doMes = data.getMonth() === mes;
      if (!doMes) botao.classList.add("muted");
      if (data.getTime() === hoje.getTime()) botao.classList.add("today");

      if (!doMes || !diaDisponivel(data)) {
        botao.disabled = true;
      } else {
        botao.setAttribute("aria-label", `${data.getDate()} de ${MESES[mes]}`);
        botao.addEventListener("click", () => selecionaData(data));
      }

      if (
        doMes &&
        dataSelecionada &&
        data.getTime() === dataSelecionada.getTime()
      ) {
        botao.classList.add("selected");
        botao.setAttribute("aria-pressed", true);
      }

      const celula = document.createElement("td");
      celula.append(botao);
      linha.append(celula);
    }

    corpoTabela.append(linha);
  }
}

// Mostra o resumo do dia escolhido e os horários como inputs radio
function desenhaHorarios() {
  const resumo = calendario.querySelector(".cal-selected");
  const areaHorarios = calendario.querySelector(".slots");
  const contador = calendario.querySelector("[data-slots-count]");
  areaHorarios.textContent = "";

  if (!dataSelecionada) {
    resumo.hidden = true;
    contador.textContent = "";
    const aviso = document.createElement("p");
    aviso.classList.add("slots-empty");
    aviso.textContent = "Selecione uma data disponível.";
    areaHorarios.append(aviso);
    return;
  }

  const horarios = horariosDoDia(dataSelecionada);
  const daManha = horarios.filter(
    (horario) => Number(horario.slice(0, 2)) < 12,
  ).length;

  let periodo = "Manhã e tarde";
  if (daManha === horarios.length) periodo = "Manhã";
  if (daManha === 0) periodo = "Tarde";

  resumo.hidden = false;
  resumo.querySelector(".cal-selected-day").textContent =
    `${dataSelecionada.getDate()} de ${MESES[dataSelecionada.getMonth()]}`;
  resumo.querySelector(".cal-selected-info").textContent =
    `${DIAS_DA_SEMANA[dataSelecionada.getDay()]} · ${periodo}`;
  resumo.querySelector(".pill").textContent =
    `${horarios.length} ${horarios.length === 1 ? "horário" : "horários"}`;
  contador.textContent = `${horarios.length} ${horarios.length === 1 ? "opção" : "opções"}`;

  // forEach: cria um <label> com um radio dentro para cada horário
  horarios.forEach((horario) => {
    const opcao = document.createElement("label");
    opcao.classList.add("slot");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "horario";
    radio.value = horario;
    radio.required = true;

    const texto = document.createElement("span");
    texto.textContent = horario;

    opcao.append(radio, texto);
    areaHorarios.append(opcao);
  });
}

function selecionaData(data) {
  dataSelecionada = new Date(data);
  calendario.querySelector('input[name="data"]').value =
    formataData(dataSelecionada);
  desenhaMes();
  desenhaHorarios();
}

// Volta o calendário para o primeiro dia com vaga
function reiniciaCalendario() {
  const primeiro = primeiroDiaDisponivel();
  if (primeiro) {
    mesNaTela = new Date(primeiro.getFullYear(), primeiro.getMonth(), 1);
    selecionaData(primeiro);
  } else {
    dataSelecionada = null;
    desenhaMes();
    desenhaHorarios();
  }
}

if (calendario) {
  calendario.querySelector(".prev").addEventListener("click", () => {
    mesNaTela.setMonth(mesNaTela.getMonth() - 1);
    desenhaMes();
  });

  calendario.querySelector(".next").addEventListener("click", () => {
    mesNaTela.setMonth(mesNaTela.getMonth() + 1);
    desenhaMes();
  });

  reiniciaCalendario();
}

// 7. FORMULÁRIO DE AGENDAMENTO
// A validação básica é do próprio HTML (required e pattern).
// O JavaScript completa com uma regex para o nome, formata o
// telefone e, no envio, monta a mensagem para o WhatsApp.
const formulario = document.querySelector('form[data-form="agendar"]');

// Nome: só letras (com acento) e espaços
const REGEX_NOME = /^[A-Za-zÀ-ÿ\s]+$/;

// Formata o telefone enquanto a pessoa digita:
// celular (11 dígitos) → (21) 90000-0000 · fixo (10 dígitos) → (21) 3333-4444
function formataTelefone(evento) {
  const campo = evento.target;
  const digitos = campo.value.replace(/\D/g, "").slice(0, 11); // \D = tudo que não é dígito

  // o hífen fica depois do 5º número no celular e depois do 4º no fixo
  const corte = digitos.length === 11 ? 7 : 6;

  let formatado = digitos;
  if (digitos.length > 2) {
    formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  if (digitos.length > corte) {
    formatado = `(${digitos.slice(0, 2)}) ${digitos.slice(2, corte)}-${digitos.slice(corte)}`;
  }
  campo.value = formatado;
}

// Mostra (ou apaga) a mensagem de erro do formulário
function mostraErro(texto) {
  formulario.querySelector(".erro").textContent = texto;
}

if (formulario) {
  const pagina = formulario.closest(".schedule");
  const confirmacao = document.getElementById("agendar-ok");

  formulario.querySelectorAll('input[type="tel"]').forEach((campo) => {
    campo.addEventListener("input", formataTelefone);
  });

  // apaga a mensagem de erro quando a pessoa volta a digitar
  formulario.addEventListener("input", () => mostraErro(""));

  // O evento submit só dispara depois que o navegador validou os campos
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // não recarrega a página

    // FormData lê todos os campos pelo atributo name e vira um objeto
    const dados = Object.fromEntries(new FormData(formulario));

    // regras extras com regex
    if (!REGEX_NOME.test(dados.nome)) {
      mostraErro("O nome deve ter só letras e espaços.");
      formulario.querySelector("#ag-nome").focus();
      return;
    }
    if (dados.atleta !== undefined && !REGEX_NOME.test(dados.atleta)) {
      mostraErro("O nome do atleta deve ter só letras e espaços.");
      formulario.querySelector("#ag-atleta").focus();
      return;
    }

    const servico = formulario.getAttribute("data-service");
    const dataTexto =
      `${DIAS_DA_SEMANA[dataSelecionada.getDay()]}, ${dataSelecionada.getDate()} de ${MESES[dataSelecionada.getMonth()]}`.toLowerCase();
    const doAtleta = dados.atleta ? ` do(a) atleta ${dados.atleta.trim()}` : "";
    const mensagem = `Olá! Sou ${dados.nome.trim()} e gostaria de agendar ${servico}${doAtleta} no ${marca} para ${dataTexto}, às ${dados.horario}.`;

    confirmacao.querySelector("[data-summary]").textContent =
      `${marca} · ${dataTexto} · ${dados.horario}`;
    confirmacao.querySelector("[data-whatsapp-confirm]").href =
      criaLinkWhatsapp(mensagem);
    pagina.classList.add("sent");
  });

  // "Fazer outro agendamento": limpa o formulário e mostra de novo
  confirmacao
    .querySelector("[data-reset-form]")
    .addEventListener("click", () => {
      pagina.classList.remove("sent");
      formulario.reset();
      mostraErro("");
      reiniciaCalendario();
      formulario.querySelector("input").focus();
    });
}