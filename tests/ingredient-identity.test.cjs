'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const W=require('../scripts/audit-reader-copy.cjs').load(),dir=path.join(__dirname,'../dist'),read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const ctx={window:W,document:{getElementById:()=>({style:{}})}};vm.createContext(ctx);
for(const f of ['ingredient-identity','photo-review','catalog-photos','season-features','season-selection'])vm.runInContext(read(f+'.js'),ctx);
const I=W.IngredientIdentity,S=W.SeasonSelection,byId=Object.fromEntries(W.FOODS.map(f=>[f.id,f]));
W.FengwuLottery=require('../dist/lottery-core.js');
const app=read('app.js');vm.runInContext(app.slice(0,app.indexOf('function renderTermRail')),ctx);
test('explicit identity map uses existing IDs with no conflicting assignments',()=>{
 const seen=new Set();for(const g of I.groups){assert.ok(g.ids.length>1);assert.equal(g.id,g.ids[0]);for(const id of g.ids){assert.ok(byId[id],id);assert.ok(!seen.has(id),id);seen.add(id);assert.equal(I.key(id),g.id);assert.equal(I.key(I.key(id)),g.id);}}
});
test('source observations remain byte-identical while catalog has one card per identity',()=>{
 const before=JSON.stringify(W.FOODS),catalog=I.catalog(W.FOODS);assert.equal(new Set(catalog.map(f=>f.id)).size,catalog.length);assert.ok(catalog.length<W.FOODS.length-25);
 for(const g of I.groups){const f=catalog.find(f=>f.id===g.id);assert.equal(f.name,g.name);for(const id of g.ids){assert.ok(f.alias.includes(byId[id].name));for(const pair of byId[id].sources||[])assert.ok(f.sources.some(s=>JSON.stringify(s)===JSON.stringify(pair)));}}
 assert.equal(JSON.stringify(W.FOODS),before);console.log('IDENTITY_COUNTS',JSON.stringify({observations:W.FOODS.length,ingredients:catalog.length,groups:I.groups.length,mergedCards:W.FOODS.length-catalog.length}));
});
test('known duplicated regional and term pages resolve to exactly the same stable identity',()=>{
 for(const pair of [['qingdao-shazikou-li-xia','qingdao-shazikou-li-xia-shrimp-2026'],['hejiang-late-lychee','hejiang-xiaoshu-late-lychee'],['taiwan-jialiao-bream','taiwan-rainwater-jialai-fish'],['taiwan-jialiao-bream','taiwan-lidong-east-jiana-fish'],['taiwan-lidong-east-red-eye-bream','taiwan-lichiu-red-eye-bream'],['emei-wenchun-dahan-early-tea','jiangan-changsha-xiaohan-early-tea-first-pick']])assert.equal(I.key(pair[0]),I.key(pair[1]),pair.join('/'));
});
test('a shared culinary alias never auto-merges unrelated edible parts or distinct named cultivars',()=>{
 for(const pair of [['foshougua-miao','fengqing-xinhua-walnut-flowers'],['fengqing-xinhua-walnut-flowers','shiping-shaochong-bailu-walnut'],['taiwan-daxue-mullet','taiwan-winter-solstice-mullet-roe'],['tongxiang-zhuili','zhenning-honey-plum'],['taiwan-daxue-korean-seerfish','taiwan-daxue-eastern-striped-bonito'],['suao-dahan-black-skin-marlin','suao-xiaohan-white-skin-sailfish']])assert.notEqual(I.key(pair[0]),I.key(pair[1]),pair.join('/'));
});
test('food-family deduplication crosses UI-category and naming boundaries',()=>{
 for(const pair of [['hubei-ejiao4-summer-jiaobai','zhenlai-jiaobai'],['caidian-summer-solstice-fresh-lotus-pod','shicheng-white-lotus'],['taiwan-lidong-east-jiana-fish','taiwan-jialiao-bream'],['qingdao-shazikou-qingming-spring-mackerel','taiwan-frost-white-belly-seerfish'],['beian-xiaohan-white-lover-strawberry','ganyu-zhaohu-xiaohan-greenhouse-strawberry'],['linan-early-spring-leizun','minhou-chayuan-highland-spring-shoot']])assert.equal(S.group(byId[pair[0]]),S.group(byId[pair[1]]),pair.join('/'));
});
test('all 24 curated and all-in-season lists are unique by identity and tasting family',()=>{
 const terms=vm.runInContext('termWindow',ctx);for(const t of terms){ctx.event=t;for(const expr of ['seasonFoodsFor(event)','rankSeasonFoods(chinaParts(new Date(event.time+86400000)).month,event)']){const list=vm.runInContext(expr,ctx);assert.ok(list.length);assert.equal(new Set(list.map(I.key)).size,list.length,W.SOLAR_TERM_NAMES[t.index]);assert.equal(new Set(list.map(S.group)).size,list.length,W.SOLAR_TERM_NAMES[t.index]);for(const f of list)assert.ok(!S.holds[f.id]);}}
});
test('adjacent-term rotation cannot reset repetition simply by changing origin or record ID',()=>{
 const prior=[byId['hejiang-late-lychee'],byId['taiwan-jialiao-bream']],pool=[byId['hejiang-xiaoshu-late-lychee'],byId['tamsui-xiaoshu-jiala'],byId.cigu];const result=S.plan([pool],prior)[0],old=new Set(prior.map(S.group));assert.equal(result.length,2);assert.equal(result.filter(f=>old.has(S.group(f))).length,1);
});
test('regional dates, named source records and original safety evidence remain in the unified detail',()=>{
 for(const g of I.groups){const f=I.detail(g.id),html=I.sourceHtml(f);assert.ok(html.includes('identity-origins'));for(const id of g.ids){const raw=byId[id];assert.ok(f.alias.includes(raw.name));for(const p of raw.placeSeasons||[])assert.ok(f.placeSeasons.some(q=>q.name===p.name&&q.lat===p.lat&&q.lon===p.lon));if(raw.safety!==f.safety&&raw.safety)assert.ok(html.includes(raw.safety.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));}}
});
test('map popup collapses multiple ports and aliases without dropping their place labels',()=>{
 const entries=['taiwan-jialiao-bream','tamsui-xiaoshu-jiala'].map((id,i)=>({food:byId[id],place:{name:'港口'+i,months:[i+1]}})),result=I.mapEntries(entries);assert.equal(result.length,1);assert.match(result[0].place.name,/港口0/);assert.match(result[0].place.name,/港口1/);assert.equal(result[0].food.id,'taiwan-jialiao-bream');
});
test('saved regional IDs merge by latest choice and ties keep tried without mutating input',()=>{
 const a='qingdao-shazikou-li-xia',b='qingdao-shazikou-li-xia-shrimp-2026',saved={[a]:{state:'want',updatedAt:10},[b]:{state:'tried',updatedAt:20}},before=JSON.stringify(saved),out=I.migrate(saved);assert.equal(Object.keys(out).length,1);assert.equal(out[I.key(a)].state,'tried');assert.equal(JSON.stringify(saved),before);
});
test('production entrypoints load identities before record controls and deferred draws stay deferred',()=>{
 for(const name of ['index.html','tarot.html','lottery.html']){const html=read(name);assert.ok(html.indexOf('ingredient-identity.js')>=0);assert.ok(html.indexOf('ingredient-identity.js')<html.indexOf('food-records.js'));if(name!=='index.html')assert.match(html,/<script src="ingredient-identity\.js[^\"]*" defer><\/script>/);}
 assert.match(read('index.html'),/目录版 2026\.10\.24-identity\.1/);
});
