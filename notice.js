// ─── Notice banner config ────────────────────────────────────────────────────
//
//  enabled : set to true to show the banner, false to hide it
//  message : the text that appears after "NOTICE:"
//
// ─────────────────────────────────────────────────────────────────────────────

var notice = {
  enabled: true,
  message: 'There are no classes on 15th June while Katie recovers. We are hoping to be back on the 22nd. Watch this space!'
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
