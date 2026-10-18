'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,'dist',n),'utf8');
const P=require('../dist/food-purchase.js'),C=require('../dist/lottery-core.js'),T=require('../dist/tarot-core.js');
const ctx={window:{FoodPurchase:P,FoodRecords:{render:()=>''}}};vm.createContext(ctx);
const data=['data.js','editorial.js','editorial-notes.js','november-additions.js','core-refinements.js'];
for(const file of [...data,'lottery-profiles.js','lottery-senses.js','food-detail.js'])vm.runInContext(read(file),ctx);
const foods=ctx.window.FOODS,byId=Object.fromEntries(foods.map(f=>[f.id,f]));
test('all live entrypoints use the same ordered catalog, including November and refinements',()=>{
 for(const page of ['index.html','tarot.html','lottery.html']){
  const scripts=[...read(page).matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);
  assert.deepEqual(scripts.filter(s=>data.includes(s)),data,page);
  assert.ok(scripts.indexOf('food-purchase.js')<scripts.findIndex(s=>['app.js','tarot-spread-ui.js','lottery-ui.js'].includes(s)));
 }
 assert.equal(foods.length,86);assert.equal(new Set(foods.map(f=>f.id)).size,86);
});
test('twelve records have actionable state checks and source-backed comparison without altering recipes',()=>{
 const previous=JSON.parse(fs.readFileSync(path.join(root,'docs/first-batch-20261018/before-foods.json'),'utf8'));
 assert.equal(Object.keys(ctx.window.CORE_REFINEMENTS).length,12);
 for(const old of previous){const f=byId[old.id];assert.ok(f.procurement.checks.length>=2);assert.ok(f.procurement.route);assert.match(f.comparison.source,/^https:\/\//);assert.equal(C.signature(f),C.signature(old),f.id);}
 for(const f of foods){const p=ctx.window.LOTTERY_PROFILES[f.id];assert.equal(p.signature,C.signature(f),f.id);assert.equal(p.senses.signature,C.sensorySignature(f),f.id);}
});
test('search query round-trips punctuation and cannot inject markup or destinations',()=>{
 const f={name:'test',search:'台东 花萼 & "鲜货" #? 🍒',procurement:{checks:['<img onerror=bad()>']}};
 const links=P.links(f);assert.deepEqual(links.map(x=>new URL(x.url).hostname),['www.bing.com','s.taobao.com','search.jd.com']);
 for(const x of links){const u=new URL(x.url);assert.equal(u.searchParams.get(u.hostname==='search.jd.com'?'keyword':'q'),f.search);}
 const html=P.render(f);assert.ok(!html.includes('<img onerror'));assert.ok(html.includes('&lt;img'));assert.equal((html.match(/target="_blank"/g)||[]).length,3);assert.match(html,/rel="noopener noreferrer"/);
});
test('every food can show a procurement entry with a manual-copy fallback and honest stock label',()=>{
 for(const f of foods){const html=P.render(f);assert.match(html,/去找这味/);assert.match(html,/供应情况请自行核对/);assert.match(html,/<textarea readonly/);assert.equal((html.match(/target="_blank"/g)||[]).length,3);}
});
test('refined display media exists, identifies generated references and excludes pending-license dishes',()=>{
 const prohibited=['cizhousun-salad.jpg','baoying-cigu-pork2.jpg','zengcheng-caixin-plem.jpg','lyg-shaguang-soup.jpg','lintong-huojing-cut.jpg','jinjiang-zicai-soup.jpg'];
 for(const id of Object.keys(ctx.window.CORE_REFINEMENTS)){
  const f=byId[id],m=T.mediaFor(f);assert.ok(m,id);assert.ok(fs.existsSync(path.join(root,'dist',m.src)));
  assert.ok(!prohibited.some(p=>m.src.endsWith(p)),id);
  if(/generated/.test(m.src))assert.match(T.imageNote(f),/生成/);
  const recognition={src:f.image||f.cardImage,alt:f.imageAlt||f.cardImageAlt,note:f.imageCaption||f.cardNote,fit:'cover'};
  const html=ctx.window.FoodDetail.html(f,{recognition,seasonLabel:'时令参考',category:'test',originHtml:'',similar:[],imageAttrs:''});
  assert.equal((html.match(/class="reader-section"/g)||[]).length,4);
  if(f.dishImage===recognition.src)assert.equal((html.match(/<img /g)||[]).length,1,id);
 }
});
