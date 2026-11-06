'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ctx=require('../scripts/audit-reader-access.cjs').load(),W=ctx.window,A=W.ReaderAccess,I=W.IngredientIdentity,C=W.FengwuLottery,T=require('../dist/tarot-core.js'),dir=path.join(__dirname,'../dist');
for(const name of ['lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(dir,name+'.js'),'utf8'),ctx);
const raw=W.FOODS,byId=Object.fromEntries(raw.map(f=>[f.id,f])),profiles=W.LOTTERY_PROFILES,events=C.eventsFrom(W.SOLAR_TERM_TIMES,W.SOLAR_TERM_NAMES);

test('editorial withdrawals disappear from shared public inputs while source records and distinctive local varieties remain',()=>{
 const withdrawn=Object.keys(A.withdrawn),visible=A.filter(raw),catalog=vm.runInContext('canonicalCatalog',ctx),foods=vm.runInContext('foods',ctx);
 assert.equal(withdrawn.length,20);
 for(const id of withdrawn){assert.ok(byId[id],id);assert.ok(A.withdrawn[id]);for(const list of [visible,catalog,foods])assert.ok(!list.some(f=>I.key(f)===id),id);}
 for(const id of ['dahan-green-carp','ganyu-zhaohu-xiaohan-greenhouse-strawberry','suixian-lishan-great-cold-shiitake'])assert.ok(withdrawn.includes(id),id);
 for(const id of ['nanhu-ling','pingdu-majiagou-celery','weixian-frost-radish'])assert.ok(catalog.some(f=>f.id===id),id);
});

test('the public three-year selection stays at 14 to 18 distinct foods after withdrawals without borrowing seasons',()=>{
 const terms=vm.runInContext('termWindow.map(t=>({name:termNames[t.index],foods:seasonFoodsFor(t),eligible:rankSeasonFoods(chinaParts(new Date(t.time+86400000)).month,t)}))',ctx);
 assert.equal(terms.length,73);
 for(const t of terms){assert.ok(t.foods.length>=14&&t.foods.length<=18,t.name+': '+t.foods.length);assert.equal(new Set(t.foods.map(W.SeasonSelection.group)).size,t.foods.length,t.name);for(const f of t.foods)assert.ok(t.eligible.some(e=>I.key(e)===I.key(f)),t.name+'/'+f.id);}
});

test('Sanmen blood cockles keep species, winter evidence, cooked-food guidance and credited imagery through the draw pipeline',()=>{
 const f=byId['sanmen-winter-blood-cockle'],p=profiles[f.id],hairy=raw.find(x=>x.name.includes('毛蚶'));
 assert.ok(hairy);assert.notEqual(I.key(f),I.key(hairy));assert.match(f.comparison.text,/Tegillarca granosa.*Scapharca subcrenata/);
 assert.match(f.seasonEvidence,/一般血蚶.*小寒至大寒/);assert.match(f.seasonEvidence,/不是当年三门肥度实验/);assert.match(f.safety,/彻底烹煮.*不生腌或半生/);
 assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const pool=(day,avoid=[])=>T.pool({foods:A.filter(raw),profiles,events,now:Date.parse(day+'T04:00:00Z'),avoid}).map(x=>x.food.id);
 assert.ok(pool('2027-01-25').includes(f.id));assert.ok(!pool('2027-07-15').includes(f.id));assert.ok(!pool('2027-01-25',['seafood']).includes(f.id));
 const media=require('../docs/DISTINCTIVE_MEDIA_20261106.json')[0];assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,media.path))).digest('hex'),media.sha256);assert.match(f.imageCaption,/非三门产地实拍/);assert.ok(fs.readFileSync(path.join(dir,'credits.html'),'utf8').includes(media.sourcePage));
});

test('kelp seedlings are vegetable candidates with current signatures and remain available to vegan readers',()=>{
 const f=byId['lianjiang-great-cold-kelp-seedlings'],p=profiles[f.id];assert.equal(f.category,'vegetable');assert.equal(p.family,'seaweed');assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));assert.ok(C.eligible(f,p,{avoid:['vegan']}));
});
