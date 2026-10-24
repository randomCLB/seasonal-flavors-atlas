/* Shared search entry. Reader projections show concise actions; raw-catalog callers remain compatible. */
(function(root){
 'use strict';
 const cityKey='fengwu.local-city.v1';let memoryCity='';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function getCity(){try{return root.localStorage?.getItem(cityKey)||memoryCity;}catch{return memoryCity;}}
 function setCity(value){memoryCity=String(value||'').trim().slice(0,40);try{root.localStorage?.setItem(cityKey,memoryCity);}catch{}return memoryCity;}
 function links(food,city=getCity()){
  const query=[root.ReaderAccess?.entry(food)?.keyword||food.search||food.name,city].filter(Boolean).join(' ');
  return [['必应 · 通用搜索','https://www.bing.com/search','q'],['淘宝搜索','https://s.taobao.com/search','q'],['京东搜索','https://search.jd.com/Search','keyword']].map(([label,base,key])=>({label,url:base+'?'+key+'='+encodeURIComponent(query)}));
 }
 function cityLabel(city,reader){return `${city?(reader?`按 <strong>${esc(city)}</strong> 搜索`:`按 <strong>${esc(city)}</strong> 的线索搜索 · 不代表本地有货`):(reader?'按产地和食材名搜索':'未设置所在城市；这里只按产地和食材名搜索。')} <button type="button" class="purchase-city-edit">${city?'更改城市':'设置城市'}</button>${city?'<button type="button" class="purchase-city-clear">清除</button>':''}`;}
 function render(food){
  const reader=Boolean(food.readerVersion),checks=(food.procurement?.checks||[food.buy||'核对名称、产地、商品形态和到货状态。']).filter(Boolean),city=getCity();
  return `<details class="food-purchase" data-reader="${reader?'1':'0'}" data-search="${esc(root.ReaderAccess?.entry(food)?.keyword||food.search||food.name)}"><summary>去找这味 <span aria-hidden="true">↗</span></summary><div class="purchase-content"><p class="purchase-query">${esc([root.ReaderAccess?.entry(food)?.keyword||food.search||food.name,city].filter(Boolean).join(' '))}</p><p class="purchase-city">${cityLabel(city,reader)}</p><form class="purchase-city-form" hidden><label>我所在的城市<input name="city" maxlength="40" autocomplete="address-level2" value="${esc(city)}" placeholder="例如：杭州"></label><button type="submit">保存城市</button></form><nav class="purchase-links" aria-label="搜索${esc(food.name)}">${links(food,city).map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${x.label} ↗</a>`).join('')}</nav><p class="purchase-disclaimer">${reader?'向卖家确认现货和送达时间。':'平台搜索，供应情况请自行核对。搜索结果不是已核实的本地货源或商家推荐。'}</p>${checks.length?`<p class="purchase-label">买前问清楚</p><ul>${checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${food.procurement?.route?`<p class="purchase-route">${esc(food.procurement.route)}</p>`:''}<button type="button" class="purchase-copy">复制采购词</button><span class="purchase-status" role="status" aria-live="polite"></span><label class="purchase-fallback" hidden>可手动复制采购词<textarea readonly rows="2">${esc([root.ReaderAccess?.entry(food)?.keyword||food.search||food.name,city].filter(Boolean).join(' '))}</textarea></label></div></details>`;
 }
 function refresh(container){container.querySelectorAll('.food-purchase').forEach(panel=>{const city=getCity(),base=panel.dataset.search,query=[base,city].filter(Boolean).join(' ');panel.querySelector('.purchase-query').textContent=query;panel.querySelectorAll('.purchase-links a').forEach((a,i)=>a.href=links({search:base},city)[i].url);panel.querySelector('.purchase-city').innerHTML=cityLabel(city,panel.dataset.reader==='1');panel.querySelector('.purchase-city-form [name=city]').value=city;panel.querySelector('.purchase-fallback textarea').value=query;});bind(container);}
 function bind(container){
  container.querySelectorAll('.food-purchase').forEach(panel=>{
   const form=panel.querySelector('.purchase-city-form'),edit=panel.querySelector('.purchase-city-edit'),clear=panel.querySelector('.purchase-city-clear');
   if(!edit.dataset.bound){edit.dataset.bound='true';edit.onclick=()=>{form.hidden=false;form.querySelector('input').focus();};}
   if(clear&&!clear.dataset.bound){clear.dataset.bound='true';clear.onclick=()=>{setCity('');refresh(container);};}
   if(!form.dataset.bound){form.dataset.bound='true';form.onsubmit=e=>{e.preventDefault();setCity(form.elements.city.value);form.hidden=true;refresh(container);};}
   const button=panel.querySelector('.purchase-copy');if(button.dataset.bound)return;button.dataset.bound='true';
   button.onclick=async()=>{const fallback=panel.querySelector('.purchase-fallback'),input=fallback.querySelector('textarea'),status=panel.querySelector('.purchase-status');button.disabled=true;try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(input.value);fallback.hidden=true;status.textContent='采购词已复制。';}catch{fallback.hidden=false;input.focus();input.select();status.textContent='长按或全选下方采购词复制。';}finally{button.disabled=false;}};
  });
 }
 const api={render,bind,refresh,links,esc,getCity,setCity};if(typeof module==='object'&&module.exports)module.exports=api;else root.FoodPurchase=api;
})(typeof window==='object'?window:globalThis);
