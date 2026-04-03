(function () {
  "use strict";

  /**
   * Funil tipo Leviva (objetivo, corpo, rotina, hábitos…).
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
        {
          text: "Não tenho preferência — quero o básico que funcione",
          value: "no_pref",
        },
      ],
    },
    {
      id: "snack_attack",
      question: "Quando bate aquela fome de tarde, você costuma…",
      options: [
        { text: "Ir direto no que tiver na frente", value: "grab_whatever" },
        {
          text: "Segurar até a janta (e ficar de mau humor)",
          value: "hold_grumpy",
        },
        {
          text: "Tentar algo mais leve, quando lembro",
          value: "light_when_remember",
        },
        {
          text: "Já tenho meus lanches favoritos na cabeça",
          value: "planned_snacks",
        },
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
        {
          text: "Nem lembro a última vez que acordei 100%",
          value: "exhausted",
        },
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
      question:
        "Você já tentou dietas restritivas ou apps de emagrecimento antes?",
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
        {
          text: "Quero apoio só do app, sem pressão de ninguém",
          value: "app_only",
        },
      ],
    },
    {
      id: "micro_win",
      question: "Uma vitória pequena que vale comemorar: você prefere…",
      options: [
        {
          text: "Ver o número na balança ou a roupa cair melhor",
          value: "scale_clothes",
        },
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

  /** Só IDs dos passos do quiz — evita misturar checkout_plan / metadados nas respostas salvas. */
  function buildQuizAnswersForSheet(answersObj) {
    var out = {};
    for (var i = 0; i < QUIZ_STEPS.length; i++) {
      var id = QUIZ_STEPS[i].id;
      if (Object.prototype.hasOwnProperty.call(answersObj, id)) {
        out[id] = answersObj[id];
      }
    }
    return out;
  }
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
        "[Pixel] fbq não encontrado — eventos não serão enviados. Causas comuns: bloqueador de anúncios (uBlock, Brave), extensão de privacidade, ou página aberta como file:// (use http://localhost ou HTTPS).",
      );
      return;
    }
    try {
      fn.apply(fn, arguments);
    } catch (err) {
      console.warn("[Pixel] erro ao enviar evento:", err);
    }
  }

  /**
   * Persiste lead no Supabase via API (POST /api/v1/leads). Não bloqueia checkout se falhar.
   */
  function sendLeadToApi(apiBase, payload) {
    var base = (apiBase || "").trim().replace(/\/+$/, "");
    if (!base) {
      console.info("[Leads] LEVIVA_API_URL vazio; lead não enviado à API.");
      return Promise.resolve({ skipped: true });
    }

    return fetch(base + "/api/v1/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          return { ok: res.ok, body: body };
        });
      })
      .then(function (result) {
        if (result.ok && result.body && result.body.success) {
          console.info("[Leads] lead salvo no Supabase.");
          return;
        }
        console.warn(
          "[Leads] resposta inesperada:",
          result.body || result,
        );
      })
      .catch(function (err) {
        console.warn("[Leads] erro ao enviar lead:", err);
      });
  }

  function setProgress(phase) {
    var total = QUIZ_STEPS.length + 3;
    var p = 0;
    if (phase === "loading") {
      p = Math.round(((QUIZ_STEPS.length + 1) / total) * 100);
    } else if (phase === "results") {
      p = Math.round(((QUIZ_STEPS.length + 2) / total) * 100);
    } else if (phase === "plans") {
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
        "Pelas suas respostas, seu foco é emagrecer com mais leveza — sem viver de culpa a cada escapadinha. Isso combina com o desafio de 30 dias: hábitos curtos e repetíveis, não promessa de milagre da noite pro dia.",
      );
    } else if (g === "tone_energy") {
      paras.push(
        "Você quer definir o corpo e ganhar disposição. O perfil que você descreveu pede consistência leve — movimento e rotina que não dependam de academia o tempo todo.",
      );
    } else if (g === "maintain") {
      paras.push(
        "Manter o peso com hábitos melhores é um objetivo maduro: menos radicalismo, mais equilíbrio no dia a dia — exatamente o tom do nosso app de auxílio.",
      );
    } else {
      paras.push(
        "Organização e rotina são o centro pra você. Isso é ótimo: o desafio foi pensado pra encaixar no calendário, não o contrário.",
      );
    }

    if (a.body_focus === "belly") {
      paras.push(
        "Você marcou barriga e cintura como foco — dá para trabalhar isso junto com hábitos gerais (movimento, refeições e lembretes), sem obsessão com balança todo dia.",
      );
    } else if (a.body_focus === "legs") {
      paras.push(
        "Pernas e glúteos no radar: combinam bem com passos simples em casa e com o ritmo do desafio, sem precisar de equipamento caro.",
      );
    }

    if (
      a.snack_attack === "grab_whatever" ||
      a.snack_attack === "hold_grumpy"
    ) {
      paras.push(
        "Sobre a fome de tarde: não é falta de força de vontade — muitas vezes é falta de plano B. Com lembretes e sugestões no app, fica mais fácil quebrar o automático.",
      );
    }

    if (a.activity === "sedentary") {
      paras.push(
        "Você passa bastante tempo sentada: qualquer movimento curto já conta. O desafio respeita poucos minutos por dia — justamente pra caber na correria.",
      );
    }

    if (a.sleep === "tired" || a.sleep === "exhausted") {
      paras.push(
        "Seu sono parece pesado ou irregular. Descanso melhor ajuda tudo o resto — inclusive decisões de comida; isso pode entrar como prioridade no seu acompanhamento.",
      );
    }

    if (a.stress === "stress_eat") {
      paras.push(
        "Quando o dia aperta, a comida vira válvula — é mais comum do que parece. Com apoio no app, dá para criar pausas antes do impulso.",
      );
    } else if (a.stress === "skip_meals") {
      paras.push(
        "Em dias intensos você some do prato: vamos te ajudar a não ficar o dia inteiro no vácuo, com lembretes leves e sem terrorismo nutricional.",
      );
    }

    if (a.time_daily === "under_15" || a.time_daily === "flex") {
      paras.push(
        "Você foi clara sobre o tempo: poucos minutos ou dias diferentes. Esse desafio foi desenhado pra caber exatamente nesse tipo de realidade.",
      );
    }

    if (a.past_attempts === "many" || a.past_attempts === "sometimes") {
      paras.push(
        "Você já tentou de tudo antes — então não falta garra, falta algo sustentável. Aqui o foco é continuidade e método, não culpa.",
      );
    }

    if (a.motivation === "support" || a.motivation === "simple") {
      paras.push(
        "Você valoriza apoio e coisas simples de seguir: o app entra como companhia no bolso — missões, lembretes e conversa com a assistente quando precisar.",
      );
    }

    while (paras.length < 3) {
      paras.push(
        "Suas respostas mostram que dá para evoluir com método: desafio de 30 dias, passos claros e auxílio direto quando você topar seguir com a gente no app.",
      );
      break;
    }

    var bullets = [];
    bullets.push(
      "Seu perfil combina com o desafio de 30 dias no app de auxílio.",
    );
    if (a.hydration === "low_forget" || a.hydration === "try_sometimes") {
      bullets.push(
        "Hidratação pode ser um dos primeiros hábitos fáceis de lembrar pelo app.",
      );
    }
    if (a.food_vibe === "confused") {
      bullets.push(
        "Se a comida confunde, o próximo passo é orientação clara — sem lista maluca de proibidos.",
      );
    }
    if (a.ally === "solo_ok" || a.ally === "app_only") {
      bullets.push(
        "Mesmo com pouca rede por perto, você não fica sozinha: assistente e missões te puxam de volta ao eixo.",
      );
    }
    if (a.micro_win === "bounce_back" || a.micro_win === "consistency") {
      bullets.push(
        "Constância e “levantar depois de um dia ruim” são vitórias que o app reforça — pequeno a pequeno.",
      );
    }

    var planNote =
      "No próximo passo você informa contato e segue para o pagamento seguro (assinatura) para liberar o app de auxílio, as missões e a assistente. Fazer o quiz não te obriga a nada até você concluir o checkout.";

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
    pixelTrack("trackCustom", "QuizStepView", {
      step_id: step.id,
      step_index: stepIndex,
    });

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
    pixelTrack("trackCustom", "QuizAnswer", {
      step_id: step.id,
      value: answers[step.id],
    });

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
      '<p class="quiz-loading-text">Montando um resumo do seu perfil…</p>' +
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
      html +=
        '<p class="result-text">' + escapeHtml(data.paragraphs[pi]) + "</p>";
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
      '<button type="button" class="btn btn--primary btn--large btn--block quiz-interest" id="quiz-after-results">' +
      "Escolher meu plano" +
      "</button>" +
      "</div>";

    root.innerHTML = html;
    setProgress("results");
    try {
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      root.scrollIntoView(true);
    }

    document
      .getElementById("quiz-after-results")
      .addEventListener("click", function () {
        track("quiz_results_continue", { answers: answers });
        pixelTrack("trackCustom", "QuizResultsContinue", {});
        renderPlanScreen();
      });
  }

  function renderPlanScreen() {
    track("quiz_plans_view", { answers: answers });
    pixelTrack("trackCustom", "QuizPlansView", {});

    var html =
      '<div class="quiz-card quiz-card--plans">' +
      '<p class="quiz-step-label">Planos</p>' +
      '<h2 class="quiz-question quiz-question--plans">Escolha seu plano</h2>' +
      '<p class="quiz-plans-intro">Assinatura mensal com acesso ao desafio de 30 dias no app. Cancele quando quiser.</p>' +
      '<div class="quiz-plans-grid" role="radiogroup" aria-label="Planos">' +
      '<button type="button" class="quiz-plan-card" data-plan="standard" aria-pressed="false">' +
      '<span class="quiz-plan-card__badge">Mais acessível</span>' +
      '<span class="quiz-plan-card__title">Essencial</span>' +
      '<span class="quiz-plan-card__price">R$ 30<span>/mês</span></span>' +
      '<ul class="quiz-plan-card__list">' +
      "<li>Começa com o desafio de 30 dias; depois os desafios <strong>se renovam</strong> — a jornada continua.</li>" +
      "<li>Fluxo <strong>infinito</strong> de novos desafios, sempre evoluindo.</li>" +
      "<li>A experiência <strong>vai melhorando</strong> com o tempo, no seu ritmo.</li>" +
      "</ul>" +
      "</button>" +
      '<button type="button" class="quiz-plan-card quiz-plan-card--featured" data-plan="ai" aria-pressed="false">' +
      '<span class="quiz-plan-card__badge quiz-plan-card__badge--featured">Recomendado</span>' +
      '<span class="quiz-plan-card__title">Com IA auxiliar</span>' +
      '<span class="quiz-plan-card__price">R$ 50<span>/mês</span></span>' +
      '<ul class="quiz-plan-card__list">' +
      "<li>Tudo do Essencial</li>" +
      "<li><strong>Assistente com IA</strong> para dúvidas e motivação</li>" +
      "<li>Conversas ilimitadas no período ativo</li>" +
      "</ul>" +
      "</button>" +
      "</div>" +
      '<p class="quiz-plans-footnote">Valores meramente ilustrativos; o valor final é confirmado no checkout seguro (Stripe).</p>' +
      '<button type="button" class="btn btn--primary btn--large btn--block" id="quiz-plans-continue" disabled>' +
      "Continuar para cadastro" +
      "</button>" +
      "</div>";

    root.innerHTML = html;
    setProgress("plans");
    try {
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      root.scrollIntoView(true);
    }

    var cards = root.querySelectorAll(".quiz-plan-card");
    var continueBtn = document.getElementById("quiz-plans-continue");

    function selectPlan(plan) {
      answers.checkout_plan = plan;
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var isOn = c.getAttribute("data-plan") === plan;
        c.classList.toggle("quiz-plan-card--selected", isOn);
        c.setAttribute("aria-pressed", isOn ? "true" : "false");
      }
      continueBtn.disabled = false;
      track("quiz_plan_selected", { plan: plan });
      pixelTrack("trackCustom", "QuizPlanSelected", { plan: plan });
    }

    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener("click", function (ev) {
        var plan = ev.currentTarget.getAttribute("data-plan");
        if (plan) selectPlan(plan);
      });
    }

    continueBtn.addEventListener("click", function () {
      if (!answers.checkout_plan) {
        alert("Selecione um dos planos para continuar.");
        return;
      }
      track("quiz_plans_continue", { plan: answers.checkout_plan });
      pixelTrack("trackCustom", "QuizPlansContinue", { plan: answers.checkout_plan });
      openModal("plans");
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
      var whatsapp =
        (form.elements.whatsapp && form.elements.whatsapp.value) || "";
      var nameField = (form.elements.name && form.elements.name.value) || "";
      var emailTrim = email.trim();
      var waTrim = whatsapp.trim();
      var nameTrim = nameField.trim();

      if (!emailTrim || !waTrim) {
        track("lead_submit_blocked", { reason: "incomplete" });
        alert("Preencha e-mail e WhatsApp — os dois são obrigatórios.");
        return;
      }

      var apiBase = (window.LEVIVA_API_URL || "").trim().replace(/\/+$/, "");
      if (!apiBase) {
        alert(
          "Configure window.LEVIVA_API_URL no index.html com a URL da API (ex.: https://sua-api.up.railway.app).",
        );
        return;
      }

      var planTier = answers.checkout_plan === "ai" ? "ai" : "standard";

      track("lead_submit", {
        hasEmail: !!emailTrim,
        hasWhatsapp: !!waTrim,
        plan: planTier,
        quiz_answers: answers,
      });

      pixelTrack("track", "Lead", {
        content_name: "Quiz desafio 30 dias",
        currency: "BRL",
        value: planTier === "ai" ? 50 : 30,
      });

      var quizForSheet = buildQuizAnswersForSheet(answers);
      var leadPayload = {
        email: emailTrim,
        whatsapp: waTrim,
        name: nameTrim || undefined,
        quizAnswers: quizForSheet,
        source: "quiz-desafio-30-dias",
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        checkoutPlan: planTier,
      };

      var submitBtn = document.getElementById("lead-submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Abrindo checkout…";
      }

      sendLeadToApi(apiBase, leadPayload);

      fetch(apiBase + "/api/v1/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: emailTrim,
          name: nameTrim || emailTrim.split("@")[0],
          whatsapp: waTrim,
          plan: planTier,
          quizAnswers: answers,
        }),
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, status: res.status, body: body };
          });
        })
        .then(function (result) {
          if (
            result.ok &&
            result.body &&
            result.body.success &&
            result.body.data &&
            result.body.data.url
          ) {
            window.location.href = result.body.data.url;
            return;
          }
          var errMsg =
            (result.body && (result.body.error || result.body.message)) ||
            "Não foi possível abrir o checkout. Tente de novo em instantes.";
          throw new Error(errMsg);
        })
        .catch(function (err) {
          console.error("[checkout]", err);
          alert(err.message || "Erro ao iniciar o pagamento.");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Ir para o checkout";
          }
        });
    });
  }

  initModal();
  renderQuestion();

  window.addEventListener("load", function () {
    if (typeof window.fbq !== "function") {
      console.warn(
        "[Pixel] Após o carregamento: fbq ainda ausente. Sem o script connect.facebook.net, leads não contam no Meta.",
      );
    } else {
      console.info(
        "[Pixel] Script do Meta carregado. O evento Lead só aparece depois de enviar o formulário com e-mail e WhatsApp.",
      );
    }
  });
})();
