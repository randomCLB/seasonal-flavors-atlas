"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.join(__dirname, '..', 'dist');
const read = name => fs.readFileSync(path.join(dist, name), 'utf8');
function nav(html, label) {
  const match = html.match(new RegExp('<nav[^>]*aria-label="'+label+'"[^>]*>([\\s\\S]*?)</nav>'));
  assert.ok(match, label);
  return [...match[1].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(m => ({
    href: m[1].match(/\bhref="([^"]+)"/)?.[1],
    current: /aria-current="page"/.test(m[1]), text: m[2]
  }));
}
test('homepage draw link opens tarot directly, including without JavaScript', () => {
  const links = nav(read('index.html'), '主要导航');
  const draw = links.filter(a => a.text.includes('抽签'));
  assert.equal(draw.length, 1);
  assert.equal(draw[0].href, 'tarot.html');
  assert.ok(!links.some(a => a.href === 'lottery.html'));
});
for (const page of ['tarot.html','lottery.html']) {
  test(page+': tarot first, flavor second, current page identified truthfully', () => {
    const links = nav(read(page), '抽签方式');
    assert.deepEqual(links.map(a => a.href), ['tarot.html','lottery.html']);
    assert.deepEqual(links.filter(a => a.current).map(a => a.href), [page]);
  });
}
test('flavor remains an explicit usable page, not a redirect or removed quiz', () => {
  const html = read('lottery.html');
  assert.match(html, /<title>风味签 · 时令风物<\/title>/);
  assert.match(html, /id="begin"[^>]*>开始风味签/);
  assert.match(html, /id="question-form"/);
  assert.match(html, /id="calendar-open"/);
  assert.doesNotMatch(html, /http-equiv=["']refresh|location\.(?:replace|assign)/i);
});
test('tarot still exposes shuffle, cut, draw and three-card reveal', () => {
  const html = read('tarot.html');
  for (const id of ['shuffle','cut-stage','draw-stage','read-spread','result-tableau'])
    assert.ok(html.includes('id="'+id+'"'), id);
  for (const asset of ['tarot-spread.js','tarot-spread-ui.js','tarot-spread.css'])
    assert.ok(html.includes(asset), asset);
});
test('internal view binding never intercepts the external draw link', () => {
  const binding = read('app.js').split('\n').find(s => s.includes('forEach(b=>b.onclick=()=>setView(b.dataset.view))'));
  assert.ok(binding);
  const button = { dataset: { view: 'map' } }, link = { dataset: {} }, calls = [];
  const document = { querySelectorAll: selector => selector === '.nav-item[data-view]' ? [button] : [button, link] };
  vm.runInNewContext(binding, { document, setView: view => calls.push(view) });
  assert.equal(link.onclick, undefined);
  button.onclick();
  assert.deepEqual(calls, ['map']);
});
test('both mode links and homepage draw work under root and compatible preview paths', () => {
  for (const base of ['https://randomclb.github.io/seasonal-flavors-atlas/', 'https://randomclb.github.io/seasonal-flavors-atlas/preview/v1.1/']) {
    for (const page of ['tarot.html','lottery.html'])
      for (const link of nav(read(page), '抽签方式'))
        assert.equal(new URL(link.href, base+page).href, base+link.href);
    assert.equal(new URL(nav(read('index.html'), '主要导航')[0].href, base+'index.html').href, base+'tarot.html');
  }
});
test('updated homepage loads the scoped navigation binding with a new cache key', () => {
  assert.match(read('index.html'), /src="app\.js\?v=food-share1"/);
});
