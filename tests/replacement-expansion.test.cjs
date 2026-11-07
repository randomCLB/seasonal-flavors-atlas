'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ctx=require('../scripts/audit-reader-access.cjs').load(),W=ctx.window,C=W.FengwuLottery,T=require('../dist/tarot-core.js'),dir=path.join(__dirname,'../dist'),report=require('../docs/REPLACEMENT_BATCH_20261106.json'),media=require('../docs/REPLACEMENT_MEDIA_20261106.json');
for(const name of ['lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(dir,name+'.js'),'utf8'),ctx);
const byId=Object.fromEntries(W.FOODS.map(f=>[f.id,f])),profiles=W.LOTTERY_PROFILES,publicFoods=W.ReaderAccess.filter(W.FOODS),events=C.eventsFrom(W.SOLAR_TERM_TIMES,W.SOLAR_TERM_NAMES);

test('the replacement batch adds nine distinct public foods including six non-fish animal foods without restoring withdrawn entries',()=>{
 assert.equal(report.added.length,9);assert.equal(new Set(report.added.map(f=>W.IngredientIdentity.key(f.id))).size,9);
 const animal=report.added.filter(f=>['protein','seafood'].includes(f.category));assert.equal(animal.length,6);
 for(const r of report.added){const f=byId[r.id];assert.ok(publicFoods.some(x=>x.id===r.id),r.id);assert.ok(f.sources.length&&f.sources.every(([title,url])=>title&&url.startsWith('https://')),r.id);assert.ok(W.FoodMedia.hasIngredient(f),r.id);assert.ok(f.seasonEvidence&&f.safety&&f.steps.length>=3,r.id);assert.equal(profiles[r.id].signature,C.signature(f),r.id);assert.equal(profiles[r.id].senses.signature,C.sensorySignature(f),r.id);}
 for(const id of Object.keys(W.ReaderAccess.withdrawn))assert.ok(!publicFoods.some(f=>W.IngredientIdentity.key(f)===id),id);
});

test('the three-year public plan stays at 16 to 18 foods, preserves the overlap limit, and brings animal food to Lixia',()=>{
 const terms=vm.runInContext('termWindow.map(t=>({year:t.year,index:t.index,foods:seasonFoodsFor(t)}))',ctx);assert.equal(terms.length,73);
 for(const [i,t]of terms.entries()){assert.ok(t.foods.length>=16&&t.foods.length<=18,t.index+': '+t.foods.length);assert.equal(new Set(t.foods.map(W.SeasonSelection.group)).size,t.foods.length);if(i){const previous=new Set(terms[i-1].foods.map(W.SeasonSelection.group));assert.ok(t.foods.filter(f=>previous.has(W.SeasonSelection.group(f))).length<=t.foods.length/2,t.index);}}
 const term=(index)=>terms.find(t=>t.year===2027&&t.index===index).foods;
 for(const [index,id]of [[7,'longchuan-spring-ant-brood'],[8,'daishan-spring-yellow-mudsnail'],[10,'bazhong-spring-oak-silkworm-pupae'],[10,'yueqing-meiyu-rainbow-clam'],[22,'lijiang-winter-dobsonfly-larvae']])assert.ok(term(index).some(f=>f.id===id),id);
});

test('fresh batch and edible-stage windows reach draws with dietary restrictions and the mid-June pupal gate intact',()=>{
 const pool=(day,avoid=[])=>T.pool({foods:publicFoods,profiles,events,now:Date.parse(day+'T04:00:00Z'),avoid}).map(x=>x.food.id);
 for(const [id,day,outside]of [['daishan-spring-yellow-mudsnail','2027-05-10','2027-06-15'],['yueqing-meiyu-rainbow-clam','2027-06-15','2027-02-10'],['longchuan-spring-ant-brood','2027-04-25','2027-05-10'],['bazhong-spring-oak-silkworm-pupae','2027-06-15','2027-06-10'],['zhenkang-late-autumn-wasp-brood','2027-10-28','2027-04-25'],['lijiang-winter-dobsonfly-larvae','2027-12-10','2027-02-10'],['suzhou-spring-pine-pollen','2027-04-25','2027-01-25'],['jinhua-early-summer-gardenia-buds','2027-06-15','2027-02-10'],['tengchong-late-winter-palm-bud','2027-02-10','2027-05-10']]){assert.ok(pool(day).includes(id),id);assert.ok(!pool(outside).includes(id),id+' outside window');if(['protein','seafood'].includes(byId[id].category))assert.ok(!pool(day,['vegan']).includes(id),id+' vegan');}
 assert.ok(!pool('2027-06-15',['egg']).includes('jinhua-early-summer-gardenia-buds'));
});

test('reviewed photos and labeled illustrations retain original hashes and expose provenance without claiming documentary originality',()=>{
 assert.equal(media.length,9);assert.equal(media.filter(m=>m.kind==='licensed-photo').length,3);const credits=fs.readFileSync(path.join(dir,'credits.html'),'utf8');
 for(const m of media){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,m.path))).digest('hex'),m.sha256,m.id);const resolved=W.FoodMedia.ingredient(byId[m.id]);assert.equal(resolved.src,m.path);assert.equal(resolved.fit,'contain');if(m.kind==='licensed-photo'){assert.match(m.license,/^CC BY/);assert.ok(credits.includes(m.source.replaceAll('&','&amp;')));}else assert.match(resolved.note,/生成示意.*非实拍/);}
 W.FoodPurchase=require('../dist/food-purchase.js');ctx.document.addEventListener=()=>{};ctx.document.querySelectorAll=()=>[];W.addEventListener=()=>{};for(const name of ['food-records','food-detail'])vm.runInContext(fs.readFileSync(path.join(dir,name+'.js'),'utf8'),ctx);
 const f=byId['longchuan-spring-ant-brood'],html=W.FoodDetail.html(f,{recognition:W.FoodMedia.ingredient(f),seasonLabel:f.seasonLabel,category:'肉类',originHtml:'',similar:[]});assert.match(html,/data-illustration="true"/);assert.match(html,/<span class="visual-role">生成示意<\/span>/);
});
