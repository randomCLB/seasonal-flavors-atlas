/* Optional reading sections; canonical catalog and specific safety instructions remain intact. */
(function(root){
 'use strict';
 const esc=value=>root.FoodPurchase.esc(value);
 const text=value=>typeof value==='string'?value.trim():'';
 function html(food,{recognition,seasonLabel,category,originHtml,similar=[],imageAttrs=''}){
  const merged={...food,...root.EDITORIAL_DETAILS?.[food.id]};
  const f=root.ReaderCopy?root.ReaderCopy.view(merged):merged,fresh=f.eatingMode==='fresh';
  const shown=new Set();
  const paragraph=(value,cls='')=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<p${cls?` class="${cls}"`:''}>${esc(t)}</p>`;};
  const labeled=(label,value,cls='')=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<p${cls?` class="${cls}"`:''}><strong>${esc(label)}</strong> · ${esc(t)}</p>`;};
  let number=0;
  const section=(title,body,id='')=>body?`<details class="reader-section"${id?` id="${id}"`:''}><summary><span>${String(++number).padStart(2,'0')}</span><h2>${esc(title)}</h2><span aria-hidden="true">＋</span></summary><div class="reader-content">${body}</div></details>`:'';
  const lead=paragraph(f.short||f.taste,'reader-expectation'),state=paragraph(f.state,'reader-state');
  const senses=[['味道',f.taste],['香气',f.aroma],['质地',f.texture]].map(([label,value])=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<div><dt>${label}</dt><dd>${esc(t)}</dd></div>`;}).join('');
  const sensory=(senses?`<dl class="sensory">${senses}</dl>`:'')+paragraph(f.intro||f.description)+paragraph(f.comparison?.text);
  const buy=[f.buy,f.buyDetail,f.procurement?.route,f.market].map(value=>paragraph(value)).join('');
  const storageText=paragraph(f.storage),storage=storageText?`<h3>带回家以后</h3>${storageText}`:'';
  const steps=(Array.isArray(f.steps)?f.steps:[]).filter(value=>text(value));
  const edible=f.dishImage||f.cutImage;
  const hasEdible=edible&&edible!==recognition.src&&!f.tarotImage?.kind?.match(/ingredient|fresh/);
  const secondary=hasEdible?`<figure class="reader-dish" tabindex="0" aria-label="成菜图片说明"><img src="${esc(edible)}" alt="${esc(f.dishImageAlt||f.cutImageAlt||f.name)}" loading="lazy"><figcaption>${esc(f.dishCaption||f.cutCaption||'成菜参考')}${/generated|示意/.test(edible)?' · 生成示意':''}</figcaption></figure>`:'';
  const recipe=steps.length?(text(f.recipeTitle)?`<h3>${esc(f.recipeTitle)}</h3>`:'')+(!fresh?labeled('准备',f.ingredients):'')+`<ol class="recipe-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+(!fresh?labeled('做到什么程度',f.finish)+labeled('最容易失手',f.pitfall)+paragraph(f.kitchen)+labeled('搭配',f.pair,'pair-note'):'')+secondary+`<a class="bilibili-recipe-link" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(f.name)}" target="_blank" rel="noopener noreferrer">去 B 站搜索“${esc(f.name)}” ↗</a>`:'';
  const sourceEntries=[...(f.sources||[])];
  const comparisonSource=merged.comparison?.source||f.readerExtraSource;
  if(comparisonSource&&!sourceEntries.some(([,url])=>url===comparisonSource))sourceEntries.push(['品种与食用部位',comparisonSource]);
  const origins=paragraph(f.season)+paragraph(f.seasonPhase?.note)+paragraph(f.place)+paragraph(f.context)+(originHtml||'')+(sourceEntries.length?`<ol class="reader-sources">${sourceEntries.map(([title,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a></li>`).join('')}</ol>`:'');
  const recipeLink=recipe?`<button type="button" class="reader-recipe-button" data-food="${esc(f.id)}" data-recipe="true">${fresh?'怎么吃':'看做法'} <span aria-hidden="true">↓</span></button>`:'';
  return `<div class="reader-overview"><figure class="reader-portrait" tabindex="0" aria-label="食材图片说明">${recognition.src?`<img src="${esc(recognition.src)}" alt="${esc(recognition.alt)}" ${imageAttrs} style="object-fit:${recognition.fit}" loading="eager">`:''}<figcaption>${esc(recognition.note)} · <a href="credits.html">图片出处 ↗</a></figcaption></figure><div class="reader-lead"><p class="reader-kicker">${esc(category)} · ${esc(f.region)}</p><h1>${esc(f.name)}</h1>${text(f.seasonLabel||seasonLabel)?`<p class="reader-season">${esc(f.seasonLabel||seasonLabel)}</p>`:''}${lead}${state}<div class="reader-actions">${root.FoodPurchase.render(f)}${recipeLink}</div>${root.FoodRecords.render(f)}</div></div>
   ${text(f.safety)?`<aside class="reader-safety"><strong>入口前先留意</strong><p>${esc(f.safety)}</p></aside>`:''}
   <div class="reader-sections">${section('风味与区别',sensory)}${section('挑选、获取与保存',buy+storage,'foodBuying')}${section(fresh?'怎么吃':'家常做法',recipe,'foodRecipe')}${section('来处、时令与来源',origins)}</div>
   ${similar.length?`<section class="reader-next"><p class="detail-num">相近风味</p><h2>和它风味相近的，还有哪些？</h2><div>${similar.map(({food:other,why})=>`<button data-food="${esc(other.id)}"><strong>${esc(other.name)}</strong><span>${esc(why)} ↗</span></button>`).join('')}</div></section>`:''}`;
 }
 root.FoodDetail={html};
})(window);
