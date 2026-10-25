'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {load,audit}=require('../scripts/audit-reader-access.cjs'),ctx=load(),W=ctx.window,A=W.ReaderAccess,M=W.FoodMedia,I=W.IngredientIdentity,dir=path.join(__dirname,'../dist'),raw=W.FOODS,byId=Object.fromEntries(raw.map(f=>[f.id,f]));
const read=n=>fs.readFileSync(path.join(dir,n),'utf8');
test('Taiwan seafood without verified identity-matched access is absent from the reader catalog',()=>{
 const catalog=vm.runInContext('canonicalCatalog',ctx),withdrawn=I.catalog(raw).filter(f=>!A.visible(f));assert.equal(raw.length,357);assert.equal(catalog.length,294);assert.equal(withdrawn.length,31);
 for(const id of ['taiwan-lichiu-kaohsiung-xiaochuan','taiwan-jingzhe-tongjian','suao-jingzhe-huahui','suao-jingzhe-muhou','suao-jingzhe-dingmian','keelung-jingzhe-wenyu','taiwan-lichiu-penghu-shrimp','taiwan-qiufen-northeast-shrimp']){assert.ok(byId[id]);assert.ok(!A.visible(byId[id]),id);assert.ok(!catalog.some(f=>f.id===I.key(id)));}
 // Region strings without the literal Taiwan must not bypass the policy.
 assert.ok(A.scope(byId['taiwan-lichun-mackerel']));assert.ok(A.visible(byId['taiwan-lichun-mackerel']));
 assert.ok(catalog.filter(A.scope).every(f=>A.entry(f)?.video||A.entry(f)?.mainland));
});
test('admission evidence uses real Bilibili video IDs and explicit review dates rather than search placeholders',()=>{
 assert.equal(Object.keys(A.evidence).length,11);for(const [id,e]of Object.entries(A.evidence)){assert.ok(byId[id]);assert.match(e.video[1],/^https:\/\/www\.bilibili\.com\/video\/BV[A-Za-z0-9]+\/$/);assert.equal(e.checkedAt,'2026-10-24');assert.ok(e.keyword);if(e.mainland)assert.ok(e.channel);assert.match(A.links(byId[id]),/class="verified-video"/);}
});
test('visibility and image resolution never rewrite source evidence, aliases or draw signatures',()=>{
 const before=JSON.stringify(raw),C=W.FengwuLottery,signatures=raw.map(C.signature);for(const f of raw){A.visible(f);A.entry(f);M.ingredient(f);M.recipe(f);}I.catalog(A.filter(raw));assert.equal(JSON.stringify(raw),before);assert.deepEqual(raw.map(C.signature),signatures);
});
test('one shared resolver supplies formerly registry-only images and keeps dish pictures separate',()=>{
 for(const id of ['hezhou-xialiang-xiaohan-goji-greens','ganyu-zhaohu-xiaohan-greenhouse-strawberry','luocheng-dafu-xiaohan-black-wood-ear','suixian-lishan-great-cold-shiitake']){const f=byId[id],m=M.ingredient(f);assert.ok(m.src,id);assert.ok(fs.existsSync(path.join(dir,m.src)));assert.equal(m.src,W.PhotoReview.records[id].src);}
 const pea=byId['chuan-yu-dahan-pea-tips'];assert.match(M.ingredient(pea).src,/pea_tips.webp$/);assert.match(M.recipe(pea).src,/pea_dish.webp$/);assert.equal(M.recipe(pea).kind,'dish');assert.equal(M.ingredient(pea).kind,'ingredient');
});
test('every curated term has real local covers and preserves its sourced feature; full catalog retains unresolved entries',()=>{
 for(const t of vm.runInContext('termWindow',ctx)){ctx.t=t;const list=vm.runInContext('seasonFoodsFor(t)',ctx);assert.ok(list.length);assert.ok(list.some(f=>f.id===W.SEASON_FEATURES[t.index].foodId),W.SOLAR_TERM_NAMES[t.index]);for(const f of list){assert.ok(A.visible(f));assert.ok(M.hasIngredient(f),f.id);assert.ok(fs.existsSync(path.join(dir,M.ingredient(f).src)),f.id);}}
 const report=audit();assert.equal(report.broken.length,0);const expected=require('../docs/VISUAL_COVERAGE_20261024.json');assert.equal(JSON.stringify(report.missing.map(f=>f.id).sort()),JSON.stringify(expected.missingHome.map(f=>f.id).sort()));assert.equal(report.covered,expected.homeCovered);
});
test('all added photographs retain source and derivative hashes with on-site credits',()=>{
 const manifest=require('../docs/READER_MEDIA_20261024.json');assert.equal(manifest.length,9);for(const p of manifest){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,p.path))).digest('hex'),p.sha256);assert.match(p.sourceSha256,/^[a-f0-9]{64}$/);assert.match(p.license,/^(CC0|CC BY|Public domain)/);assert.ok(read('credits.html').includes(p.source.replaceAll('&','&amp;')));}
});
test('all production entrypoints load shared media and access before record and draw rendering',()=>{
 for(const name of ['index.html','tarot.html','lottery.html']){const h=read(name);for(const n of ['reader-access','food-media','reader-media-additions']){assert.ok(h.indexOf(n+'.js')<h.indexOf('food-records.js'));if(name!=='index.html')assert.match(h,new RegExp('<script src="'+n+'\\.js[^>]* defer>'));}}
 assert.match(read('food-records.js'),/photo=root\.FoodMedia\?\.ingredient\(f\)/);assert.match(read('lottery-ui.js'),/media=window\.FoodMedia\?\.ingredient\(f\)/);assert.match(read('tarot-spread-ui.js'),/window\.FoodMedia\?\.recipe\(f\)/);assert.match(read('app.js'),/search-food-photo/);
});
