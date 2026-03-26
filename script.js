(function () {
  "use strict";

  var modal = document.getElementById("lead-modal");
  var form = document.getElementById("lead-form");
  var successEl = document.getElementById("modal-success");
  var openButtons = document.querySelectorAll(".js-open-modal");
  var closeEls = document.querySelectorAll(".js-close-modal");

  function track(event, detail) {
    console.log("[landing]", event, detail || {});
  }

  /** Meta Pixel — só dispara se fbq existir (snippet no final do body). */
  function pixelTrack() {
    if (typeof fbq !== "function") return;
    fbq.apply(null, arguments);
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

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.getAttribute("data-cta"));
    });
  });

  closeEls.forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

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
      alert("Indica o teu e-mail ou o número de WhatsApp.");
      return;
    }

    track("lead_submit", {
      hasEmail: !!emailTrim,
      hasWhatsapp: !!waTrim,
    });

    pixelTrack("track", "Lead", {
      content_name: "Formulário — landing app telemóvel",
      content_category: "lead",
    });

    form.hidden = true;
    successEl.hidden = false;
  });
})();
