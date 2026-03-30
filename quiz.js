(function () {
  "use strict";

  /**
   * Funil tipo Fitfy (objetivo, corpo, rotina, hábitos…).
   * Ajuste textos aqui se tiver o quiz oficial exportado do link.
   */
  var QUIZ_STEPS = [
    {
      id: "goal",
      question: "Qual é o seu principal objetivo hoje?",
      options: [
        { text: "Perder peso com mais leveza", value: "lose_weight" },
        { text: "Definir o corpo e ganhar disposição", value: "tone_energy" },
        { text: "Manter o peso com hábitos melhores", value: "maintain" },
        { text: "Só quero me organizar e criar rotina", value: "routine" },
      ],
    },
    {
      id: "body_focus",
      question: "Qual área você gostaria de trabalhar mais?",
      options: [
        { text: "Barriga e cintura", value: "belly" },
        { text: "Pernas e glúteos", value: "legs" },
        { text: "Corpo todo, de forma equilibrada", value: "full_body" },
        { text: "Não tenho preferência — quero o básico que funcione", value: "no_pref" },
      ],
    },
    {
      id: "snack_attack",
      question: "Quando bate aquela fome de tarde, você costuma…",
      options: [
        { text: "Ir direto no que tiver na frente", value: "grab_whatever" },
        { text: "Segurar até a janta (e ficar de mau humor)", value: "hold_grumpy" },
        { text: "Tentar algo mais leve, quando lembro", value: "light_when_remember" },
        { text: "Já tenho meus lanches favoritos na cabeça", value: "planned_snacks" },
      ],
    },
    {
      id: "activity",
      question: "Como você descreve seu dia em termos de movimento?",
      options: [
        { text: "Passo muito tempo sentada", value: "sedentary" },
        { text: "Me movimento um pouco", value: "light" },
        { text: "Já tenho alguma atividade", value: "moderate" },
        { text: "Treino com frequência", value: "active" },
      ],
    },
    {
      id: "sleep",
      question: "Na última semana, você acordou se sentindo…",
      options: [
        { text: "Descansada — até que durmo bem", value: "rested" },
        { text: "Mais ou menos — depende do dia", value: "mixed" },
        { text: "Pesada — sono irregular ou curto", value: "tired" },
        { text: "Nem lembro a última vez que acordei 100%", value: "exhausted" },
      ],
    },
    {
      id: "stress",
      question: "Quando o dia aperta, o que mais acontece com você?",
      options: [
        { text: "Como sem perceber (estresse na comida)", value: "stress_eat" },
        { text: "Perde o apetite ou pula refeição", value: "skip_meals" },
        { text: "Quer só quietude — zero energia pra nada", value: "shutdown" },
        { text: "Tenta se segurar e seguir o plano", value: "hold_plan" },
      ],
    },
    {
      id: "age",
      question: "Qual é a sua faixa etária?",
      options: [
        { text: "18 a 29 anos", value: "18_29" },
        { text: "30 a 39 anos", value: "30_39" },
        { text: "40 a 49 anos", value: "40_49" },
        { text: "50 anos ou mais", value: "50_plus" },
      ],
    },
    {
      id: "past_attempts",
      question: "Você já tentou dietas restritivas ou apps de emagrecimento antes?",
      options: [
        { text: "Sim, várias vezes", value: "many" },
        { text: "Algumas vezes", value: "sometimes" },
        { text: "Quase nunca", value: "rarely" },
        { text: "É a primeira vez que busco algo assim", value: "first" },
      ],
    },
    {
      id: "hydration",
      question: "Água no dia a dia: você…",
      options: [
        { text: "Bebo pouco — esqueço fácil", value: "low_forget" },
        { text: "Tento, mas só quando lembro", value: "try_sometimes" },
        { text: "Levo garrafinha e até que vou bem", value: "bottle_ok" },
        { text: "Água é prioridade — já é hábito", value: "habit" },
      ],
    },
    {
      id: "time_daily",
      question: "Quanto tempo por dia você pode dedicar ao desafio?",
      options: [
        { text: "Menos de 15 minutos", value: "under_15" },
        { text: "Entre 15 e 30 minutos", value: "15_30" },
        { text: "Mais de 30 minutos", value: "over_30" },
        { text: "Depende do dia — quero algo flexível", value: "flex" },
      ],
    },
    {
      id: "food_vibe",
      question: "Comida pra você é mais…",
      options: [
        { text: "Prazer — e tem dia que é demais", value: "pleasure" },
        { text: "Combustível — só preciso matar a fome", value: "fuel" },
        { text: "Confusão — não sei o que é “certo”", value: "confused" },
        { text: "Equilíbrio — quero comer bem sem neurose", value: "balance" },
      ],
    },
    {
      id: "ally",
      question: "Nesse desafio, quem mais pode te apoiar (ou já te apoia)?",
      options: [
        { text: "Família ou parceiro(a)", value: "family" },
        { text: "Amigas ou grupo de amigas", value: "friends" },
        { text: "Sozinha por enquanto — e tá tudo bem", value: "solo_ok" },
        { text: "Quero apoio só do app, sem pressão de ninguém", value: "app_only" },
      ],
    },
    {
      id: "micro_win",
      question: "Uma vitória pequena que vale comemorar: você prefere…",
      options: [
        { text: "Ver o número na balança ou a roupa cair melhor", value: "scale_clothes" },
        { text: "Sentir mais disposição no dia a dia", value: "energy" },
        { text: "Manter constância uma semana inteira", value: "consistency" },
        { text: "Não desistir depois de um dia ruim", value: "bounce_back" },
      ],
    },
    {
      id: "motivation",
      question: "O que mais te motiva neste momento?",
      options: [
        { text: "Ver resultado sem sofrimento", value: "results" },
        { text: "Ter algo simples de seguir", value: "simple" },
        { text: "Apoio e lembretes no dia a dia", value: "support" },
        { text: "Provar para mim mesma que consigo", value: "prove" },
      ],
    },
  ];

  var answers = {};
  var stepIndex = 0;
  var root = document.getElementById("quiz-root");
  var progressBar = document.getElementById("quiz-progress-bar");
  var modal = document.getElementById("lead-modal");
  var form = document.getElementById("lead-form");
  var successEl = document.getElementById("modal-success");

  function track(event, detail) {
    console.log("[quiz]", event, detail || {});
  }

  /**
   * Meta Pixel: usar o mesmo `this` que o Facebook espera (apply(null) pode falhar em alguns builds).
   */
  function pixelTrack() {
    var w = window;
    var fn = w.fbq;
    if (typeof fn !== "function") {
      console.warn(
        "[Pixel] fbq não encontrado — eventos não serão enviados. Causas comuns: bloqueador de anúncios (uBlock, Brave), extensão de privacidade, ou página aberta como file:// (use http://localhost ou HTTPS)."
      );
      return;
    }
    try {
      fn.apply(fn, arguments);
    } catch (err) {
      console.warn("[Pixel] erro ao enviar evento:", err);
    }
  }

  function setProgress(phase) {
    var total = QUIZ_STEPS.length + 2;
    var p = 0;
    if (phase === "loading") {
      p = Math.round(((QUIZ_STEPS.length + 1) / total) * 100);
    } else if (phase === "results") {
      p = 100;
    } else {
      p = Math.round(((stepIndex + 1) / total) * 100);
    }
    progressBar.style.width = p + "%";
    progressBar.parentElement.setAttribute("aria-valuenow", String(p));
  }

  /**
   * Textos motivacionais “personalizados” a partir das respostas (conteúdo ilustrativo).
   */
  function buildMotivationalResults(a) {
    var paras = [];
    var g = a.goal;

    if (g === "lose_weight") {
      paras.push(
        "Pelas suas respostas, seu foco é emagrecer com mais leveza — sem viver de culpa a cada escapadinha. Isso combina com o desafio de 14 dias: hábitos curtos e repetíveis, não promessa de milagre da noite pro dia."
      );
    } else if (g === "tone_energy") {
      paras.push(
        "Você quer definir o corpo e ganhar disposição. O perfil que você descreveu pede consistência leve — movimento e rotina que não dependam de academia o tempo todo."
      );
    } else if (g === "maintain") {
      paras.push(
        "Manter o peso com hábitos melhores é um objetivo maduro: menos radicalismo, mais equilíbrio no dia a dia — exatamente o tom do nosso app de auxílio."
      );
    } else {
      paras.push(
        "Organização e rotina são o centro pra você. Isso é ótimo: o desafio foi pensado pra encaixar no calendário, não o contrário."
      );
    }

    if (a.body_focus === "belly") {
      paras.push(
        "Você marcou barriga e cintura como foco — dá para trabalhar isso junto com hábitos gerais (movimento, refeições e lembretes), sem obsessão com balança todo dia."
      );
    } else if (a.body_focus === "legs") {
      paras.push(
        "Pernas e glúteos no radar: combinam bem com passos simples em casa e com o ritmo do desafio, sem precisar de equipamento caro."
      );
    }

    if (a.snack_attack === "grab_whatever" || a.snack_attack === "hold_grumpy") {
      paras.push(
        "Sobre a fome de tarde: não é falta de força de vontade — muitas vezes é falta de plano B. Com lembretes e sugestões no app, fica mais fácil quebrar o automático."
      );
    }

    if (a.activity === "sedentary") {
      paras.push(
        "Você passa bastante tempo sentada: qualquer movimento curto já conta. O desafio respeita poucos minutos por dia — justamente pra caber na correria."
      );
    }

    if (a.sleep === "tired" || a.sleep === "exhausted") {
      paras.push(
        "Seu sono parece pesado ou irregular. Descanso melhor ajuda tudo o resto — inclusive decisões de comida; isso pode entrar como prioridade no seu acompanhamento."
      );
    }

    if (a.stress === "stress_eat") {
      paras.push(
        "Quando o dia aperta, a comida vira válvula — é mais comum do que parece. Com apoio no app, dá para criar pausas antes do impulso."
      );
    } else if (a.stress === "skip_meals") {
      paras.push(
        "Em dias intensos você some do prato: vamos te ajudar a não ficar o dia inteiro no vácuo, com lembretes leves e sem terrorismo nutricional."
      );
    }

    if (a.time_daily === "under_15" || a.time_daily === "flex") {
      paras.push(
        "Você foi clara sobre o tempo: poucos minutos ou dias diferentes. Esse desafio foi desenhado pra caber exatamente nesse tipo de realidade."
      );
    }

    if (a.past_attempts === "many" || a.past_attempts === "sometimes") {
      paras.push(
        "Você já tentou de tudo antes — então não falta garra, falta algo sustentável. Aqui o foco é continuidade e método, não culpa."
      );
    }

    if (a.motivation === "support" || a.motivation === "simple") {
      paras.push(
        "Você valoriza apoio e coisas simples de seguir: o app entra como companhia no bolso — missões, lembretes e conversa com a assistente quando precisar."
      );
    }

    while (paras.length < 3) {
      paras.push(
        "Suas respostas mostram que dá para evoluir com método: desafio de 14 dias, passos claros e auxílio direto quando você topar seguir com a gente no app."
      );
      break;
    }

    var bullets = [];
    bullets.push("Seu perfil combina com o desafio de 14 dias no app de auxílio.");
    if (a.hydration === "low_forget" || a.hydration === "try_sometimes") {
      bullets.push("Hidratação pode ser um dos primeiros hábitos fáceis de lembrar pelo app.");
    }
    if (a.food_vibe === "confused") {
      bullets.push("Se a comida confunde, o próximo passo é orientação clara — sem lista maluca de proibidos.");
    }
    if (a.ally === "solo_ok" || a.ally === "app_only") {
      bullets.push("Mesmo com pouca rede por perto, você não fica sozinha: assistente e missões te puxam de volta ao eixo.");
    }
    if (a.micro_win === "bounce_back" || a.micro_win === "consistency") {
      bullets.push("Constância e “levantar depois de um dia ruim” são vitórias que o app reforça — pequeno a pequeno.");
    }

    var planNote =
      "Para ter auxílio direto — conversa com a assistente, missões do dia e acompanhamento dentro do app — é preciso seguir com a gente por um plano acessível. Os valores e como contratar você confere com a equipe no próximo passo; fazer o quiz não te obriga a nada.";

    return {
      headline: "Seu perfil combina com quem pode evoluir com consistência",
      lead: "Com base no que você marcou, é assim que podemos te ajudar:",
      paragraphs: paras.slice(0, 5),
      bullets: bullets,
      planNote: planNote,
    };
  }

  function renderQuestion() {
    var step = QUIZ_STEPS[stepIndex];
    track("quiz_step_view", { step: step.id, index: stepIndex });
    pixelTrack("trackCustom", "QuizStepView", { step_id: step.id, step_index: stepIndex });

    var html =
      '<div class="quiz-card">' +
      '<p class="quiz-step-label">Pergunta ' +
      (stepIndex + 1) +
      " de " +
      QUIZ_STEPS.length +
      "</p>" +
      '<h2 class="quiz-question">' +
      escapeHtml(step.question) +
      "</h2>" +
      '<div class="quiz-options" role="list">';

    for (var i = 0; i < step.options.length; i++) {
      var opt = step.options[i];
      html +=
        '<button type="button" class="quiz-option" data-value="' +
        escapeAttr(opt.value) +
        '" role="listitem">' +
        escapeHtml(opt.text) +
        "</button>";
    }
    html += "</div>";

    if (stepIndex > 0) {
      html +=
        '<button type="button" class="btn btn--ghost quiz-back" id="quiz-back">Voltar</button>';
    }

    html += "</div>";
    root.innerHTML = html;

    var opts = root.querySelectorAll(".quiz-option");
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener("click", onOptionClick);
    }
    var backBtn = root.querySelector("#quiz-back");
    if (backBtn) backBtn.addEventListener("click", goBack);
    setProgress();
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function onOptionClick(e) {
    var btn = e.currentTarget;
    var step = QUIZ_STEPS[stepIndex];
    answers[step.id] = btn.getAttribute("data-value");
    track("quiz_answer", { step: step.id, value: answers[step.id] });
    pixelTrack("trackCustom", "QuizAnswer", { step_id: step.id, value: answers[step.id] });

    stepIndex += 1;
    if (stepIndex < QUIZ_STEPS.length) {
      renderQuestion();
    } else {
      renderLoading();
    }
  }

  function goBack() {
    if (stepIndex <= 0) return;
    stepIndex -= 1;
    var step = QUIZ_STEPS[stepIndex];
    delete answers[step.id];
    renderQuestion();
  }

  function renderLoading() {
    setProgress("loading");
    track("quiz_loading", {});
    pixelTrack("trackCustom", "QuizLoading", {});

    root.innerHTML =
      '<div class="quiz-card quiz-card--loading">' +
      '<div class="quiz-spinner" aria-hidden="true"></div>' +
      '<h2 class="quiz-question">Analisando suas respostas…</h2>' +
      '<p class="quiz-loading-text">Montando um resumo motivacional do seu perfil…</p>' +
      "</div>";

    window.setTimeout(function () {
      renderResults();
    }, 2600);
  }

  function renderResults() {
    var data = buildMotivationalResults(answers);
    track("quiz_results_view", { answers: answers });
    pixelTrack("trackCustom", "QuizResultsView", {});

    var html =
      '<div class="quiz-card quiz-card--results">' +
      '<p class="quiz-step-label">Seu resultado</p>' +
      '<h2 class="quiz-question quiz-question--results">' +
      escapeHtml(data.headline) +
      "</h2>" +
      '<p class="result-lead">' +
      escapeHtml(data.lead) +
      "</p>";

    var pi;
    for (pi = 0; pi < data.paragraphs.length; pi++) {
      html += '<p class="result-text">' + escapeHtml(data.paragraphs[pi]) + "</p>";
    }

    html +=
      '<div class="result-insight">' +
      '<h3 class="result-insight__title">Em resumo</h3>' +
      '<ul class="result-insight__list">';

    var bi;
    for (bi = 0; bi < data.bullets.length; bi++) {
      html += "<li>" + escapeHtml(data.bullets[bi]) + "</li>";
    }

    html +=
      "</ul></div>" +
      '<div class="result-plan-note">' +
      "<p>" +
      escapeHtml(data.planNote) +
      "</p>" +
      "</div>" +
      '<button type="button" class="btn btn--primary btn--large btn--block quiz-interest" id="quiz-tenho-interesse">' +
      "Quero receber como continuar" +
      "</button>" +
      "</div>";

    root.innerHTML = html;
    setProgress("results");
    try {
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      root.scrollIntoView(true);
    }

    document.getElementById("quiz-tenho-interesse").addEventListener("click", function () {
      track("quiz_interest_click", { answers: answers });
      pixelTrack("trackCustom", "QuizInterest", {});
      openModal("results");
    });
  }

  function openModal(source) {
    var src = source || "unknown";
    track("cta_click", { source: src });
    pixelTrack("trackCustom", "LeadModalOpen", { source: src });
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var firstInput = form.querySelector("input[name=email]");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (successEl && !successEl.hidden) {
      successEl.hidden = true;
      form.hidden = false;
      form.reset();
    }
  }

  function initModal() {
    var closeEls = document.querySelectorAll(".js-close-modal");
    for (var i = 0; i < closeEls.length; i++) {
      closeEls[i].addEventListener("click", closeModal);
    }
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (form.elements.email && form.elements.email.value) || "";
      var whatsapp = (form.elements.whatsapp && form.elements.whatsapp.value) || "";
      var emailTrim = email.trim();
      var waTrim = whatsapp.trim();

      if (!emailTrim && !waTrim) {
        track("lead_submit_blocked", { reason: "empty" });
        alert("Informe seu e-mail ou WhatsApp.");
        return;
      }

      track("lead_submit", {
        hasEmail: !!emailTrim,
        hasWhatsapp: !!waTrim,
        quiz_answers: answers,
      });

      /* Lead = evento padrão do Meta; só aqui após contato válido (não basta clicar em "Tenho interesse"). */
      pixelTrack("track", "Lead", {
        content_name: "Quiz desafio 14 dias",
        currency: "BRL",
        value: 1,
      });
      console.info(
        "[Pixel] Evento Lead enviado para a fila do pixel. Confira em: Events Manager → Testar eventos (ou aguarde alguns minutos no relatório)."
      );

      form.hidden = true;
      successEl.hidden = false;
    });
  }

  initModal();
  renderQuestion();

  window.addEventListener("load", function () {
    if (typeof window.fbq !== "function") {
      console.warn(
        "[Pixel] Após o carregamento: fbq ainda ausente. Sem o script connect.facebook.net, leads não contam no Meta."
      );
    } else {
      console.info(
        "[Pixel] Script do Meta carregado. O evento Lead só aparece depois de enviar o formulário com e-mail ou WhatsApp."
      );
    }
  });
})();
