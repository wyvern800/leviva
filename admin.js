(function () {
  "use strict";

  var statusEl = document.getElementById("admin-status");
  var listEl = document.getElementById("leads-list");
  var searchEl = document.getElementById("admin-search");
  var refreshBtn = document.getElementById("admin-refresh");

  var apiBase = (window.LEVIVA_API_URL || "").trim().replace(/\/+$/, "");
  var expectedToken = (window.ADMIN_TOKEN || "").trim();

  function getTokenFromQuery() {
    var params = new URLSearchParams(window.location.search || "");
    return (params.get("token") || "").trim();
  }

  function formatDate(isoOrAny) {
    if (!isoOrAny) return "";
    var d = new Date(isoOrAny);
    if (String(d) === "Invalid Date") return String(isoOrAny);
    return d.toLocaleString();
  }

  var allLeads = [];
  function render(list) {
    listEl.innerHTML = "";

    if (!list || list.length === 0) {
      listEl.innerHTML =
        '<div class="lead-card"><div class="lead-card__top"><div class="lead-card__meta"><div class="lead-card__email">Nenhum lead encontrado</div><div class="lead-card__whatsapp">Tente atualizar.</div></div></div></div>';
      return;
    }

    for (var i = 0; i < list.length; i++) {
      var lead = list[i];
      var card = document.createElement("div");
      card.className = "lead-card";

      var email = lead.email || "";
      var whatsapp = lead.whatsapp || lead.phone || "";
      var createdAt = lead.createdAt || lead.created_at || "";
      var value = lead.perceivedValueBrl || lead.perceived_value_brl || "";
      var valueNote = lead.valueNote || lead.value_note || "";
      var checkoutPlan = lead.checkoutPlan || lead.checkout_plan || "";
      var name = lead.name || "";

      var detailsId = "lead_details_" + i + "_" + String(Date.now()).slice(-6);

      card.innerHTML =
        '<div class="lead-card__top">' +
        '  <div class="lead-card__meta">' +
        '    <div class="lead-card__email" title="' + escapeHtml(email) + '">' + escapeHtml(email || "Sem e-mail") + "</div>" +
        (name
          ? '<div class="lead-card__name">' + escapeHtml(name) + "</div>"
          : "") +
        '    <div class="lead-card__whatsapp" title="' + escapeHtml(whatsapp) + '">' +
        escapeHtml(whatsapp || "Sem WhatsApp") +
        " </div>" +
        (checkoutPlan
          ? '<div class="lead-card__plan">' +
            escapeHtml(checkoutPlan === "ai" ? "Plano IA (R$ 50)" : "Plano essencial (R$ 30)") +
            "</div>"
          : "") +
        (value ? '<div class="lead-card__value">R$ ' + escapeHtml(String(value)) + "</div>" : "") +
        (valueNote ? '<div class="lead-card__note">' + escapeHtml(valueNote) + "</div>" : "") +
        "  </div>" +
        '  <div class="lead-card__date">' + escapeHtml(formatDate(createdAt)) + "</div>" +
        '  <button class="lead-card__toggle" type="button" data-toggle-details="' +
        detailsId +
        '">Ver</button>' +
        "</div>" +
        '<div class="lead-card__details" id="' +
        detailsId +
        '">' +
        '<div class="json-pill">Perguntas e respostas (JSON)</div>' +
        "<pre>" +
        escapeHtml(JSON.stringify(lead.quizAnswers || lead.quiz_answers || lead.quiz || {}, null, 2)) +
        "</pre>" +
        "</div>";

      listEl.appendChild(card);

      (function (detailsIdLocal, btnEl) {
        btnEl.addEventListener("click", function () {
          var details = document.getElementById(detailsIdLocal);
          if (!details) return;
          var isOpen = details.style.display === "block";
          details.style.display = isOpen ? "none" : "block";
          btnEl.textContent = isOpen ? "Ver" : "Ocultar";
        });
      })(detailsId, card.querySelector('[data-toggle-details="' + detailsId + '"]'));
    }
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }

  function applySearch() {
    var q = (searchEl.value || "").trim().toLowerCase();
    if (!q) return render(allLeads);
    var filtered = allLeads.filter(function (l) {
      var email = (l.email || "").toLowerCase();
      var whatsapp = (l.whatsapp || l.phone || "").toLowerCase();
      var name = (l.name || "").toLowerCase();
      return (
        email.indexOf(q) >= 0 ||
        whatsapp.indexOf(q) >= 0 ||
        name.indexOf(q) >= 0
      );
    });
    render(filtered);
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  async function loadLeads() {
    if (!apiBase) {
      setStatus("Configure window.LEVIVA_API_URL no admin.html.");
      return;
    }

    var token = getTokenFromQuery();
    if (!token || token !== expectedToken) {
      setStatus("Acesso negado. Abra com ?token=SUA_CHAVE (igual ao LEADS_ADMIN_TOKEN na API).");
      return;
    }

    setStatus("Carregando leads...");

    var url =
      apiBase +
      "/api/v1/leads?token=" +
      encodeURIComponent(token) +
      "&_=" +
      Date.now();

    try {
      var res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      var body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error || body.message || "HTTP " + res.status);
      }
      var leads = body.data && body.data.leads ? body.data.leads : [];
      allLeads = Array.isArray(leads) ? leads : [];
      setStatus("Leads carregados: " + allLeads.length);
      render(allLeads);
    } catch (err) {
      setStatus("Erro ao carregar: " + String(err && err.message ? err.message : err));
      console.warn(err);
    }
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      applySearch();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      loadLeads();
    });
  }

  loadLeads();
})();

