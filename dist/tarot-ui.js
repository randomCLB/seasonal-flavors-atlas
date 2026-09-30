/* Tarot is an independent, session-only interaction. It never reads saved taste profiles. */
(function(){
'use strict';
const $=id=>document.getElementById(id),T=window.FengwuTarot,C=window.FengwuLottery,foods=window.FOODS,profiles=window.LOTTERY_PROFILES;
const byId=Object.fromEntries((foods||[]).map(f=>[f.id,f]));
let events=[],roundSeed='',busy=false,result=null,history=[],timer;
const choices=[['vegan','纯素'],['meat','不吃肉'],['seafood','不吃水产'],['egg','不吃蛋'],['milk','不吃奶'],['soy','避开大豆'],['wheat','避开小麦'],['peanut','避开花生'],['sesame','避开芝麻']];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function seed(){if(globalThis.crypto?.randomUUID)return crypto.randomUUID();return `${Date.now()}-${Math.random().toString(36).slice(2)}`;}
function notify(message,floating=false){clearTimeout(timer);$('status').textContent=message;$('status').classList.toggle('floating',floating);if(floating)timer=setTimeout(()=>{$('status').classList.remove('floating');$('status').textContent='';},5500);}
function error(message){$('table-error').textContent=message;$('table-error').hidden=!message;}
function refreshSeason(){const now=Date.now(),term=T.currentTerm(events,now);$('season-line').textContent=`${C.dayAt(now).replaceAll('-',' · ')} · ${term.name} · 当季风物入牌`;}
function reset(message=''){if(busy)return;roundSeed=seed();$('reveal').hidden=true;$('table').hidden=false;$('spread').classList.remove('is-drawing');document.querySelectorAll('.card-back').forEach(b=>b.classList.remove('chosen'));error('');refreshSeason();notify(message);window.scrollTo({top:0,behavior:'instant'});}
function setBusy(value){busy=value;$('table').setAttribute('aria-busy',String(value));$('table').querySelectorAll('button,input').forEach(el=>el.disabled=value);}
async function copy(text,message){try{await navigator.clipboard.writeText(text);notify(message,true);}catch{let box=$('manual-copy');if(!box){box=document.createElement('textarea');box.id='manual-copy';box.setAttribute('aria-label','浏览器禁止复制，请长按或全选复制以下内容');box.style.cssText='width:100%;min-height:170px;margin-top:15px;padding:15px;background:#10231f;color:#eee7d8;border:1px solid #ceb784';$('reveal').append(box);}box.value=text;box.focus();box.select();notify('浏览器未允许自动复制，内容已选中，可长按或使用复制快捷键。',true);}}
function show(r){
 const f=byId[r.foodId],card=T.deck.find(x=>x.id===r.cardId);result=r;
 $('reading-date').textContent=`${r.day.replaceAll('-',' · ')} · ${r.term.name} · 你的餐桌占卜`;
 $('card-number').textContent=card.number;$('card-symbol').textContent=card.symbol;$('card-name').textContent=card.name;$('card-position').textContent=r.reversed?'逆位':'正位';$('card-key').textContent=card.key;
 $('dish-title').textContent=T.dishName(f);$('dish-origin').textContent=`用到 ${f.name} · ${r.place.place}`;
 const image=$('dish-image');$('image-failed').hidden=true;image.hidden=false;image.onload=()=>{image.hidden=false;$('image-failed').hidden=true;};image.onerror=()=>{image.hidden=true;$('image-failed').hidden=false;};image.alt=f.dishImageAlt||`${f.name}成菜参考`;image.src=f.dishImage;
 $('image-note').textContent=T.imageNote(f);for(const key of ['opening','connection','closing','omen'])$(key).textContent=r.reading[key];
 $('dish-sensory').textContent=f.dishCaption||f.short||'';
 $('season-note').textContent=`时令线索：${f.season} 当前推荐依据产地记录，不代表库存或当年成熟日已确认。`;
 $('copy-search').textContent=f.search;$('copy-search').onclick=()=>copy(f.search,'采购搜索词已复制。');
 $('recipe-ingredients').textContent=`准备（2 人份）：${f.ingredients}`;
 $('recipe-steps').innerHTML=f.steps.map(s=>`<li>${esc(s)}</li>`).join('');
 $('recipe-finish').textContent=`做到什么程度：${f.finish||'以完整食谱的熟制要求为准。'}`;
 $('recipe-safety').textContent=f.safety||'购买前确认实际商品配料和到货鲜度；本站不确认商品的过敏原交叉接触。';
 $('recipe-storage').textContent=`带回家后：${f.storage||'按实际商品说明保存，尽快安排食用。'}`;
 const url=new URL('index.html',document.baseURI);url.searchParams.set('food',f.id);$('food-link').href=url.href;
 const source=$('season-source');try{const u=new URL(r.place.source);source.hidden=!['http:','https:'].includes(u.protocol);if(!source.hidden)source.href=u.href;}catch{source.hidden=true;}
 $('repeat-note').textContent=r.repeated?'目前没有其他符合忌口的当季菜，命运又把这一味送回桌上。':`这一轮有 ${r.eligibleCount} 道符合时令与忌口的菜入牌。再抽会尽量避开最近两道，不必将每张签都当真。`;
 $('table').hidden=true;$('reveal').hidden=false;document.querySelector('.recipe-preview').open=false;$('manual-copy')?.remove();notify('');$('result-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
async function choose(position,button){
 if(busy)return;error('');
 try{const avoid=[...$('avoid-options').querySelectorAll('input:checked')].map(x=>x.value),r=T.draw({foods,profiles,events,now:Date.now(),seed:roundSeed,position,avoid,excludeText:$('exclude-text').value.trim(),history});if(r.empty){error(r.reason);return;}
 setBusy(true);button.classList.add('chosen');$('spread').classList.add('is-drawing');notify('正在核对星盘与锅气…');
 await new Promise(resolve=>setTimeout(resolve,matchMedia('(prefers-reduced-motion: reduce)').matches?0:650));
 history.push(r.foodId);history=history.slice(-5);show(r);
 }catch(e){error(e.message||'这张牌没有翻好，请重新洗牌。');notify('');}finally{setBusy(false);$('spread').classList.remove('is-drawing');}
}
try{
 if(!T||!C||!foods?.length||!profiles)throw Error('牌桌资料未加载完整，请刷新后再试。');
 events=C.eventsFrom(window.SOLAR_TERM_TIMES,window.SOLAR_TERM_NAMES);
 $('avoid-options').innerHTML=choices.map(([value,label])=>`<label><input type="checkbox" value="${value}">${label}</label>`).join('');
 $('avoid-options').onchange=()=>{const n=$('avoid-options').querySelectorAll('input:checked').length;$('avoid-count').textContent=n?`· 已选 ${n} 项`:'';error('');};
 document.querySelectorAll('.card-back').forEach(button=>button.addEventListener('click',()=>choose(Number(button.dataset.position),button)));
 $('shuffle').onclick=()=>reset('牌已重新洗好，再凭第一眼选一张。');$('again').onclick=()=>reset();$('start-over').onclick=()=>reset();
 $('copy-reading').onclick=()=>{if(result)copy(T.copyText(result,byId[result.foodId],document.baseURI),'签文与菜品链接已复制。');};
 reset();
}catch(e){error(e.message||'牌桌暂时无法打开，请回首页。');$('table').querySelectorAll('button').forEach(b=>b.disabled=true);}
})();
