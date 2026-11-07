'use strict';
const fs = require('node:fs');
const path = require('node:path');
const BEGIN = '<!-- fengwu-analytics:start -->';
const END = '<!-- fengwu-analytics:end -->';

function inject(html, siteCode) {
  const block = /\n?<!-- fengwu-analytics:start -->[\s\S]*?<!-- fengwu-analytics:end -->\n?/g;
  const clean = html.replace(block, '\n');
  if (!siteCode) return clean;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(siteCode)) {
    throw new Error('Invalid GoatCounter siteCode: use the account slug, not a URL or API key.');
  }
  if ((clean.match(/<\/body>/gi) || []).length !== 1) {
    throw new Error('Expected exactly one closing body tag for analytics integration.');
  }
  const tag = `${BEGIN}\n<script defer src="analytics.js?v=1" data-site="${siteCode}"></script>\n${END}\n`;
  return clean.replace(/<\/body>/i, tag + '</body>');
}

function prepare(root = path.join(__dirname, '..')) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'analytics.config.json'), 'utf8'));
  if (typeof config.siteCode !== 'string') throw new Error('analytics.config.json needs a string siteCode.');
  const dist = path.join(root, 'dist');
  // Validate all pages before writing any of them. Only deployed HTML is changed.
  const changes = fs.readdirSync(dist).filter(name => name.endsWith('.html')).map(name => {
    const file = path.join(dist, name);
    return [file, inject(fs.readFileSync(file, 'utf8'), config.siteCode)];
  });
  for (const [file, content] of changes) fs.writeFileSync(file, content);
  console.log(`Analytics ${config.siteCode ? 'configured' : 'disabled (no account)'}; ${changes.length} pages prepared.`);
  return {enabled: Boolean(config.siteCode), pages: changes.length};
}

module.exports = {inject, prepare};
if (require.main === module) prepare();
