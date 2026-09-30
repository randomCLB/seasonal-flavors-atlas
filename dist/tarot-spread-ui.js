/* A session-only three-card game; no saved preferences, accounts, or device sensors. */
(function(){
'use strict';
const $=id=>document.getElementById(id),T=window.FengwuTarot,S=window.FengwuTarotSpread,C=window.FengwuLottery,foods=window.FOODS,profiles=window.LOTTERY_PROFILES;
const byId=Object.fromEntries((foods||[]).map(f=>[f.id,f]));
let events=[],round=null,busy=false,result=null,history=[],noticeTimer;
const choices=[['vegan','纯素'],['meat','不吃肉'],['seafood','不吃水产'],['egg','不吃蛋'],['milk','不吃奶'],['soy','避开大豆'],['wheat','避开小麦'],['peanut','避开花生'],['sesame','避开芝麻']];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,reduced()?0:ms));
function seed(){if(globalThis.crypto?.randomUUID)return crypto.randomUUID();return `${Date.now()}-${Math.random().toString(36).slice(2)}`;}
function notify(message,floating=false){clearTimeout(noticeTimer);$('status').textContent=message;$('status').classList.toggle('floating',floating);if(floating)noticeTimer=setTimeout(()=>{$('status').classList.remove('floating');$('status').textContent='';},5500);}
function error(message){$('table-error').textContent=message;$('table-error').hidden=!message;}
function restrictions(){return {avoid:[...$('avoid-options').querySelectorAll('input:checked')].map(x=>x.value),excludeText:$('exclude-text').value.trim()};}
function checkPool(){const all=T.pool({foods,profiles,events,now:Date.now(),...restrictions()});if(!all.length)throw Error('此刻没有符合所选忌口、时令及配方配图资料的菜。可以调整非必要的选择，但不要放宽真正的忌口。');}
function refreshSeason(){const now=Date.now(),term=T.currentTerm(events,now);$('season-line').textContent=`${C.dayAt(now).replaceAll('-',' · ')} · ${term.name} · 三牌餐桌阵`;}
function syncControls(){
 const phase=round?.phase||'ready';$('table').dataset.phase=phase;$('table').setAttribute('aria-busy',String(busy));
 $('prepare-stage').hidden=phase!=='ready';$('cut-stage').hidden=phase!=='cut';$('draw-stage').hidden=!['drawing','complete'].includes(phase);$('reset-round').hidden=phase==='ready';
 document.querySelectorAll('.ritual-steps li').forEach(el=>{const active=el.dataset.stage===phase;if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
 $('table').querySelectorAll('button,input').forEach(el=>el.disabled=busy);
 document.querySelectorAll('[data-pick]').forEach(el=>el.disabled=busy||phase!=='drawing'||round.draws.includes(Number(el.dataset.pick)));
 $('read-spread').disabled=busy||phase!=='complete';
}
function cardMarkup(entry,index,animate=false){
 const role=S.ROLES[index];
 if(!entry)return `<article class="tableau-slot empty-slot"><p class="slot-title"><span>${role.number}</span> ${role.name}</p><div class="empty-card" aria-label="${role.name}牌位，等待抽牌"><span aria-hidden="true">✧</span><p>${role.question}</p></div></article>`;
 const card=T.deck.find(c=>c.id===entry.id),text=S.cardText({...entry,slot:index});
 return `<article class="tableau-slot ${animate?'just-revealed':''}"><p class="slot-title"><span>${role.number}</span> ${role.name}</p><div class="face-card spread-face ${entry.reversed?'is-reversed':''}" aria-label="${esc(role.name+'：'+card.name+'，'+text.position)}"><span class="face-number">${card.number}</span><span class="face-symbol" aria-hidden="true">${card.symbol}</span><h2>${card.name}</h2><p>${text.position}</p><span class="card-key">${card.key}</span></div><details class="card-insight"><summary>读这张牌 <span aria-hidden="true">＋</span></summary><p>${esc(text.text)}</p></details></article>`;
}
function renderDraw(animate=-1){
 const entries=S.selected(round),open=[...$('tableau').querySelectorAll('.card-insight')].map(el=>el.open);
 $('tableau').innerHTML=S.ROLES.map((_,i)=>cardMarkup(entries[i],i,i===animate)).join('');
 $('tableau').querySelectorAll('.card-insight').forEach((el,i)=>el.open=!!open[i]);
 $('spread').innerHTML=round.pile.map((_,i)=>`<button type="button" class="draw-back ${round.draws.includes(i)?'is-taken':''}" data-pick="${i}" aria-label="${round.draws.includes(i)?'已抽走':'选择'}第${i+1}张牌" ${round.draws.includes(i)?'disabled':''}><span class="draw-edge"><span aria-hidden="true">${round.draws.includes(i)?'·':'☾'}</span><small>${String(i+1).padStart(2,'0')}</small></span></button>`).join('');
 const n=entries.length;
 $('draw-title').textContent=n===3?'三张已齐，线索待合。':['第一张，看看此刻。','第二张，寻找转机。','第三张，让答案落定。'][n];
 $('draw-prompt').textContent=n===3?'可以点开每张牌细读，再揭晓共同指向的这一餐。':`已抽 ${n} / 3 · 从余下 ${round.pile.length-n} 张中，选出「${S.ROLES[n].name}」。`;
 $('read-spread').textContent=n===3?'解读牌阵，揭晓这一餐 ↗':`还差${['三','两','一'][n]}张牌`;
 syncControls();
}
function reset(message=''){
 if(busy)return;round=null;result=null;$('reveal').hidden=true;$('table').hidden=false;$('tableau').innerHTML='';$('spread').innerHTML='';error('');refreshSeason();syncControls();notify(message);window.scrollTo({top:0,behavior:'instant'});
}
async function start(){
 if(busy)return;error('');
 try{checkPool();busy=true;syncControls();$('prepare-stage').classList.add('is-shuffling');notify('正在洗牌，请把这一餐留给直觉。');await pause(550);round=S.shuffle(seed());notify('牌已洗好。选一叠，改变它的起点。');}
 catch(e){error(e.message||'没有洗好，请再试一次。');}
 finally{busy=false;$('prepare-stage').classList.remove('is-shuffling');syncControls();if(round?.phase==='cut')$('cut-title').focus({preventScroll:true});}
}
async function cut(position,button){
 if(busy||round?.phase!=='cut')return;error('');
 try{busy=true;syncControls();button.classList.add('is-cutting');await pause(300);round=S.cut(round,position);renderDraw();notify('第一张归于此刻。请选一张仍背面朝上的牌。');}
 catch(e){error(e.message||'切牌没有完成。');}
 finally{busy=false;button.classList.remove('is-cutting');syncControls();if(round?.phase==='drawing')$('draw-title').focus({preventScroll:true});}
}
async function take(index){
 if(busy||round?.phase!=='drawing'||round.draws.includes(index))return;error('');
 try{busy=true;syncControls();const next=S.take(round,index);$('spread').querySelector(`[data-pick="${index}"]`)?.classList.add('is-lifting');await pause(250);round=next;renderDraw(round.draws.length-1);const entry=S.selected(round).at(-1),card=T.deck.find(c=>c.id===entry.id);notify(`${entry.role}：${card.name}，${entry.reversed?'逆位':'正位'}。${round.phase==='complete'?'三牌已齐，可以解读。':'继续选下一张。'}`);}
 catch(e){error(e.message||'这张牌没有翻好。');}
 finally{busy=false;syncControls();const target=round?.phase==='complete'?$('read-spread'):$('spread').querySelector('[data-pick]:not(:disabled)');target?.focus({preventScroll:true});}
}
async function copy(text,message){
 try{await navigator.clipboard.writeText(text);notify(message,true);}catch{let box=$('manual-copy');if(!box){box=document.createElement('textarea');box.id='manual-copy';box.setAttribute('aria-label','请长按或全选复制完整牌阵');box.style.cssText='width:100%;min-height:170px;margin-top:15px;padding:15px;background:#10231f;color:#eee7d8;border:1px solid #ceb784';$('reveal').append(box);}box.value=text;box.focus();box.select();notify('内容已选中，可长按或使用复制快捷键。',true);}
}
function show(r){
 const f=byId[r.foodId];result=r;
 $('reading-date').textContent=`${r.day.replaceAll('-',' · ')} · ${r.term.name} · 三牌餐桌阵`;
 $('result-tableau').innerHTML=r.cards.map((entry,i)=>cardMarkup(entry,i)).join('');
 $('pattern').textContent=r.reading.pattern;
 $('dish-title').textContent=T.dishName(f);$('dish-origin').textContent=`用到 ${f.name} · ${r.place.place}`;
 const image=$('dish-image');$('image-failed').hidden=true;image.hidden=false;image.onload=()=>{image.hidden=false;$('image-failed').hidden=true;};image.onerror=()=>{image.hidden=true;$('image-failed').hidden=false;};const media=T.mediaFor(f);image.alt=media.alt;image.src=media.src;document.querySelector('.photo-label').textContent=media.kind==='ingredient'?'今日命定菜 · 原料参考':media.kind==='fresh'?'今日命定味 · 鲜果参考':'今日命定菜';
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
 $('repeat-note').textContent=r.repeated?'此刻没有其他符合忌口的候选，新的牌阵仍将这一味留在桌上。':`当前有 ${r.eligibleCount} 道当季选择，本轮还可遇见 ${r.remainingCount} 道不同的。${r.cycleRestarted?'上一轮已抽完，新一轮开始。':'抽遍这一轮，再开始轮换。'}刷新页面会开启新记录。签文仅供娱乐。`;
 $('table').hidden=true;$('reveal').hidden=false;document.querySelector('.recipe-preview').open=false;$('manual-copy')?.remove();notify('');$('result-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
async function reveal(){
 if(busy||round?.phase!=='complete')return;error('');
 try{const r=S.resolve({round,foods,profiles,events,now:Date.now(),...restrictions(),history});if(r.empty){error(r.reason);return;}busy=true;syncControls();notify('三张线索正在合成这一餐。');await pause(350);history.push(r.foodId);show(r);}
 catch(e){error(e.message||'解牌暂未完成，请重新洗牌。');notify('');}
 finally{busy=false;syncControls();}
}
try{
 if(!T||!C||!S||!foods?.length||!profiles)throw Error('牌桌资料未加载完整，请刷新后再试。');
 events=C.eventsFrom(window.SOLAR_TERM_TIMES,window.SOLAR_TERM_NAMES);
 $('avoid-options').innerHTML=choices.map(([value,label])=>`<label><input type="checkbox" value="${value}">${label}</label>`).join('');
 $('avoid-options').onchange=()=>{const n=$('avoid-options').querySelectorAll('input:checked').length;$('avoid-count').textContent=n?`· 已选 ${n} 项`:'';error('');};
 $('exclude-text').oninput=()=>error('');
 $('shuffle').onclick=start;
 document.querySelectorAll('.cut-pile').forEach(b=>b.onclick=()=>cut(Number(b.dataset.position),b));
 $('spread').onclick=e=>{const b=e.target.closest('[data-pick]');if(b&&!b.disabled)take(Number(b.dataset.pick));};
 $('reset-round').onclick=()=>reset('牌已收回，可重新洗牌。');$('again').onclick=()=>reset();$('start-over').onclick=()=>reset();
 $('read-spread').onclick=reveal;$('copy-reading').onclick=()=>{if(result)copy(S.copyText(result,byId[result.foodId],document.baseURI),'三张牌、总签文与菜品链接已复制。');};
 reset();
}catch(e){error(e.message||'牌桌暂时无法打开，请回首页。');$('table').querySelectorAll('button').forEach(b=>b.disabled=true);}
})();
