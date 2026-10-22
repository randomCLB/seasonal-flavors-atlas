'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('White Dew eel record uses the full local fishing window and is clearly historical',()=>{
 const id='suzhou-bailu-river-eel',f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(f);assert.deepEqual(Array.from(f.peakWindows[0]),['09-08','10-07']);assert.equal(f.seasonPrecision,'approximate-window');
 assert.match(f.season,/白露以后一个月内/);assert.match(f.season,/不能确认2026年实际渔获/);assert.match(f.description,/本站未试吃/);
 assert.ok(f.sources.some(x=>x[1]==='https://dfzb.suzhou.gov.cn/dfzb/szdq/202209/a654d993a70c4c119b1db6f57dcfe9d5.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.match(f.imageCaption,/非.*实拍/);assert.equal(p.signature,C.signature(f));assert.equal(p.senses.signature,C.sensorySignature(f));
});
test('Zhanqi early orange and Henan soft-seed pomegranate add sourced term-specific peaks',()=>{
 const orange=ctx.window.FOODS.find(x=>x.id==='ningbo-zhanqi-dafeng-early-orange'),orangeProfile=ctx.window.LOTTERY_PROFILES[orange.id];
 const pomegranate=ctx.window.FOODS.find(x=>x.id==='henan-qiufen-tunisian-softseed-pomegranate'),pomegranateProfile=ctx.window.LOTTERY_PROFILES[pomegranate.id];
 assert.ok(orange);assert.deepEqual(Array.from(orange.peakTerms),[18]);assert.match(orange.season,/10月为最佳上市期/);assert.match(orange.season,/不代表2026年上市日/);assert.ok(orange.sources.some(x=>x[1]==='https://www.nbyz.gov.cn/art/2024/10/9/art_1229610313_59230292.html'));assert.equal(orangeProfile.signature,C.signature(orange));assert.equal(orangeProfile.senses.signature,C.sensorySignature(orange));
 assert.ok(pomegranate);assert.deepEqual(Array.from(pomegranate.peakTerms),[17]);assert.match(pomegranate.season,/9月下旬开始成熟/);assert.match(pomegranate.description,/软籽/);assert.ok(pomegranate.sources.some(x=>x[1]==='https://nyj.nanyang.gov.cn/2024/09-24/619316.html'));assert.equal(pomegranateProfile.signature,C.signature(pomegranate));assert.equal(pomegranateProfile.senses.signature,C.sensorySignature(pomegranate));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const autumn=audit.rows.find(x=>x.term==='秋分'),hanlu=audit.rows.find(x=>x.term==='寒露'),bailu=audit.rows.find(x=>x.term==='白露');
 assert.ok(autumn.foodIds.includes('suzhou-bailu-river-eel'));assert.ok(autumn.foodIds.includes(pomegranate.id));assert.ok(hanlu.foodIds.includes(orange.id));assert.ok(bailu.foodIds.includes('suzhou-bailu-river-eel'));
 assert.equal(autumn.repeatRate,0.5);
});
