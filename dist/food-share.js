/* Share only the selected public ingredient, never the current page's query state. */
(function (root) {
  'use strict';
  function shareData(food, href) {
    const url = new URL('index.html', href);
    url.pathname = url.pathname.replace(/\/preview\/v1\.1\/index\.html$/, '/index.html');
    url.searchParams.set('food', food.id);
    return { title: `${food.name} · 时令风物`, url: url.href };
  }
  function bind({ button, status, fallback, input, copy, navigator, href }) {
    let food = null, revision = 0, busy = false;
    const message = text => { status.textContent = text; };
    function setFood(next) {
      food = next;
      revision++;
      fallback.hidden = true;
      input.value = '';
      message('');
      button.disabled = busy || !food;
      button.setAttribute('aria-label', food ? `分享${food.name}` : '分享这味风物');
    }
    async function copyLink(data, token) {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(data.url);
        if (token === revision) {
          fallback.hidden = true;
          message('链接已复制，可以粘贴给朋友');
        }
      } catch {
        if (token !== revision) return;
        input.value = data.url;
        fallback.hidden = false;
        message('请长按或选中下方链接复制，再到想分享的应用粘贴');
        input.focus();
        input.select();
      }
    }
    async function share() {
      if (!food || busy) return;
      const token = revision, data = shareData(food, href());
      busy = true;
      button.disabled = true;
      copy.disabled = true;
      fallback.hidden = true;
      message('');
      try {
        // Call directly within the click gesture; do not await before navigator.share.
        if (typeof navigator.share === 'function' &&
            (typeof navigator.canShare !== 'function' || navigator.canShare(data))) {
          try {
            await navigator.share(data);
            // Resolution means the sheet accepted the share, not delivery to a person.
          } catch (error) {
            if (token !== revision) return;
            if (error?.name === 'AbortError') { message('已取消分享'); return; }
            await copyLink(data, token);
          }
        } else {
          await copyLink(data, token);
        }
      } catch {
        if (token === revision) await copyLink(data, token);
      } finally {
        busy = false;
        button.disabled = !food;
        copy.disabled = false;
      }
    }
    button.onclick = share;
    copy.onclick = async () => {
      if (!food || busy) return;
      busy = true;
      button.disabled = true;
      copy.disabled = true;
      try { await copyLink(shareData(food, href()), revision); }
      finally { busy = false; button.disabled = !food; copy.disabled = false; }
    };
    return { setFood };
  }
  const api = { shareData, bind };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FoodShare = api;
})(typeof window === 'object' ? window : globalThis);
