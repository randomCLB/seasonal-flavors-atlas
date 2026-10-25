'use strict';
/* Reproducible reading integration, preserving the existing terrain and navigation. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
function replace(file,from,to){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(s.includes(to))return;if(s.split(from).length!==2)throw Error(`${file}: expected one integration anchor: ${from.slice(0,95)}`);fs.writeFileSync(p,s.replace(from,to));}
function range(file,start,end,replacement){const p=path.join(root,file),s=fs.readFileSync(p,'utf8');if(s.includes(replacement))return;const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0)throw Error(`${file}: missing bounded integration anchor`);fs.writeFileSync(p,s.slice(0,a)+replacement+s.slice(b));}
const loader='<script src="reader-copy.js?v=reader-20261023-1"></script><script src="reader-copy-curation.js?v=reader-20261023-1"></script>';
for(const page of ['index.html','tarot.html','lottery.html']){
 const file='dist/'+page,p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
 if(!s.includes('src="reader-copy.js')){const anchor=s.match(/<script\b[^>]*\bsrc="food-purchase\.js[^\"]*"[^>]*><\/script>/)?.[0];if(!anchor)throw Error(file+': missing purchase module');s=s.replace(anchor,loader+anchor);}
 for(const script of ['app.js','food-detail.js','food-purchase.js','tarot-spread-ui.js','lottery-ui.js'])s=s.replace(new RegExp('src="('+script.replace('.','\\.')+'(?:\\?[^\"]*)?)"','g'),(all,url)=>`src="${/[?&]reader=/.test(url)?url.replace(/([?&])reader=[^&"]*/,'$1reader=20261024-1'):url+(url.includes('?')?'&':'?')+'reader=20261024-1'}"`);
 s=s.replace(/<small class="build-version reader-build">[^<]*<\/small>/g,'<small class="build-version reader-build">文案版 2026.10.24-depth.1</small>');
 if(page==='index.html'&&!s.includes('文案版 2026.10.24-depth.1'))s=s.replace('</footer>','<small class="build-version reader-build">文案版 2026.10.24-depth.1</small></footer>');
 s=s.replace('展开两人份做法与注意事项','展开做法与注意事项');fs.writeFileSync(p,s);
}
replace('dist/app.js','const foods=window.FOODS;','const readerCatalogData=window.ReaderAccess?window.ReaderAccess.filter(window.FOODS):window.FOODS;const foods=window.ReaderCopy ? readerCatalogData.map(f=>window.ReaderCopy.view({...f,...window.EDITORIAL_DETAILS?.[f.id]})) : readerCatalogData;');
range('dist/app.js','const originDetails=food=>','const chinaParts=',`const originDetails=food=>food.placeSeasons.length<2?'':\`<div class="origin-details"><h3>各地产期</h3>\${food.placeSeasons.map((place,index)=>\`<article><h4>\${place.name}</h4><p><strong>时令</strong> · \${place.seasonNote||(food.id==='wenzhou-pancai'?['一月下旬起采收，冬批至二月。','九月采收，秋批至十月。'][index]:'')||formatMonths(place.months)}</p>\${place.flavorNote?\`<p><strong>产区风味</strong> · \${place.flavorNote}</p>\`:''}<p class="state-note"><a href="\${place.source}" target="_blank" rel="noopener">时令来源 ↗</a>\${place.flavorSource?\` · <a href="\${place.flavorSource}" target="_blank" rel="noopener">查看风味来源 ↗</a>\`:''}</p></article>\`).join('')}</div>\`;
`);
replace('dist/app.js',"${x.food.placeSeasons.length>1?`<small>${x.place.flavorNote||'产区风味差异待补充'}</small>`:''}","${x.place.flavorNote?`<small>${x.place.flavorNote}</small>`:''}");
replace('dist/app.js',"${f.alias.join(' · ')} · ${f.taste}","${[...f.alias,...f.flavor].filter(Boolean).slice(0,4).join(' · ')}");
replace('dist/tarot-spread-ui.js','const f=byId[r.foodId];result=r;','const f=window.ReaderCopy.view({...byId[r.foodId],...window.EDITORIAL_DETAILS?.[r.foodId]});result=r;');
replace('dist/tarot-spread-ui.js',"$('dish-sensory').textContent=f.dishCaption||f.short||'';","$('dish-sensory').textContent=f.short||'';");
replace('dist/tarot-spread-ui.js',"$('season-note').textContent=`时令线索：${f.season} 当前推荐依据产地记录，不代表库存或当年成熟日已确认。`;","$('season-note').textContent=f.seasonLabel||'';");
replace('dist/tarot-spread-ui.js',"$('recipe-ingredients').textContent=`准备（2 人份）：${f.ingredients}`;","$('recipe-ingredients').textContent=f.ingredients?`准备：${f.ingredients}`:'';$('recipe-ingredients').hidden=f.eatingMode==='fresh'||!f.ingredients;");
replace('dist/tarot-spread-ui.js',"$('recipe-finish').textContent=`做到什么程度：${f.finish||'以完整食谱的熟制要求为准。'}`;","$('recipe-finish').textContent=f.finish?`做到什么程度：${f.finish}`:'';$('recipe-finish').hidden=f.eatingMode==='fresh'||!f.finish;");
replace('dist/tarot-spread-ui.js',"$('recipe-storage').textContent=`带回家后：${f.storage||'按实际商品说明保存，尽快安排食用。'}`;","$('recipe-storage').textContent=f.storage?`带回家后：${f.storage}`:'';$('recipe-storage').hidden=!f.storage;");
replace('dist/tarot-spread-ui.js',"购买前确认实际商品配料和到货鲜度；本站不确认商品的过敏原交叉接触。","购买前核对商品配料和到货鲜度；食物过敏者还应向商家确认过敏原交叉接触风险。");
replace('dist/tarot-spread-ui.js',"原抽签日期：${r.day}。时令是当时的产地线索，不表示现在有货或适合你的忌口。","原抽签日期：${r.day}。购买时确认当季供应，并按自己的忌口核对配料。");
replace('dist/lottery-ui.js','const f=byId[s.foodId],p=profiles[f.id],media=window.FoodMedia?.ingredient(f);','const f=window.ReaderCopy.view({...byId[s.foodId],...window.EDITORIAL_DETAILS?.[s.foodId]}),p=profiles[f.id],media=window.FoodMedia?.ingredient(f);');
replace('dist/lottery-ui.js','const reason=plan.shared?s.recommendation:C.recommendationReason(f,p,plan.prefs);','const reason=plan.shared?s.recommendation:C.recommendationReason(byId[s.foodId],p,plan.prefs);');
replace('dist/lottery-ui.js',"时令精度：${s.precision==='season'?'季节级近似':'月度或旬段参考'}，不保证该日正好上市。","产区时段：${s.precision==='season'?'季节参考':'月份或旬段参考'}。");
require('./prepare-catalog-quality.cjs');
require('./prepare-reader-access.cjs');
require('./prepare-visual-standard.cjs');
const version='2026.10.24-depth.1';
fs.writeFileSync(path.join(root,'dist','build-info.json'),JSON.stringify({siteCommit:process.env.RELEASE_SHA||process.env.GITHUB_SHA||'local',readerVersion:version,accessVersion:'2026.10.24-access.1',visualVersion:'2026.10.25-visual.2',catalogCount:require('./audit-reader-copy.cjs').load().FOODS.length},null,2)+'\n');
console.log('Prepared reader integration',version);
