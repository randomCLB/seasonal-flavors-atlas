"use strict";
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),version='2026.10.24-visual.1';
for(const name of ['index.html','tarot.html','lottery.html']){
 const p=path.join(root,'dist',name);let h=fs.readFileSync(p,'utf8');
 if(!h.includes('src="visual-standard.js')){const defer=name==='index.html'?'':' defer';h=h.replace('<script src="food-media.js',`<script src="visual-standard.js?v=20261024-visual1"${defer}></script><script src="food-media.js`);}
 if(!h.includes('href="visual-standard.css'))h=h.replace('</head>','<link rel="stylesheet" href="visual-standard.css?v=20261024-visual1">\n</head>');
 h=h.replace(/src="((?:app|food-media|food-detail)\.js[^"]*)"/g,(all,url)=>`src="${/[?&]visual=/.test(url)?url:url+(url.includes('?')?'&':'?')+'visual=20261024-1'}"`);
 if(name==='index.html'&&!h.includes('class="visual-build"'))h=h.replace('</footer>',`<small class="visual-build">影像版 ${version}</small></footer>`);
 fs.writeFileSync(p,h);
}
const appPath=path.join(root,'dist/app.js');let app=fs.readFileSync(appPath,'utf8');
for(const [old,replacement]of [["style=\"object-fit:${visual.heroFit}\"", "data-photo-role=\"${visual.scene||'whole-ingredient'}\" style=\"object-fit:${visual.heroFit};object-position:${visual.position||'50% 50%'}\""], ["style=\"object-fit:${media.fit}\"", "data-photo-role=\"${media.scene||'whole-ingredient'}\" style=\"object-fit:${media.fit};object-position:${media.position||'50% 50%'}\""]]){if(!app.includes(replacement)){if(app.split(old).length!==2)throw Error('Image focus anchor missing');app=app.replace(old,replacement);}}
fs.writeFileSync(appPath,app);
const tarotPath=path.join(root,'dist/tarot-spread-ui.js');let tarot=fs.readFileSync(tarotPath,'utf8');
tarot=tarot.replace("media.kind==='fresh'?'今日命定味 · 鲜果参考'","['fresh','fruit-cut'].includes(media.kind)?'今日命定味 · 果切参考'");fs.writeFileSync(tarotPath,tarot);
const manifest=require('../docs/VISUAL_MEDIA_20261024.json');
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const m of manifest){const p=path.join(root,'dist',m.path);if(!fs.existsSync(p)||crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==m.sha256)throw Error('Reviewed visual file changed: '+m.path);}
const creditsPath=path.join(root,'dist/credits.html');let h=fs.readFileSync(creditsPath,'utf8').replace(/<section id="visual-media-credits">[\s\S]*?<\/section>/,'');
const block='<section id="visual-media-credits"><h2>植株与上桌图 · 2026-10-24</h2>'+manifest.map(m=>`<article><h3>${esc(m.subject)}</h3><p>${esc(m.artist)} ${esc(m.license)}${m.rightsNote?' · '+esc(m.rightsNote):''}</p><p>${esc(m.modifications)}</p><a href="${esc(m.source)}" target="_blank" rel="noopener noreferrer">原图及署名 ↗</a></article>`).join('')+'</section>';
fs.writeFileSync(creditsPath,h.replace('</main>',block+'</main>'));
console.log('Prepared explicit plant-to-plate roles',version,manifest.length);
