/* UI owns presentation only; the pure engine also runs in node:test. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id), C=window.FengwuLottery;
  const foods=window.FOODS, profiles=window.LOTTERY_PROFILES;
  const STORE='fengwu.lottery.v1.1', SCHEMA=1;
  let prefs={avoid:[],excludeText:'',flavors:[],effort:1,buy:'both',adventure:1},step=0,plan=null,saved=null,noticeTimer;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId=Object.fromEntries(foods.map(f=>[f.id,f]));
  const events=C.eventsFrom(window.SOLAR_TERM_TIMES,window.SOLAR_TERM_NAMES);
  const families={vegetable:'鲜菜',fruit:'鲜果',seafood:'水产',meat:'肉类',flower:'食用花',fungus:'鲜菌',algae:'藻类'};
  const avoidChoices=[['none','没有已知忌口'],['vegan','纯素（不含蛋奶蜂蜜）'],['meat','不吃肉'],['seafood','不吃水产'],['egg','避开蛋'],['milk','避开乳制品'],['soy','避开大豆'],['wheat','避开小麦'],['peanut','避开花生'],['sesame','避开芝麻']];
  const flavorChoices=[['crisp','清甜脆嫩'],['soft','软糯柔和'],['fruit','酸甜多汁'],['herbal','草本微苦'],['savory','鲜香弹嫩'],['any','都可以']];
  const questions=[
    {title:'这趟，有什么一定不能出现？',hint:'主料和配料一起排除，可选配料也计算在内。它不是过敏安全认证；需要避开的东西请明确选择。'},
    {title:'你更想遇到哪种口感？',hint:'选一两种最想吃的，或把选择留给时令。'},
    {title:'愿意为这一口，动多少手？',hint:'不下厨就只挑相应的即食做法，不会把需要烹熟的东西交给你。'},
    {title:'这些鲜味，你通常会在哪里买？',hint:'暂不查询库存，也不索要地址；我们把合适的采购线索留给你。'},
    {title:'熟悉一点，还是意外一点？',hint:'意外只发生在符合条件的食材里，忌口不会跟着抽签。'}
  ];
  function notify(message,floating=false){clearTimeout(noticeTimer);$('status').textContent=message;$('status').classList.toggle('floating',floating);if(floating)noticeTimer=setTimeout(()=>{$('status').textContent='';$('status').classList.remove('floating');},6500);}
  function screen(name){['welcome','quiz','results'].forEach(id=>$(id).hidden=id!==name);notify('');window.scrollTo(0,0);}
  function choice(value,label,checked,name,type='radio'){return `<label class="choice"><input type="${type}" name="${name}" value="${esc(value)}" ${checked?'checked':''}><span>${esc(label)}</span></label>`;}
  function renderQuestion(){
    screen('quiz');const q=questions[step];$('progress').textContent=`${String(step+1).padStart(2,'0')} / 05`;
    let body='';
    if(step===0){body=`<div class="choices restrict-choices">${avoidChoices.map(([v,l])=>choice(v,l,v==='none'?!prefs.avoid.length:prefs.avoid.includes(v),'avoid','checkbox')).join('')}</div><label class="other-label">还想排除某个本站食材？<input id="exclude-text" maxlength="200" value="${esc(prefs.excludeText)}" placeholder="输入食材全名或别名，多个用逗号隔开" autocomplete="off"></label><p class="fine">这里不做病史或用药分析。未识别的词会拦住抽签，不会被忽略。</p>`;}
    if(step===1)body=`<div class="choices">${flavorChoices.map(([v,l])=>choice(v,l,v==='any'?!prefs.flavors.length:prefs.flavors.includes(v),'flavor','checkbox')).join('')}</div>`;
    if(step===2)body=`<div class="choices">${[[0,'尽量不下厨：洗净、剥开，就能尝'],[1,'简单做一顿：一口锅，家常做法'],[2,'值得好吃，可以认真做']].map(([v,l])=>choice(v,l,prefs.effort===v,'effort')).join('')}</div>`;
    if(step===3)body=`<div class="choices">${[['local','附近菜场或超市'],['online','愿意产地网购'],['both','两种都行，合适就试试']].map(([v,l])=>choice(v,l,prefs.buy===v,'buy')).join('')}</div><p class="fine">本地选择也要先核实现货；网购提前量是询货时间，不是到货保证。</p>`;
    if(step===4)body=`<div class="choices">${[[0,'稳一点，让口味偏好带路'],[1,'一半熟悉，一半新鲜'],[2,'给我一点意外']].map(([v,l])=>choice(v,l,prefs.adventure===v,'adventure')).join('')}</div>`;
    $('question').innerHTML=`<h1 id="question-title" tabindex="-1">${q.title}</h1><p class="hint">${q.hint}</p>${body}`;
    $('previous').disabled=step===0;$('next').textContent=step===4?'揭开我的时令签 ↗':'下一问 →';
    $('question-title').focus({preventScroll:true});
    $('question').onchange=e=>{if(!e.target.matches('input[type=checkbox]'))return;const group=e.target.name,all=group==='avoid'?'none':'any';const inputs=[...$('question').querySelectorAll(`input[name="${group}"]`)];if(e.target.value===all&&e.target.checked)inputs.filter(x=>x!==e.target).forEach(x=>x.checked=false);else if(e.target.checked)inputs.find(x=>x.value===all).checked=false;if(group==='flavor'&&inputs.filter(x=>x.checked&&x.value!==all).length>2){e.target.checked=false;notify('最多留两种口感就好。');}if(inputs.every(x=>!x.checked))inputs.find(x=>x.value===all).checked=true;};
  }
  function capture(){
    const checked=name=>[...$('question').querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value);
    if(step===0){prefs.avoid=checked('avoid').filter(x=>x!=='none');prefs.excludeText=$('exclude-text').value.trim();const r=C.resolveExclusions(prefs.excludeText,foods);if(r.unknown.length)throw Error(`暂未识别：${r.unknown.join('、')}。请使用上方限制或本站食材全名，不能忽略后继续。`);}
    if(step===1)prefs.flavors=checked('flavor').filter(x=>x!=='any');
    if(step===2)prefs.effort=Number(checked('effort')[0]);if(step===3)prefs.buy=checked('buy')[0];if(step===4)prefs.adventure=Number(checked('adventure')[0]);
  }
  function seed(){return typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');}
  function touched(){plan.revision++;plan.updatedAt=Date.now();persist();}
  function persist(){try{if($('remember').checked&&plan)localStorage.setItem(STORE,JSON.stringify(plan));else localStorage.removeItem(STORE);}catch{notify('浏览器没有允许本机保存。本次食单仍可使用和导出。',true);}}
  function newPlan(){C.validatePrefs(prefs);const now=Date.now(),id=seed(),slots=C.nextSix(events,now);const selections=C.draw({foods,profiles,prefs,events,slots,seed:id});plan={schema:SCHEMA,id,seed:id,createdAt:now,updatedAt:now,revision:0,prefs:structuredClone(prefs),slots:selections};persist();renderResults();}
  function checkPlan(p){if(!p||p.schema!==SCHEMA||typeof p.id!=='string'||p.id.length>100||!Number.isFinite(p.createdAt)||!Array.isArray(p.slots)||p.slots.length!==6)throw Error('旧食单版本不同，请重新抽签。');C.validatePrefs(p.prefs);const keys=new Set(),ids=new Set();for(const s of p.slots){if(keys.has(s.key)||!events.some(e=>`${e.year}-${e.index}`===s.key&&e.time===s.time))throw Error('旧食单时间无效。');keys.add(s.key);if(s.foodId){const f=byId[s.foodId];if(ids.has(s.foodId)||!f||!C.poolFor(foods,profiles,p.prefs,s,events).some(x=>x.id===s.foodId))throw Error('旧食单所用的配方或时令已改变，请重新抽签。');ids.add(s.foodId);}}return p;}
  function renderResults(){
    screen('results');const filled=plan.slots.filter(s=>s.foodId),count=new Set(filled.map(s=>profiles[s.foodId].family)).size;
    $('result-summary').textContent=`${filled.length} 味风物，${count} 种不同体验。从下一个节气开始，不含此刻正在经历的节气。${filled.length<6?'有些位置暂时留白，绝不放宽忌口凑数。':''}`;
    $('saved-date').textContent=`这份签抽于 ${C.dayAt(plan.createdAt)}。节气按中国标准时间，食材日期以产区资料为线索。`;
    $('calendar-open').disabled=!filled.length;$('forget').hidden=!$('remember').checked;
    $('food-list').innerHTML=plan.slots.map((s,i)=>{
      const term=`<div class="term"><div class="term-number">${String(i+1).padStart(2,'0')}</div><h3 class="term-name">${esc(s.name)}</h3><p class="term-dates">${s.startDay.slice(5).replace('-',' / ')}<br>至 ${s.endDay.slice(5).replace('-',' / ')}<br>${s.year}</p></div>`;
      if(!s.foodId)return `<article class="food-entry reveal">${term}<div class="empty-slot"><h2>这一签，先为你留白。</h2><p>${esc(s.reason)}</p></div></article>`;
      const f=byId[s.foodId],p=profiles[f.id],flavors=(f.flavor||[]).join('、');
      const matched=plan.prefs.flavors.some(key=>C.FLAVORS[key].some(t=>flavors.includes(t)));
      const reason=matched?`它的${flavors}，与你选的口感有交集。`:`留给这一季的一点不同：${flavors}。`;
      return `<article class="food-entry reveal" data-slot="${esc(s.key)}">${term}<figure class="food-image"><img src="${esc(f.cardImage||f.image)}" alt="${esc(f.cardImageAlt||f.imageAlt||f.name)}" loading="lazy"><figcaption>${esc(f.cardImageNote||f.imageCaption||f.cardNote||'照片用于认识食材，商品以实际到货为准。')}</figcaption></figure><div class="food-copy"><p class="food-origin">${esc(s.place)} · ${families[p.family]} · ${s.eatDay} 暂定尝鲜</p><h2>${esc(f.name)}</h2><p class="reason">${esc(reason)}</p><p class="recipe">这一回试试 <a href="index.html?food=${encodeURIComponent(f.id)}" target="_blank" rel="noopener noreferrer">${esc(f.recipeTitle)} ↗</a></p><div class="food-note"><p><strong>买前：</strong>${esc(f.buy)}</p><p><strong>留意：</strong>${esc(f.safety||f.storage||'核对到货状态、商品配料和保存条件。')}</p><p>时令精度：${s.precision==='season'?'季节级近似':'月度或旬段参考'}，不保证该日正好上市。</p></div><div class="food-actions"><button class="text-button" data-swap="${esc(s.key)}">换这一味 ↻</button><button class="text-button" data-lock="${esc(s.key)}" aria-pressed="${!!s.locked}">${s.locked?'已留住 ✓':'留住它'}</button><button class="text-button" data-copy="${esc(f.id)}">复制采购词</button></div></div></article>`;
    }).join('');
  }
  $('begin').onclick=()=>{step=0;renderQuestion();};$('leave-quiz').onclick=()=>plan?renderResults():screen('welcome');
  $('previous').onclick=()=>{try{capture();}catch{}if(step>0)step--;renderQuestion();};
  $('question-form').onsubmit=e=>{e.preventDefault();try{capture();if(step<4){step++;renderQuestion();}else newPlan();}catch(err){notify(err.message);}};
  $('edit').onclick=()=>{prefs=structuredClone(plan.prefs);step=0;renderQuestion();};
  $('redraw').onclick=()=>{try{const locked=Object.fromEntries(plan.slots.filter(s=>s.locked).map(s=>[s.key,s.foodId]));const old=plan.slots;plan.seed=seed();const next=C.draw({foods,profiles,prefs:plan.prefs,events,slots:old,seed:plan.seed,locked});plan.slots=next.map((s,i)=>old[i].locked?old[i]:s);touched();renderResults();notify('未锁定的签已重新安排；候选较少时，可能再遇到同一味。',true);}catch(err){notify(err.message,true);}};
  $('food-list').onclick=async e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.copy){const text=byId[b.dataset.copy].search;try{await navigator.clipboard.writeText(text);notify(`已复制：${text}`,true);}catch{notify(`可手动复制：${text}`,true);}return;}
    const key=b.dataset.lock||b.dataset.swap,slot=plan.slots.find(s=>s.key===key);if(!slot)return;
    if(b.dataset.lock){slot.locked=!slot.locked;touched();b.textContent=slot.locked?'已留住 ✓':'留住它';b.setAttribute('aria-pressed',String(slot.locked));return;}
    if(slot.locked){notify('这一味已留住，先解锁再换。',true);return;}
    try{const locked=Object.fromEntries(plan.slots.filter(s=>s.key!==key&&s.foodId).map(s=>[s.key,s.foodId]));const next=C.draw({foods,profiles,prefs:plan.prefs,events,slots:plan.slots,seed:seed(),locked,exclude:{[key]:slot.foodId}}).find(s=>s.key===key);
      if(!next.foodId){notify('这段时间没有另一个合适的候选，先替你保留原签。',true);return;}
      const scroll=window.scrollY;plan.slots[plan.slots.indexOf(slot)]={...next,locked:false};touched();renderResults();window.scrollTo(0,scroll);notify('只换了这一味，其他五个位置保持不变。',true);
    }catch(err){notify(err.message,true);}
  };
  $('remember').onchange=()=>{persist();$('forget').hidden=!$('remember').checked;};
  $('forget').onclick=()=>{$('remember').checked=false;persist();saved=null;$('resume').hidden=true;$('forget').hidden=true;notify('本机记录已清除。当前食单留在页面内，关闭后不再保存。',true);};
  function calendarOptions(){return {zone:$('time-zone').value,clock:$('clock').value,lead:Number($('lead-days').value),included:[...$('calendar-rows').querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value),eatDays:Object.fromEntries([...$('calendar-rows').querySelectorAll('input[type=date]')].map(x=>[x.dataset.key,x.value]))};}
  function updateCalendar(){const options=calendarOptions();let errors=[];let rows=[];try{rows=C.calendarEvents(plan,foods,options);}catch(err){errors.push(err.message);}for(const s of plan.slots.filter(s=>s.foodId)){const target=$('calendar-rows').querySelector(`[data-preview="${s.key}"]`);const row=rows.find(x=>x.key===s.key);target.textContent=row?`${row.day} ${row.clock} 询货${row.late?'（原时间已过，已顺延）':''}`:options.included.includes(s.key)?'请检查日期':'本次不导出';}if(!options.included.length)errors.push('请至少勾选一个节气。');$('calendar-error').hidden=!errors.length;$('calendar-error').textContent=errors.join('\n');$('calendar-form').querySelector('[type=submit]').disabled=!!errors.length;return options;}
  $('calendar-open').onclick=()=>{try{checkPlan(plan);const prev=plan.calendar||{};$('lead-days').value=String(prev.lead??(plan.prefs.buy==='local'?1:3));$('clock').value=prev.clock||'19:00';$('time-zone').value=prev.zone||C.ZONE;
    $('calendar-rows').innerHTML=plan.slots.filter(s=>s.foodId).map(s=>`<div class="calendar-row"><label><input type="checkbox" value="${s.key}" ${!prev.included||prev.included.includes(s.key)?'checked':''}><span>${esc(s.name)} · ${esc(byId[s.foodId].name)}<small data-preview="${s.key}"></small></span></label><label class="date-label">暂定尝鲜日<input type="date" data-key="${s.key}" value="${prev.eatDays?.[s.key]&&s.availableDays.includes(prev.eatDays[s.key])?prev.eatDays[s.key]:s.eatDay}" min="${s.availableDays[0]}" max="${s.availableDays.at(-1)}"></label></div>`).join('');
    $('export-status').hidden=true;updateCalendar();$('calendar-dialog').showModal();
  }catch(err){notify(err.message,true);}};
  $('calendar-close').onclick=()=>$('calendar-dialog').close();$('calendar-dialog').addEventListener('click',e=>{if(e.target===$('calendar-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  $('calendar-form').onchange=()=>{const opts=updateCalendar();if(!Object.keys(plan.calendar||{}).length||JSON.stringify(opts)!==JSON.stringify(plan.calendar)){plan.calendar=opts;touched();}$('export-status').hidden=true;};
  $('calendar-form').onsubmit=e=>{e.preventDefault();try{checkPlan(plan);const options=updateCalendar();if(!$('calendar-error').hidden)return;plan.calendar=options;const text=C.makeICS(plan,foods,options);const blob=new Blob([text],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`风物时令签-${C.dayAt(plan.createdAt)}.ics`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);persist();$('export-status').hidden=false;$('export-status').textContent=`已生成 ${options.included.length} 条日程文件，尚未确认写入你的日历。请在日历应用完成导入，并核对提醒和通知权限。再次导入可能产生重复。`;}catch(err){$('calendar-error').hidden=false;$('calendar-error').textContent=err.message;}};
  try{const raw=localStorage.getItem(STORE);if(raw&&raw.length<100000){saved=checkPlan(JSON.parse(raw));$('resume').hidden=false;}}catch{try{localStorage.removeItem(STORE);}catch{}notify('旧记录无法继续使用，可以重新抽一份。');}
  $('resume').onclick=()=>{try{plan=checkPlan(saved);prefs=structuredClone(plan.prefs);$('remember').checked=true;renderResults();}catch(err){notify(err.message);}};
  try{$('term-preview').textContent=C.nextSix(events).map(s=>s.name).join('  ·  ');}catch(err){$('begin').disabled=true;notify(err.message);}
  const deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone;if(deviceZone&&!Array.from($('time-zone').options).some(o=>o.value===deviceZone)){$('time-zone').add(new Option(`本机：${deviceZone}`,deviceZone));}
})();
