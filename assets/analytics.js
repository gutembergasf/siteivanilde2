/*
 * Google Ads — rastreamento de conversões de clique (gtag.js)
 * Site: www.ivanildecavalcanti.com.br | Deploy: Vercel (HTML estático, sem build)
 *
 * Este arquivo é a fonte de verdade em runtime. Como o site é estático (sem
 * bundler), não há injeção de env var no browser. Os valores abaixo são
 * públicos por natureza (aparecem no gtag visível na página), então ficam
 * versionados aqui. O .env.example existe apenas como documentação para
 * configurar o Google Ads / painel da Vercel.
 *
 * Inclua UMA vez por página:  <script src="assets/analytics.js" defer></script>
 * O loader do gtag é injetado por este próprio script.
 */
(function () {
  "use strict";

  // Guard SSR / ambiente sem DOM (no-op silencioso).
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // ---- Config (valores públicos) --------------------------------------------
  var GOOGLE_ADS_ID = "AW-18323827538";
  var CONV_WHATSAPP = "dH_BCKTk1dEcENLWvaFE";
  var CONV_DOCTORALIA = "NFQRCPvn0dEcENLWvaFE";

  // ---- Loader do gtag (carrega uma única vez) -------------------------------
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  if (!window.__gtagLoaded) {
    window.__gtagLoaded = true;

    var s = document.createElement("script");
    s.async = true;
    s.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GOOGLE_ADS_ID);
    document.head.appendChild(s);

    window.gtag("js", new Date());
    window.gtag("config", GOOGLE_ADS_ID);
  }

  // ---- Util de conversão -----------------------------------------------------
  /**
   * Dispara uma conversão do Google Ads.
   * @param {string} label  Label da conversão (ex.: CONV_WHATSAPP).
   * @param {{ url?: string }} [opts]  Se `url` for informado, navega na MESMA
   *   aba após registrar (event_callback) com fallback por timeout de ~300ms.
   *   Para links target="_blank" NÃO passe `url`: apenas dispara e deixa o
   *   comportamento nativo do link seguir.
   */
  function trackAdsConversion(label, opts) {
    opts = opts || {};

    // Guard: gtag ausente/bloqueado (ad-blocker, offline) → no-op silencioso.
    if (typeof window.gtag !== "function" || !label) {
      if (opts.url) window.location.href = opts.url;
      return;
    }

    var params = { send_to: GOOGLE_ADS_ID + "/" + label };

    if (opts.url) {
      // Navegação na MESMA aba: só depois de registrar, com fallback.
      var navigated = false;
      var go = function () {
        if (navigated) return;
        navigated = true;
        window.location.href = opts.url;
      };
      params.event_callback = go;
      window.gtag("event", "conversion", params);
      window.setTimeout(go, 300); // fallback se o callback não retornar
      return;
    }

    // Nova aba (target=_blank): apenas dispara, sem preventDefault/navegação.
    window.gtag("event", "conversion", params);
  }
  window.trackAdsConversion = trackAdsConversion;

  // ---- Handler centralizado (event delegation) ------------------------------
  // Um único listener no document cobre todos os links wa.me / doctoralia,
  // sem instrumentar cada âncora individualmente.
  function labelForHref(href) {
    if (!href) return null;
    if (/(?:wa\.me|api\.whatsapp\.com)/i.test(href)) return CONV_WHATSAPP;
    if (/doctoralia\.com\.br/i.test(href)) return CONV_DOCTORALIA;
    return null;
  }

  document.addEventListener(
    "click",
    function (ev) {
      var el = ev.target;
      var anchor = el && el.closest ? el.closest("a[href]") : null;
      if (!anchor) return;

      var label = labelForHref(anchor.getAttribute("href"));
      if (!label) return;

      // Todos os links de conversão abrem em nova aba: apenas dispara o evento
      // e deixa o link seguir nativamente (sem preventDefault, sem navegação).
      trackAdsConversion(label);
    },
    true // captura: registra antes de eventuais handlers que parem a propagação
  );
})();
