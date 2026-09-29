/* UI owns presentation only; the pure engine also runs in node:test. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id), C=window.FengwuLottery;
  const foods=window.FOODS, profiles=window.LOTTERY_PROFILES;
  const STORE='fengwu.lottery.v1.1', SCHEMA=2;
  let prefs={avoid:[],excludeText:'',tastes:[],textures:[],cooking:[],curiosity:1},step=0,plan=null,saved=null,noticeTimer;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId=Object.fromEntries(foods.map(f=>[f.id,f]));
  const events=C.eventsFrom(window.SOLAR_TERM_TIMES,window.SOLAR_TERM_NAMES);
  const families={vegetable:'鲜菜',fruit:'鲜果',seafood:'水产',meat:'肉类',flower:'食用花',fungus:'鲜菌',algae:'藻类'};
  const avoidChoices=[['none','没有已知忌口'],['vegan','纯素（不含蛋奶蜂蜜）'],['meat','不吃肉'],['seafood','不吃水产'],['egg','避开蛋'],['milk','避开乳制品'],['soy','避开大豆'],['wheat','避开小麦'],['peanut','避开花生'],['sesame','避开芝麻']];
  const questions=[
    {title:'这趟，有什么一定不能出现？',hint:'不愿意吃或需要避开的，先排除。主料和配料一起检查；这不是过敏安全认证。'},
    {title:'酸、甜、苦、辣、咸、鲜，你更偏哪几味？',hint:'喜欢的味道可以多选，也可以选「都可以」。这里先不问口感。'},
    {title:'咬下去，你喜欢什么质地？',hint:'清脆、软糯、多汁，各选几种合心意的。'},
    {title:'端上桌，你更想怎么吃？',hint:'料理方式可以多选，也可以选「都可以」。凉拌仍按菜谱做熟处理。'},
    {title:'这次，想猎奇到什么程度？',hint:'只调整对外形、气味和质感特点的推荐倾向，不判断你吃没吃过，也不放宽忌口。'}
  ];
  function notify(message,floating=false){clearTimeout(noticeTimer);$('status').textContent=message;$('status').classList.toggle('floating',floating);if(floating)noticeTimer=setTimeout(()=>{$('status').textContent='';$('status').classList.remove('floating');},6500);}
  function screen(name){['welcome','quiz','results'].forEach(id=>$(id).hidden=id!==name);notify('');window.scrollTo(0,0);}
  function choice(value,label,checked,name,type='radio'){return `<label class="choice"><input type="${type}" name="${name}" value="${esc(value)}" ${checked?'checked':''}><span>${esc(label)}</span></label>`;}
  function renderQuestion(){
    screen('quiz');const q=questions[step];$('progress').textContent=`${String(step+1).padStart(2,'0')} / 05`;
    let body='';
    if(step===0){body=`<div class="choices restrict-choices">${avoidChoices.map(([v,l])=>choice(v,l,v==='none'?!prefs.avoid.length:prefs.avoid.includes(v),'avoid','checkbox')).join('')}</div><label class="other-label">还想排除某个本站食材？<input id="exclude-text" maxlength="200" value="${esc(prefs.excludeText)}" placeholder="输入食材全名或别名，多个用逗号隔开" autocomplete="off"></label><p class="fine">这里不做病史或用药分析。未识别的词会拦住抽签，不会被忽略。</p>`;}
    if(step>=1&&step<=3){
      const groups=[null,['tastes',C.TASTES],['textures',C.TEXTURES],['cooking',C.COOKING]], [key,labels]=groups[step];
      const choices=[...Object.entries(labels),['any','都可以']];
      body=`<div class="choices preference-choices">${choices.map(([v,l])=>choice(v,l,v==='any'?!prefs[key].length:prefs[key].includes(v),key,'checkbox')).join('')}</div>`;
    }
    if(step===4)body=`<div class="choices">${[[0,'口味优先','先按味道和质地选，不额外追求特别。'],[1,'带点特别','外形、气味或口感有特点，也愿意试试。'],[2,'大胆猎奇','更想遇到有鲜明外形或风味特点的食材。']].map(([v,l,detail])=>`<label class="choice"><input type="radio" name="curiosity" value="${v}" ${prefs.curiosity===v?'checked':''}><span>${l}<small>${detail}</small></span></label>`).join('')}</div>`;
    $('question').innerHTML=`<h1 id="question-title" tabindex="-1">${q.title}</h1><p class="hint">${q.hint}</p>${body}`;
    $('previous').disabled=step===0;$('next').textContent=step===4?'揭开我的时令签 ↗':'下一问 →';
    $('question-title').focus({preventScroll:true});
    $('question').onchange=e=>{if(!e.target.matches('input[type=checkbox]'))return;const group=e.target.name,all=group==='avoid'?'none':'any';const inputs=[...$('question').querySelectorAll(`input[name="${group}"]`)];if(e.target.value===all&&e.target.checked)inputs.filter(x=>x!==e.target).forEach(x=>x.checked=false);else if(e.target.checked)inputs.find(x=>x.value===all).checked=false;if(inputs.every(x=>!x.checked))inputs.find(x=>x.value===all).checked=true;};
  }
  function capture(){
    const checked=name=>[...$('question').querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value);
    if(step===0){prefs.avoid=checked('avoid').filter(x=>x!=='none');prefs.excludeText=$('exclude-text').value.trim();const r=C.resolveExclusions(prefs.excludeText,foods);if(r.unknown.length)throw Error(`暂未识别：${r.unknown.join('、')}。请使用上方限制或本站食材全名，不能忽略后继续。`);}
    if(step>=1&&step<=3){const key=[null,'tastes','textures','cooking'][step];prefs[key]=checked(key).filter(x=>x!=='any');}
    if(step===4)prefs.curiosity=Number(checked('curiosity')[0]);
  }
  function seed(){return typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');}
  function touched(){plan.revision++;plan.updatedAt=Date.now();persist();}
  function persist(clear=false){try{if(clear)localStorage.removeItem(STORE);else if($('remember').checked&&plan)localStorage.setItem(STORE,JSON.stringify(plan));}catch{notify('浏览器没有允许本机保存。本次食单仍可使用和导出。',true);}}
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
      const f=byId[s.foodId],p=profiles[f.id];
      const reason=C.recommendationReason(f,p,plan.prefs);
      return `<article class="food-entry reveal" data-slot="${esc(s.key)}">${term}<figure class="food-image"><img src="${esc(f.cardImage||f.image)}" alt="${esc(f.cardImageAlt||f.imageAlt||f.name)}" loading="lazy"></figure><div class="food-copy"><p class="food-origin">${esc(s.place)} · ${families[p.family]} · ${s.eatDay} 暂定尝鲜</p><h2>${esc(f.name)}</h2><p class="reason">${esc(reason)}</p><p class="recipe">这一回试试 <a href="index.html?food=${encodeURIComponent(f.id)}" target="_blank" rel="noopener noreferrer">${esc(f.recipeTitle)} ↗</a></p><div class="food-note"><p><strong>买前：</strong>${esc(f.buy)}</p><p><strong>留意：</strong>${esc(f.safety||f.storage||'核对到货状态、商品配料和保存条件。')}</p><p>时令精度：${s.precision==='season'?'季节级近似':'月度或旬段参考'}，不保证该日正好上市。</p></div><div class="food-actions"><button class="text-button" data-swap="${esc(s.key)}">换这一味 ↻</button><button class="text-button" data-lock="${esc(s.key)}" aria-pressed="${!!s.locked}">${s.locked?'已留住 ✓':'留住它'}</button><button class="text-button" data-copy="${esc(f.id)}">复制采购词</button></div></div></article>`;
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
  $('remember').onchange=()=>{persist(!$('remember').checked);$('forget').hidden=!$('remember').checked;};
  $('forget').onclick=()=>{$('remember').checked=false;persist(true);saved=null;$('resume').hidden=true;$('forget').hidden=true;notify('本机记录已清除。当前食单留在页面内，关闭后不再保存。',true);};
  function downloadCalendar(text,name){const blob=new Blob([text],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  $('calendar-open').onclick=async()=>{const status=$('calendar-status');status.hidden=false;status.textContent='正在准备日程…';try{checkPlan(plan);const options={zone:C.ZONE,clock:'19:00',lead:3},text=C.makeICS(plan,foods,options),name=`时令风物-${C.dayAt(plan.createdAt)}.ics`,file=new File([text],name,{type:'text/calendar;charset=utf-8'});
    if(typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]})){await navigator.share({title:'时令风物采购提醒',text:'未来六个节气的食材询货提醒。选择日历应用并确认保存。',files:[file]});status.textContent='日程已交给系统分享菜单。选择日历应用并确认保存后，提醒才会加入日历。';}
    else{downloadCalendar(text,name);status.textContent='这个浏览器没有系统日历分享入口，已下载日程。点开文件后，在日历应用中确认添加。';}
  }catch(err){status.textContent=err.name==='AbortError'?'已取消，没有添加日程。':`日程没有交给日历：${err.message||'请稍后重试。'}`;}};
  try{const raw=localStorage.getItem(STORE);if(raw&&raw.length<100000){saved=checkPlan(JSON.parse(raw));$('resume').hidden=false;}}catch{notify('五问已更新，请按新版重新选择。旧食单仍保存在本机，勾选保存新版时才替换，不会把旧答案套到新问题。');$('clear-old').hidden=false;}
  $('clear-old').onclick=()=>{persist(true);saved=null;$('clear-old').hidden=true;$('resume').hidden=true;notify('旧记录已清除。');};
  $('resume').onclick=()=>{try{plan=checkPlan(saved);prefs=structuredClone(plan.prefs);$('remember').checked=true;renderResults();}catch(err){notify(err.message);}};
  try{$('term-preview').textContent=C.nextSix(events).map(s=>s.name).join('  ·  ');}catch(err){$('begin').disabled=true;notify(err.message);}
})();
