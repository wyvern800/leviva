(function () {
  "use strict";

  var statusEl = document.getElementById("admin-status");
  var listEl = document.getElementById("leads-list");
  var searchEl = document.getElementById("admin-search");
  var dateFromEl = document.getElementById("admin-date-from");
  var dateToEl = document.getElementById("admin-date-to");
  var dateClearBtn = document.getElementById("admin-date-clear");
  var refreshBtn = document.getElementById("admin-refresh");

  var apiBase = (window.LEVIVA_API_URL || "").trim().replace(/\/+$/, "");
  var TOKEN_STORAGE_KEY = "leviva_leads_admin_token";

  var tokenPanel = document.getElementById("admin-token-panel");
  var tokenInput = document.getElementById("admin-token-input");
  var tokenSubmit = document.getElementById("admin-token-submit");

  /** Query ?token= ou sessionStorage (validação real é na API). */
  function getEffectiveToken() {
    var params = new URLSearchParams(window.location.search || "");
    var q = (params.get("token") || "").trim();
    if (q) return q;
    try {
      return (sessionStorage.getItem(TOKEN_STORAGE_KEY) || "").trim();
    } catch (e) {
      return "";
    }
  }

  function persistToken(token) {
    try {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn("[admin] sessionStorage indisponível:", e);
    }
  }

  function showTokenPanel(show) {
    if (tokenPanel) tokenPanel.hidden = !show;
  }

  function formatDate(isoOrAny) {
    if (!isoOrAny) return "";
    var d = new Date(isoOrAny);
    if (String(d) === "Invalid Date") return String(isoOrAny);
    return d.toLocaleString();
  }

  function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  /**
   * Dígitos para https://wa.me/… — assume Brasil (55) se vier 10/11 dígitos sem código.
   */
  function whatsAppDigitsForUrl(raw) {
    var d = onlyDigits(raw);
    if (!d) return "";
    if (d.length >= 12 && d.slice(0, 2) === "55") return d;
    if (d.length === 10 || d.length === 11) return "55" + d;
    return d;
  }

  function whatsAppUrl(raw) {
    var digits = whatsAppDigitsForUrl(raw);
    if (!digits || digits.length < 10) return "";
    return "https://wa.me/" + digits;
  }

  /**
   * Máscara visual estilo BR: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX.
   */
  function formatPhoneDisplay(raw) {
    var d = onlyDigits(raw);
    if (!d) return String(raw || "").trim() || "—";
    var local = d;
    if (local.slice(0, 2) === "55" && local.length > 11) {
      local = local.slice(2);
    }
    if (local.length === 11) {
      return (
        "(" +
        local.slice(0, 2) +
        ") " +
        local.slice(2, 7) +
        "-" +
        local.slice(7, 11)
      );
    }
    if (local.length === 10) {
      return (
        "(" +
        local.slice(0, 2) +
        ") " +
        local.slice(2, 6) +
        "-" +
        local.slice(6, 10)
      );
    }
    if (d.length > 11) {
      return "+" + d.slice(0, 2) + " " + d.slice(2);
    }
    return raw;
  }

  var allLeads = [];

  /** Timestamp do lead (createdAt / created_at), ou NaN se inválido/ausente. */
  function getLeadTime(lead) {
    var raw = lead.createdAt || lead.created_at;
    if (!raw) return NaN;
    var t = new Date(raw).getTime();
    return Number.isNaN(t) ? NaN : t;
  }

  function parseYmdLocal(str) {
    if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    var p = str.split("-");
    var y = parseInt(p[0], 10);
    var m = parseInt(p[1], 10) - 1;
    var d = parseInt(p[2], 10);
    return new Date(y, m, d);
  }

  function startOfLocalDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  function endOfLocalDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }

  /**
   * Limites inclusivos no fuso local. Se só "de" ou só "até", o outro lado fica aberto.
   * Se as datas estiverem invertidas, troca automaticamente.
   */
  function getDateRangeBounds(fromStr, toStr) {
    if (!fromStr && !toStr) return { start: null, end: null };
    if (fromStr && !toStr) {
      var df = parseYmdLocal(fromStr);
      if (!df) return { start: null, end: null };
      return { start: startOfLocalDay(df), end: null };
    }
    if (!fromStr && toStr) {
      var dtOnly = parseYmdLocal(toStr);
      if (!dtOnly) return { start: null, end: null };
      return { start: null, end: endOfLocalDay(dtOnly) };
    }
    var d1 = parseYmdLocal(fromStr);
    var d2 = parseYmdLocal(toStr);
    if (!d1 || !d2) return { start: null, end: null };
    var t1 = startOfLocalDay(d1).getTime();
    var t2 = startOfLocalDay(d2).getTime();
    if (t1 <= t2) {
      return { start: startOfLocalDay(d1), end: endOfLocalDay(d2) };
    }
    return { start: startOfLocalDay(d2), end: endOfLocalDay(d1) };
  }

  function planBadgeHtml(checkoutPlan) {
    if (checkoutPlan === "ai") {
      return '<span class="badge-plan">Com IA</span>';
    }
    if (checkoutPlan === "standard") {
      return '<span class="badge-plan">Essencial</span>';
    }
    return '<span class="td-muted">—</span>';
  }

  function render(list) {
    listEl.innerHTML = "";

    if (!list || list.length === 0) {
      listEl.innerHTML =
        '<div class="admin-table-wrap"><div class="admin-table-empty">Nenhum lead encontrado. Tente atualizar, ajuste a busca ou o intervalo de datas.</div></div>';
      return;
    }

    var parts = [];
    parts.push('<div class="admin-table-wrap">');
    parts.push('<table class="admin-table">');
    parts.push("<thead><tr>");
    parts.push("<th>Data</th>");
    parts.push("<th>Nome</th>");
    parts.push("<th>E-mail</th>");
    parts.push("<th>WhatsApp</th>");
    parts.push("<th>Plano</th>");
    parts.push("<th>Ações</th>");
    parts.push("</tr></thead><tbody>");

    for (var i = 0; i < list.length; i++) {
      var lead = list[i];
      var email = lead.email || "";
      var whatsapp = lead.whatsapp || lead.phone || "";
      var createdAt = lead.createdAt || lead.created_at || "";
      var checkoutPlan = lead.checkoutPlan || lead.checkout_plan || "";
      var name = lead.name || "";
      var detailsId = "lead_json_" + i + "_" + String(Date.now()).slice(-6);
      var phoneDisplay = formatPhoneDisplay(whatsapp);
      var waLink = whatsAppUrl(whatsapp);
      var waBtn = waLink
        ? '<a class="wa-btn" href="' +
          escapeHtml(waLink) +
          '" target="_blank" rel="noopener noreferrer" title="Abrir WhatsApp">WA</a>'
        : '<button type="button" class="wa-btn wa-btn--disabled" disabled title="Sem número válido para WhatsApp">WA</button>';

      parts.push('<tr data-lead-row>');
      parts.push('<td class="td-muted">' + escapeHtml(formatDate(createdAt)) + "</td>");
      parts.push("<td>" + escapeHtml(name || "—") + "</td>");
      parts.push(
        '<td class="td-email" title="' +
          escapeHtml(email) +
          '">' +
          escapeHtml(email || "—") +
          "</td>",
      );
      parts.push(
        '<td title="' +
          escapeHtml(whatsapp) +
          '"><span class="td-muted">' +
          escapeHtml(phoneDisplay) +
          "</span></td>",
      );
      parts.push("<td>" + planBadgeHtml(checkoutPlan) + "</td>");
      parts.push(
        '<td class="td-actions">' +
          waBtn +
          '<button type="button" class="btn-json" data-toggle-json="' +
          detailsId +
          '">Ver respostas</button></td>',
      );
      parts.push("</tr>");
      parts.push(
        '<tr class="admin-json-row" id="' +
          detailsId +
          '" style="display:none"><td colspan="6"><pre>' +
          escapeHtml(
            JSON.stringify(lead.quizAnswers || lead.quiz_answers || lead.quiz || {}, null, 2),
          ) +
          "</pre></td></tr>",
      );
    }

    parts.push("</tbody></table></div>");
    listEl.innerHTML = parts.join("");
  }

  /** Delegação: expandir/ocultar linha de JSON (tr display table-row). */
  if (listEl) {
    listEl.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest("[data-toggle-json]");
      if (!btn || !listEl.contains(btn)) return;
      var id = btn.getAttribute("data-toggle-json");
      if (!id) return;
      var row = document.getElementById(id);
      if (!row) return;
      var open = row.style.display === "table-row";
      row.style.display = open ? "none" : "table-row";
      btn.textContent = open ? "Ver respostas" : "Ocultar";
    });
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }

  function applyFilters() {
    var q = (searchEl && searchEl.value ? searchEl.value : "").trim().toLowerCase();
    var fromStr = dateFromEl ? (dateFromEl.value || "").trim() : "";
    var toStr = dateToEl ? (dateToEl.value || "").trim() : "";
    var hasDateFilter = !!fromStr || !!toStr;
    var bounds = getDateRangeBounds(fromStr, toStr);

    var filtered = allLeads.filter(function (l) {
      if (hasDateFilter) {
        var t = getLeadTime(l);
        if (Number.isNaN(t)) return false;
        if (bounds.start !== null && t < bounds.start.getTime()) return false;
        if (bounds.end !== null && t > bounds.end.getTime()) return false;
      }
      if (!q) return true;
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
      showTokenPanel(false);
      return;
    }

    var token = getEffectiveToken();
    if (!token) {
      setStatus("Informe o token abaixo (o mesmo LEADS_ADMIN_TOKEN da API).");
      showTokenPanel(true);
      if (tokenInput) tokenInput.focus();
      return;
    }

    showTokenPanel(false);
    setStatus("Carregando leads...");

    var debugAdmin =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search || "").get("debug") === "1";

    var url =
      apiBase +
      "/api/v1/leads?token=" +
      encodeURIComponent(token) +
      (debugAdmin ? "&diagnose=1" : "") +
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
      persistToken(token);

      if (body.data && body.data._diagnose) {
        console.info("[admin] Diagnóstico API → Supabase:", body.data._diagnose);
      }

      if (allLeads.length === 0) {
        setStatus(
          "Leads carregados: 0. Se você vê linhas na tabela public.leads no Studio mas aqui não, o processo da API (porta 3001) provavelmente está com outro SUPABASE_URL no .env — alinhe com o Studio (ex.: http://127.0.0.1:54321) e reinicie a API. Abra o admin com ?debug=1 e veja o objeto no console (F12).",
        );
      } else {
        setStatus("Leads carregados: " + allLeads.length);
      }
      applyFilters();
    } catch (err) {
      var msg = String(err && err.message ? err.message : err);
      if (msg.indexOf("401") >= 0 || msg.toLowerCase().indexOf("unauthorized") >= 0) {
        try {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        } catch (e) {}
        setStatus("Token inválido ou expirado. Informe de novo.");
        showTokenPanel(true);
        if (tokenInput) tokenInput.value = "";
      } else {
        setStatus("Erro ao carregar: " + msg);
      }
      console.warn(err);
    }
  }

  if (tokenSubmit && tokenInput) {
    tokenSubmit.addEventListener("click", function () {
      var t = (tokenInput.value || "").trim();
      if (!t) {
        setStatus("Digite o token.");
        return;
      }
      persistToken(t);
      loadLeads();
    });
    tokenInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tokenSubmit.click();
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      applyFilters();
    });
  }

  function bindDateFilter(el) {
    if (!el) return;
    el.addEventListener("change", function () {
      applyFilters();
    });
    el.addEventListener("input", function () {
      applyFilters();
    });
  }
  bindDateFilter(dateFromEl);
  bindDateFilter(dateToEl);

  if (dateClearBtn) {
    dateClearBtn.addEventListener("click", function () {
      if (dateFromEl) dateFromEl.value = "";
      if (dateToEl) dateToEl.value = "";
      applyFilters();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      loadLeads();
    });
  }

  loadLeads();
})();

