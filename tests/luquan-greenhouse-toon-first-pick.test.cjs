'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js'),ctx={window:{}};vm.createContext(ctx);
for(const n of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',n+'.js'),'utf8'),ctx);
const f=JSON.parse(JSON.stringify(ctx.window.FOODS.find(x=>x.id==='luquan-greenhouse-toon-first-pick'))),p=JSON.parse(JSON.stringify(ctx.window.LOTTERY_PROFILES['luquan-greenhouse-toon-first-pick']));

test('Luquan greenhouse toon records the sourced New Year first crop and distinguishes it from open-field spring toon',()=>{
 assert.ok(f);assert.equal(C.signature(f),p.signature);assert.equal(C.sensorySignature(f),p.senses.signature);
 assert.deepEqual(Array.from(f.peakTerms),[0]);assert.match(f.season,/元旦前后.*3月中旬/);assert.match(f.seasonEvidence,/不代表2027年具体上市已确认/);
 assert.ok(f.sources.some(([title,url])=>/石家庄市农业农村局/.test(title)&&url.includes('nyncj.sjz.gov.cn')));
 assert.ok(f.sources.some(([title,url])=>/地理标志/.test(title)&&url.includes('cpgi.org.cn')));
 assert.match(f.comparison.text,/温室促成.*露地采收在清明前后/);assert.ok(f.steps.length>=3&&f.buy&&f.storage&&f.safety);
 assert.match(f.imageCaption,/同种异地参考/);assert.match(f.imageCaption,/不代表鹿泉或冬季温室批次/);
 assert.ok(fs.statSync(path.join(root,'dist',f.image)).size>10000);
});

test('the greenhouse first crop adds one Xiaohan-only pool entry and reduces the audited gap',()=>{
 const audit=JSON.parse(execFileSync(process.execPath,[path.join(root,'scripts/audit-term-repetition.cjs'),'2026'],{encoding:'utf8'}));
 const term=audit.rows.find(row=>row.term==='小寒'),previous=audit.rows.find(row=>row.term==='冬至');
 assert.ok(term.foodIds.includes(f.id));assert.ok(!previous.foodIds.includes(f.id));
 assert.equal(term.count,36);assert.equal(term.repeated,18);assert.equal(term.requiredAdditionalFoodsNotInPreviousTerm,0);
});
