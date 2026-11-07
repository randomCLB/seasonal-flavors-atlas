/* Private GoatCounter analytics. No visible UI, cookies, storage, or dependencies. */
(function () {
  'use strict';
  try {
    var script = document.currentScript;
    var code = script && script.getAttribute('data-site');
    var page = new URL(location.href);
    var base = '/seasonal-flavors-atlas/';
    if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(code || '') ||
        page.origin !== 'https://randomclb.github.io' ||
        page.pathname.indexOf(base) !== 0 ||
        page.pathname.indexOf(base + 'preview/') === 0 ||
        page.searchParams.get('analytics') === 'off' ||
        navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true ||
        navigator.webdriver || window.top !== window.self ||
        typeof window.fetch !== 'function') return;

    function count() {
      if (document.visibilityState !== 'visible' || window.__fengwuCounted) return;
      window.__fengwuCounted = true;
      document.removeEventListener('visibilitychange', count);
      try {
        var referrer = '';
        try {
          var ref = new URL(document.referrer);
          if (/^https?:$/.test(ref.protocol) && ref.origin !== page.origin) referrer = ref.origin;
        } catch (_) { /* Missing or invalid referrer means direct/unknown. */ }
        var params = new URLSearchParams({
          p: page.pathname.replace(/\/index\.html$/, '/'),
          t: document.title.slice(0, 120),
          r: referrer,
          rnd: String(Math.random())
        });
        // Only a short campaign label is forwarded; no other query/hash data leaves the page.
        var source = page.searchParams.get('utm_source') || '';
        if (/^[a-z0-9][a-z0-9_-]{0,39}$/i.test(source)) {
          params.set('q', new URLSearchParams({utm_source: source}).toString());
        }
        window.fetch('https://' + code + '.goatcounter.com/count?' + params, {
          method: 'GET', mode: 'no-cors', credentials: 'omit', cache: 'no-store',
          referrerPolicy: 'no-referrer', keepalive: true
        }).catch(function () { /* Analytics is optional; never retry or interrupt the site. */ });
      } catch (_) { /* A failed beacon must not affect the site. */ }
    }
    if (document.visibilityState === 'visible') count();
    else document.addEventListener('visibilitychange', count);
  } catch (_) { /* Unsupported browsers keep the full site without analytics. */ }
}());
