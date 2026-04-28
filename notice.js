// ─── Notice banner config ────────────────────────────────────────────────────
//
//  enabled : set to true to show the banner, false to hide it
//  message : the text that appears after "NOTICE:"
//
// ─────────────────────────────────────────────────────────────────────────────

var notice = {
  enabled: fales,
  message: 'Classes are running as normal. See you on the floor!'
};

// ─── Do not edit below this line ─────────────────────────────────────────────

(function () {
  var root = document.getElementById('notice-banner-root');
  if (!root) return;
  if (!notice.enabled) return;

  root.className = 'notice-banner';
  root.setAttribute('role', 'alert');
  root.innerHTML =
    '<div class="container"><p><strong>NOTICE:</strong> ' +
    notice.message +
    '</p></div>';
})();
