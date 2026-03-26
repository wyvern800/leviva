(function () {
  "use strict";

  var container = document.getElementById("bg-triangles");
  if (!container || typeof trianglify !== "function") return;

  var resizeTimer;

  function buildPattern() {
    try {
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var h = Math.max(
        document.documentElement.scrollHeight,
        document.body ? document.body.scrollHeight : 0,
        window.innerHeight || 0
      );

      var pattern = trianglify({
        width: w,
        height: h,
        cellSize: Math.min(85, Math.max(48, Math.floor(w / 14))),
        variance: 0.72,
        xColors: ["#ecfeff", "#99f6e4", "#2dd4bf", "#0f766e", "#134e4a"],
      });

      var svg = pattern.toSVG();
      svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      svg.style.display = "block";
      svg.style.width = "100%";
      svg.style.height = "100%";

      container.innerHTML = "";
      container.appendChild(svg);
    } catch (err) {
      console.info("[bg-effects] Trianglify:", err);
    }
  }

  buildPattern();

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildPattern, 180);
  });
})();
