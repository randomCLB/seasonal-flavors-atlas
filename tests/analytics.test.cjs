'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const {inject, prepare} = require('../scripts/prepare-analytics.cjs');
const code = fs.readFileSync(path.join(__dirname, '../dist/analytics.js'), 'utf8');

function browser(options = {}) {
  const requests = [], listeners = new Map();
  const document = {
    currentScript: {getAttribute: () => options.siteCode ?? 'test-site'},
    referrer: options.referrer ?? 'https://example.org/article?email=secret#private',
    title: '时令风物', visibilityState: options.visibility ?? 'visible',
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name)
  };
  const window = {
    fetch: (url, init) => {
      if (options.throwFetch) throw new Error('blocked');
      requests.push({url: new URL(url), init});
      return options.rejectFetch ? Promise.reject(new Error('offline')) : Promise.resolve({type: 'opaque'});
    }
  };
  window.self = window;
  window.top = options.frame ? {} : window;
  if (options.noFetch) delete window.fetch;
  const context = vm.createContext({window, document, URL, URLSearchParams, Math,
    navigator: options.navigator || {},
    location: {href: options.url || 'https://randomclb.github.io/seasonal-flavors-atlas/'}
  });
  const run = () => vm.runInContext(code, context);
  run();
  return {requests, document, listeners, run};
}

