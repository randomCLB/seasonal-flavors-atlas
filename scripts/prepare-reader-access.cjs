"use strict";
const fs=require('node:fs'),path=require('node:path');const root=path.join(__dirname,'..');
function patch(file,from,to){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(s.includes(to))return;if(s.split(from).length!==2)throw Error(file+': reader-access anchor '+from.slice(0,80));fs.writeFileSync(p,s.replace(from,to));}
for(const name of ['index.html','tarot.html','lottery.html']){
 const p=path.join(root,'dist',name);let h=fs.readFileSync(p,'utf8');
 if(!h.includes('src="reader-access.js')){const defer=name==='index.html'?'':' defer',tag=['reader-media-additions','reader-access','food-media'].map(n=>`<script src="${n}.js?v=20261024-access1"${defer}></script>`).join('');h=h.replace('<script src="food-purchase.js',tag+'<script src="food-purchase.js');}
 if(!h.includes('href="reader-access.css'))h=h.replace('</head>','<link rel="stylesheet" href="reader-access.css?v=20261024-access1">\n</head>');
 h=h.replace(/src="((?:app|food-records|food-detail|food-purchase|lottery-ui|tarot-spread-ui|season-selection)\.js[^\"]*)"/g,(all,url)=>`src="${/[?&]access=/.test(url)?url:url+(url.includes('?')?'&':'?')+'access=20261024-1'}"`);
 if(name==='index.html'&&!h.includes('class="media-build"'))h=h.replace('</footer>','<small class="media-build">食材与图片版 2026.10.24-access.1</small></footer>');fs.writeFileSync(p,h);
}
patch('dist/app.js','const pool=term=>rankSeasonFoods(chinaParts(new Date(term.time+86400000)).month,term);','const pool=term=>rankSeasonFoods(chinaParts(new Date(term.time+86400000)).month,term).filter(f=>!window.FoodMedia||window.FoodMedia.hasIngredient(f));');
patch('dist/app.js','matches.map(f=>`<button data-food="${f.id}"><span>','matches.map(f=>`<button data-food="${f.id}">${foodThumbnail(f)?`<img class="search-food-photo" src="${foodThumbnail(f)}" alt="${f.name}" loading="lazy" decoding="async">`:\'<span class="search-food-placeholder">图待补</span>\'}<span>');
const gate="if(window.ReaderAccess&&!window.ReaderAccess.visible(window.FOODS.find(f=>f.id===id)||{id,category:'seafood'})){const url=new URL(location.href);url.searchParams.delete('food');history.replaceState({},'',url);$('detailContent').innerHTML='<section class=\"reader-withdrawn\"><h1>这条风物已撤下</h1><p>从全年目录继续找食材。</p><button type=\"button\" id=\"withdrawnDirectory\">打开全年目录</button></section>';if(!$('detailDialog').open)$('detailDialog').showModal();$('withdrawnDirectory').onclick=()=>{$('detailDialog').close();$('searchTrigger').click()};return;}";
patch('dist/app.js','if(deepLink&&byId[deepLink])openFood(deepLink,false);','if(deepLink&&byId[deepLink])openFood(deepLink,false);else if(deepLink){(function(id){'+gate+'})(deepLink)}');
// Credits use the pinned local image manifest, including transformation descriptions.
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/READER_MEDIA_20261024.json'),'utf8'));
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let credits=fs.readFileSync(path.join(root,'dist/credits.html'),'utf8').replace(/<section id="reader-media-credits">[\s\S]*?<\/section>/,'');
const block='<section id="reader-media-credits"><h2>食材图片补充 · 2026-10-24</h2>'+manifest.map(p=>`<article><h3>${esc(p.subject)}</h3><p>${esc(p.artist)} · <a href="${esc(p.licenseUrl||p.source)}">${esc(p.license)}</a></p><p>${esc(p.modifications)}</p><a href="${esc(p.source)}">原文件与完整署名 ↗</a></article>`).join('')+'</section>';
fs.writeFileSync(path.join(root,'dist/credits.html'),credits.replace('</main>',block+'</main>'));
for(const p of manifest){const bytes=fs.readFileSync(path.join(root,'dist',p.path));if(require('node:crypto').createHash('sha256').update(bytes).digest('hex')!==p.sha256)throw Error('Local media changed: '+p.path);}
console.log('Prepared public access and shared media',manifest.length);
