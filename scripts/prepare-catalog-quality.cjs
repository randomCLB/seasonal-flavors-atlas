'use strict';
/* Targeted integration into the existing static app. Each transformation is idempotent. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
function replace(file,from,to){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(s.includes(to))return;if(s.split(from).length!==2)throw Error(file+': catalog integration anchor missing: '+from.slice(0,90));fs.writeFileSync(p,s.replace(from,to));}
const controls='<nav class="catalog-scope" aria-label="选择浏览范围"><button type="button" id="curatedScope" aria-pressed="true">当季精选</button><button type="button" id="allSeasonScope" aria-pressed="false">全部当季</button><button type="button" id="catalogDirectory">全年风物目录 ↗</button></nav>';
replace('dist/index.html','<nav id="categoryFilter"',controls+'\n        <nav id="categoryFilter"');
for(const page of ['index.html','tarot.html','lottery.html']){
 const p=path.join(root,'dist',page);let s=fs.readFileSync(p,'utf8');
 if(!s.includes('src="catalog-photos.js'))s=s.replace('<script src="reader-copy.js','<script src="catalog-photos.js?v=20261024-1"></script><script src="reader-copy.js');
 if(!s.includes('src="reader-depth.js'))s=s.replace(/(<script src="reader-copy-curation\.js[^\"]*"><\/script>)/,'$1<script src="reader-depth.js?v=20261024-1"></script>');
 if(!s.includes('href="catalog-quality.css'))s=s.replace('</head>','<link rel="stylesheet" href="catalog-quality.css?v=20261024-1">\n</head>');
 if(page!=='index.html')s=s.replace(/<script src="((?:catalog-photos|reader-copy|reader-copy-curation|reader-depth)\.js[^"]*)"[^>]*><\/script>/g,'<script src="$1" defer></script>');
 s=s.replace(/src="(season-selection\.js)(?:\?[^\"]*)?"/g,'src="$1?v=catalog-depth-20261024-1"');fs.writeFileSync(p,s);
}
replace('dist/app.js',"let selectedCategory='all',", "let catalogScope='curated';\nlet selectedCategory='all',");
replace('dist/app.js','const list=seasonFoodsFor(selectedTerm).slice();',"const list=(catalogScope==='all'?rankSeasonFoods(foodMonth,selectedTerm):seasonFoodsFor(selectedTerm)).slice();");
replace('dist/app.js',"$('seasonHeading').textContent=`${termNames[selectedTerm.index]}的当季精选 · ${visibleList.length} 味`;", "$('seasonHeading').textContent=`${termNames[selectedTerm.index]}的${catalogScope==='all'?'全部当季':'当季精选'} · ${visibleList.length} 味`;\n for(const [id,scope]of [['curatedScope','curated'],['allSeasonScope','all']]){const button=$(id);if(button){button.setAttribute?.('aria-pressed',String(catalogScope===scope));button.onclick=()=>{catalogScope=scope;renderSeason()};}}\n if($('catalogDirectory'))$('catalogDirectory').onclick=()=>$('searchTrigger').onclick();");
replace('dist/app.js',"'<div class=\"season-list-image-empty\" aria-label=\"实拍待补\" role=\"img\"></div>'", "`<button class=\"ingredient-text-cover\" data-food=\"${food.id}\"><span>${foodCategoryLabel(food)}</span><strong>${food.name}</strong><small>食材图待补 · 先看挑选与做法 ↗</small></button>`");
replace('dist/app.js','<p>${food.short}</p><button data-food=', '<p>${food.short}</p>${window.SeasonSelection.variants(food,foods).length?`<button class="family-entry" data-food="${food.id}">同类产地与时段 · ${window.SeasonSelection.variants(food,foods).length+1} 条 ↗</button>`:\'\'}<button data-food=');
replace('dist/app.js',"function foodThumbnail(food){return food.cardImage||food.image||''}","function foodThumbnail(food){return foodVisual(food).src||''}");
replace('dist/app.js',"originHtml:originDetails(f),similar:relatedFoods(f)","originHtml:originDetails(f),variants:window.SeasonSelection.variants(f,foods),similar:relatedFoods(f)");
replace('dist/app.js','const unique=[...new Map(group.map(x=>[`${x.food.id}|${x.place.name}`,x])).values()];','const unique=[...new Map(group.map(x=>[`${x.food.id}|${x.place.name}`,x])).values()];const clusters=typeof window!==\'undefined\'&&window.SeasonSelection?Object.values(Object.groupBy(unique,x=>window.SeasonSelection.group(x.food))):unique.map(x=>[x]);');
replace('dist/app.js',"${unique.map(x=>`<button data-food=", "${clusters.map(items=>{const x=items[0];return `<div class=\"map-family\"><button data-food=");
replace('dist/app.js',"</span></button>`).join('')}</div><button class=\"map-popover-zoom\">", "</span></button>${items.length>1?`<details><summary>同类产地与时段 · ${items.length} 条</summary>${items.slice(1).map(y=>`<button data-food=\"${y.food.id}\"><span><strong>${y.food.name}</strong><small>${y.place.name} · ${formatMonths(y.place.months)}</small></span></button>`).join('')}</details>`:''}</div>`}).join('')}</div><button class=\"map-popover-zoom\">");
replace('dist/app.js','new Set(group.map(x=>x.food.id)).size','new Set(group.map(x=>window.SeasonSelection.group(x.food))).size');
replace('dist/app.js',"mapGroups=mapFocus?visible.map(x=>[x]):clusterPlaces(visible);","mapGroups=clusterPlaces(visible);");
const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manifest=require('../docs/CATALOG_PHOTOS_20261024.json');
const block='<section id="catalog-photo-credits"><h2>补充食材实拍 · 2026-10-24</h2>'+manifest.map(p=>`<article><h3>${esc(p.subject)}</h3><p>${esc(p.artist)} · <a href="${esc(p.licenseUrl||p.source)}">${esc(p.license)}</a></p><p>${esc(p.modifications)}；同类形态参考。</p><a href="${esc(p.source)}">原文件与完整署名 ↗</a></article>`).join('')+'</section>';
const credits=path.join(root,'dist','credits.html');let text=fs.readFileSync(credits,'utf8').replace(/<section id="catalog-photo-credits">[\s\S]*?<\/section>/,'');if(!text.includes('id="catalog-photo-credits"')){if(!text.includes('</main>'))throw Error('Credits insertion point missing');fs.writeFileSync(credits,text.replace('</main>',block+'</main>'));}
execFileSync(process.execPath,[path.join(__dirname,'install-catalog-photos.cjs')],{stdio:'inherit'});
