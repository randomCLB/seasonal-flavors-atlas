/* Shared search entry: platform results are leads, never stock or seller endorsements. */
(function(root){
 'use strict';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function links(food){
  const query=food.search||food.name;
  return [['必应 · 通用搜索','https://www.bing.com/search','q'],['淘宝搜索','https://s.taobao.com/search','q'],['京东搜索','https://search.jd.com/Search','keyword']].map(([label,base,key])=>({label,url:base+'?'+key+'='+encodeURIComponent(query)}));
 }
 function render(food){
  const checks=food.procurement?.checks||[food.buy||'核对名称、产地、商品形态和到货状态。'];
  return `<details class="food-purchase"><summary>去找这味 <span aria-hidden="true">↗</span></summary><div class="purchase-content"><p class="purchase-query">${esc(food.search||food.name)}</p><nav class="purchase-links" aria-label="搜索${esc(food.name)}">${links(food).map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${x.label} ↗</a>`).join('')}</nav><p class="purchase-disclaimer">平台搜索，供应情况请自行核对。淘宝、京东可能要求登录或验证，也可复制采购词自行查找。</p><p class="purchase-label">找到以后，先问这几件事</p><ul>${checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${food.procurement?.route?`<p class="purchase-route">${esc(food.procurement.route)}</p>`:''}<button type="button" class="purchase-copy">复制采购词</button><p class="purchase-status" role="status" aria-live="polite"></p><label class="purchase-fallback" hidden>可手动复制采购词<textarea readonly rows="2">${esc(food.search||food.name)}</textarea></label></div></details>`;
 }
 function bind(container){
  container.querySelectorAll('.food-purchase').forEach(panel=>{
   const button=panel.querySelector('.purchase-copy');
   if(button.dataset.bound)return;
   button.dataset.bound='true';
   button.onclick=async()=>{
    const fallback=panel.querySelector('.purchase-fallback'),input=fallback.querySelector('textarea'),status=panel.querySelector('.purchase-status');
    button.disabled=true;
    try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(input.value);fallback.hidden=true;status.textContent='采购词已复制，可以粘贴到你常用的平台。';}
    catch{fallback.hidden=false;input.focus();input.select();status.textContent='可长按或全选下方采购词复制。';}
    finally{button.disabled=false;}
   };
  });
 }
 const api={render,bind,links,esc};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.FoodPurchase=api;
})(typeof window==='object'?window:globalThis);
