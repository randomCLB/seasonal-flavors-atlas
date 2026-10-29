/* Optional reading sections; canonical catalog and specific safety instructions remain intact. */
(function(root){
 'use strict';
 const esc=value=>root.FoodPurchase.esc(value),text=value=>typeof value==='string'?value.trim():'';
 function html(food,{recognition,seasonLabel,category,originHtml,variants=[],similar=[],imageAttrs=''}){
  const merged={...food,...root.EDITORIAL_DETAILS?.[food.id]},reading=food.identityMembers&&root.IngredientIdentity?root.IngredientIdentity.reading(food):root.ReaderCopy?root.ReaderCopy.view(merged):merged,f={...reading},fresh=f.eatingMode==='fresh',shown=new Set();
  if(food.id==='guangning-lidong-ma-bamboo-shoot'){f.recipeTitle='蒜炒鲜麻竹笋';if(f.intro)f.intro=f.intro.replace('连江麻笋','鲜麻竹笋');}
  if(food.id==='taiwan-jialiao-bream'&&Array.isArray(f.steps))f.steps=f.steps.map(step=>step.replace('台湾北部沿海捕捞或养殖来源','具体捕捞或养殖来源'));
  const paragraph=(value,cls='')=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<p${cls?` class="${cls}"`:''}>${esc(t)}</p>`;};
  const labeled=(label,value,cls='')=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<p${cls?` class="${cls}"`:''}><strong>${esc(label)}</strong> · ${esc(t)}</p>`;};
  let number=0;
  const section=(title,body,id='')=>body?`<details class="reader-section"${id==='foodRecipe'?' open':''}${id?` id="${id}"`:''}><summary><span>${String(++number).padStart(2,'0')}</span><h2>${esc(title)}</h2><span aria-hidden="true">＋</span></summary><div class="reader-content">${body}</div></details>`:'';
  const lead=paragraph(f.short||f.taste,'reader-expectation'),state=paragraph(f.state,'reader-state');
  const senses=[['味道',f.taste],['香气',f.aroma],['质地',f.texture]].map(([label,value])=>{const t=text(value);if(!t||shown.has(t))return '';shown.add(t);return `<div><dt>${label}</dt><dd>${esc(t)}</dd></div>`;}).join('');
  const sensory=(senses?`<dl class="sensory">${senses}</dl>`:'')+paragraph(f.intro||f.description)+paragraph(f.comparison?.text);
  const purchaseKeyword=root.ReaderAccess?.entry(f)?.keyword;
  const buy=[f.buy,f.buyDetail,f.procurement?.route,f.market].map(value=>paragraph(purchaseKeyword&&typeof value==='string'?value.replace(/^搜索“[^”]*”/,'搜索“'+purchaseKeyword+'”'):value)).join('')+(root.ReaderAccess?.links(f)||'');
  const storageText=paragraph(f.storage),storage=storageText?`<h3>带回家以后</h3>${storageText}`:'';
  const steps=(Array.isArray(f.steps)?f.steps:[]).filter(value=>text(value));
  const plated=root.FoodMedia?.detail?root.FoodMedia.detail(f):null;
  const leadMedia=recognition.src?recognition:plated||recognition;
  const leadRole=leadMedia.scene||leadMedia.kind||'ingredient';
  const leadLabel=leadMedia===plated?(plated.kind==='fruit-cut'?'果切':'上桌'):'原貌';
  const photo=(media,cls,label,loading='lazy',attrs='')=>media?.src?`<figure class="${cls}" data-photo-role="${esc(media.kind==='ingredient'?(media.scene||'whole-ingredient'):(media.scene||media.kind||'ingredient'))}" tabindex="0"><div class="visual-frame"><img src="${esc(media.src)}" alt="${esc(media.alt||f.name)}" ${attrs} style="object-fit:${esc(media.fit||'cover')};object-position:${esc(media.position||'50% 50%')}" loading="${loading}" decoding="async"><span class="visual-role">${esc(label)}</span></div><figcaption>${esc(media.note||label)} · <a href="${esc(media.creditHref||'credits.html#visual-media-credits')}">图片出处 ↗</a></figcaption></figure>`:'';
  const secondary=plated&&plated.src!==leadMedia.src?photo(plated,'reader-recipe-photo',plated.kind==='fruit-cut'?'果切':'上桌'):'';

  const recipe=steps.length?secondary+(text(f.recipeTitle)?`<h3>${esc(f.recipeTitle)}</h3>`:'')+(!fresh?labeled('准备',f.ingredients):'')+`<ol class="recipe-steps">${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+(!fresh?labeled('做到什么程度',f.finish)+labeled('最容易失手',f.pitfall)+paragraph(f.kitchen)+labeled('搭配',f.pair,'pair-note'):paragraph(f.kitchen))+(root.ReaderAccess?.entry(f)?.video?'':`<a class="bilibili-recipe-link" href="https://search.bilibili.com/all?keyword=${encodeURIComponent(f.name)}" target="_blank" rel="noopener noreferrer">去 B 站搜索“${esc(f.name)}” ↗</a>`):'';
  const sourceEntries=[...(f.sources||[])],comparisonSource=merged.comparison?.source||f.readerExtraSource;
  if(comparisonSource&&!sourceEntries.some(([,url])=>url===comparisonSource))sourceEntries.push(['品种与食用部位',comparisonSource]);
  const origins=paragraph(f.season)+paragraph(f.seasonPhase?.note)+paragraph(f.place)+paragraph(f.context)+(originHtml||'')+(sourceEntries.length?`<ol class="reader-sources">${sourceEntries.map(([title,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a></li>`).join('')}</ol>`:'');
  const relatedRegions=variants.length?`<div class="reader-variants">${variants.map(v=>`<article><button data-food="${esc(v.id)}">${esc(v.name)} ↗</button><p>${esc(v.region)} · ${esc(v.seasonLabel||(v.peakMonths||[]).map(m=>m+'月').join('、'))}${v.sourceYears?.length?' · '+esc(v.sourceYears.join('、'))+'年':''}</p>${v.sources?.[0]?`<a href="${esc(v.sources[0][1])}" target="_blank" rel="noopener noreferrer">产地与时令出处 ↗</a>`:''}</article>`).join('')}</div>`:'';
  const recipeLink=recipe?`<button type="button" class="reader-recipe-button" data-food="${esc(f.id)}" data-recipe="true">${fresh?'怎么吃':'看做法'} <span aria-hidden="true">↓</span></button>`:'';
  return `<div class="reader-overview">${leadMedia.src?photo({...leadMedia,scene:leadRole},'reader-portrait',leadLabel,'eager',leadMedia===plated?'':imageAttrs):`<figure class="reader-portrait"><div class="ingredient-text-cover"><span>${esc(category)}</span><strong>${esc(f.name)}</strong><small>图片待补</small></div></figure>`}<div class="reader-lead"><p class="reader-kicker">${esc(category)} · ${esc(f.region)}</p><h1>${esc(f.name)}</h1>${text(f.seasonLabel||seasonLabel)?`<p class="reader-season">${esc(f.seasonLabel||seasonLabel)}</p>`:''}${lead}${state}<div class="reader-actions">${root.FoodPurchase.render(f)}${recipeLink}</div>${root.FoodRecords.render(f)}</div></div>
   ${text(f.safety)?`<aside class="reader-safety"><strong>入口前先留意</strong><p>${esc(f.safety)}</p></aside>`:''}
   <div class="reader-sections">${section('风味与区别',sensory)}${section('挑选、获取与保存',buy+storage,'foodBuying')}${section(fresh?'怎么吃':'家常做法',recipe,'foodRecipe')}${section('相近品种与形态',relatedRegions)}${section('来处、时令与来源',origins)}</div>
   ${similar.length?`<section class="reader-next"><p class="detail-num">相近风味</p><h2>和它风味相近的，还有哪些？</h2><div>${similar.map(({food:other,why})=>`<button data-food="${esc(other.id)}"><strong>${esc(other.name)}</strong><span>${esc(why)} ↗</span></button>`).join('')}</div></section>`:''}`;
 }
 root.FoodDetail={html};
})(window);
