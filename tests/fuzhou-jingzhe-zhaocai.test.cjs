'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Fuzhou Jingzhe zhaocai is a sourced local preserved-food custom, not a fresh harvest claim',()=>{
 const id='fuzhou-jingzhe-zhaocai',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[4]);assert.deepEqual(Array.from(f.entryTerms),[4]);assert.equal(f.seasonPrecision,'solar-term-custom');
 assert.match(f.season,/惊蛰时常吃糟菜/);assert.match(f.season,/节俗时点，不表示糟菜只在惊蛰供应/);assert.match(f.description,/芥菜、红酒糟和盐腌制/);
 assert.match(f.comparison.text,/并非鲜芥菜/);assert.match(f.recipeTitle,/糟菜煮粉干/);assert.ok(f.sources.some(x=>x[1]==='https://www.fuzhou.gov.cn/zgfzzt/zjrc/mdfc/msfq/202512/t20251205_5240956.htm'));
 assert.ok(f.sources.some(x=>x[1]==='https://www.fzmq.gov.cn/xjwz/zjmq/zrdl/201704/t20170413_391146.htm'));assert.ok(f.sources.some(x=>x[1]==='https://www.minhou.gov.cn/xjwz/mlmh/mytc/202207/t20220705_4392196.htm'));
 assert.match(f.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 for(const [term,shouldInclude] of [['雨水',false],['惊蛰',true],['春分',false]])assert.equal(audit.rows.find(x=>x.term===term).foodIds.includes(id),shouldInclude,term);
});