test('one beacon, no credentials, no HTTP referrer, domain-only source', () => {
  const {requests} = browser();
  assert.equal(requests.length, 1);
  const {url, init} = requests[0];
  assert.equal(url.origin, 'https://test-site.goatcounter.com');
  assert.equal(url.pathname, '/count');
  assert.equal(url.searchParams.get('r'), 'https://example.org');
  assert.equal(init.credentials, 'omit');
  assert.equal(init.referrerPolicy, 'no-referrer');
  assert.equal(init.mode, 'no-cors');
});
test('no query/hash/personal share data is sent', () => {
  const {url} = browser({url: 'https://randomclb.github.io/seasonal-flavors-atlas/index.html?email=a@b.com&share=SECRET&q=allergy#private'}).requests[0];
  assert.equal(url.searchParams.get('p'), '/seasonal-flavors-atlas/');
  assert.equal(url.searchParams.get('q'), null);
  assert.ok(!url.href.includes('SECRET'));
  assert.ok(!url.href.includes('allergy'));
});
test('safe campaign label is preserved without other query parameters', () => {
  const {url} = browser({url: 'https://randomclb.github.io/seasonal-flavors-atlas/?utm_source=wechat&email=secret'}).requests[0];
  assert.equal(url.searchParams.get('q'), 'utm_source=wechat');
  assert.ok(!url.href.includes('secret'));
});
test('unsafe or long campaign labels are dropped', () => {
  for (const source of ['a@b.com', 'https://secret.example', 'x'.repeat(41)]) {
    assert.equal(browser({url: 'https://randomclb.github.io/seasonal-flavors-atlas/?utm_source=' + encodeURIComponent(source)}).requests[0].url.searchParams.get('q'), null);
  }
});
test('direct and internal referrals do not invent an external source', () => {
  for (const referrer of ['', 'bad url', 'javascript:alert(1)', 'https://randomclb.github.io/seasonal-flavors-atlas/tarot.html']) {
    assert.equal(browser({referrer}).requests[0].url.searchParams.get('r'), '');
  }
});
test('all production entry pages are countable', () => {
  for (const page of ['index.html', 'tarot.html', 'lottery.html', 'credits.html']) {
    assert.equal(browser({url: 'https://randomclb.github.io/seasonal-flavors-atlas/' + page}).requests.length, 1);
  }
});
test('development, preview, other sites and insecure pages are excluded', () => {
  for (const url of ['http://localhost:8766/', 'file:///tmp/index.html',
    'https://randomclb.github.io/seasonal-flavors-atlas/preview/v1.1/',
    'https://randomclb.github.io/another-site/', 'https://example.com/seasonal-flavors-atlas/',
    'http://randomclb.github.io/seasonal-flavors-atlas/']) assert.equal(browser({url}).requests.length, 0);
});
test('Do Not Track, GPC, automation, frames and owner opt-out are respected', () => {
  for (const options of [{navigator: {doNotTrack: '1'}}, {navigator: {globalPrivacyControl: true}},
    {navigator: {webdriver: true}}, {frame: true}, {noFetch: true},
    {url: 'https://randomclb.github.io/seasonal-flavors-atlas/?analytics=off'}]) {
    assert.equal(browser(options).requests.length, 0);
  }
});
test('empty or malformed site codes never send requests', () => {
  for (const siteCode of ['', 'https://test.goatcounter.com', 'x/y', 'x\" onload=\"bad', '-foo', 'a'.repeat(64)]) {
    assert.equal(browser({siteCode}).requests.length, 0);
  }
});
test('hidden document waits for visibility, then removes its listener', () => {
  const b = browser({visibility: 'hidden'});
  assert.equal(b.requests.length, 0);
  b.document.visibilityState = 'visible';
  b.listeners.get('visibilitychange')();
  assert.equal(b.requests.length, 1);
  assert.equal(b.listeners.size, 0);
});
test('duplicate execution does not double-count', () => {
  const b = browser(); b.run();
  assert.equal(b.requests.length, 1);
});
test('synchronous and asynchronous network failure are isolated', async () => {
  assert.doesNotThrow(() => browser({throwFetch: true}));
  browser({rejectFetch: true});
  await new Promise(resolve => setImmediate(resolve));
});
test('integration has no cookies, persistent identifiers, UI or third-party JS', () => {
  for (const pattern of [/localStorage/, /sessionStorage/, /document\.cookie/, /createElement/, /innerHTML/, /gc\.zgo\.at/]) {
    assert.doesNotMatch(code, pattern);
  }
});
test('empty config leaves uninstrumented HTML byte-identical', () => {
  const html = '<html><body>Original page</body></html>';
  assert.equal(inject(html, ''), html);
});
test('build adds only an invisible deferred script', () => {
  const html = inject('<html><body>Original page</body></html>', 'test-site');
  assert.ok(html.includes('Original page'));
  assert.ok(html.includes('<script defer src="analytics.js?v=1" data-site="test-site"></script>'));
  assert.doesNotMatch(html, /iframe|counter-widget|<img/);
});
test('build is idempotent and changing the site replaces the old code', () => {
  const original = '<html><body>Original page\n</body></html>';
  const first = inject(original, 'test-site');
  assert.equal(inject(first, 'test-site'), first);
  const changed = inject(first, 'new-site');
  assert.equal((changed.match(/data-site=/g) || []).length, 1);
  assert.ok(!changed.includes('test-site'));
});
test('disabling removes the injected script', () => {
  assert.ok(!inject(inject('<html><body>Hello</body></html>', 'test-site'), '').includes('analytics.js'));
});
test('invalid config and ambiguous HTML are rejected', () => {
  assert.throws(() => inject('<body></body>', 'bad\"site'));
  assert.throws(() => inject('<html>Hello</html>', 'test-site'));
  assert.throws(() => inject('<body></body></body>', 'test-site'));
});
test('build covers every top-level HTML page without modifying JS or nested previews', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fengwu-analytics-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.mkdirSync(path.join(root, 'dist/preview'), {recursive: true});
  fs.writeFileSync(path.join(root, 'analytics.config.json'), '{"siteCode":"test-site"}');
  for (const page of ['index.html', 'tarot.html', 'lottery.html', 'credits.html']) fs.writeFileSync(path.join(root, 'dist', page), '<body>Hello</body>');
  fs.writeFileSync(path.join(root, 'dist/app.js'), '/* untouched */');
  fs.writeFileSync(path.join(root, 'dist/preview/index.html'), '<body>Preview</body>');
  assert.deepEqual(prepare(root), {enabled: true, pages: 4});
  assert.equal(fs.readFileSync(path.join(root, 'dist/app.js'), 'utf8'), '/* untouched */');
  assert.equal(fs.readFileSync(path.join(root, 'dist/preview/index.html'), 'utf8'), '<body>Preview</body>');
});
