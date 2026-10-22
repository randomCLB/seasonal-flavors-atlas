'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js'));
test('Shidian Lixia green plums use the local picking custom without inflating adjacent terms',()=>{
 const f=ctx.window.FOODS.find(x=>x.id==='shidian-lixia-qingmei'),profile=ctx.window.LOTTERY_PROFILES['shidian-lixia-qingmei'];
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lixia=audit.rows.find(x=>x.term==='立夏');
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[8]);assert.deepEqual(Array.from(f.entryTerms),[8]);
 assert.ok(f.sources.some(x=>x[1]==='https://www.shidian.gov.cn/info/1111/3826023.htm'));
 assert.match(f.season,/立夏采青梅的习俗/);assert.match(f.season,/不据单篇报道推定/);assert.match(f.taste,/不是本站试吃/);
 assert.match(f.pitfall,/鲜青梅、梅酒、梅干/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/非实物摄影/);
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(profile.signature,C.signature(f));assert.equal(profile.senses.signature,C.sensorySignature(f));
 assert.ok(lixia.foodIds.includes(f.id));assert.ok(!audit.rows.find(x=>x.term==='谷雨').foodIds.includes(f.id));assert.ok(!audit.rows.find(x=>x.term==='小满').foodIds.includes(f.id));
 ;
});

test('Jiuzhaigou Lixia water fern preserves the limits of local market evidence',()=>{
 const f=ctx.window.FOODS.find(x=>x.id==='jiuzhaigou-lixia-water-fern'),profile=ctx.window.LOTTERY_PROFILES['jiuzhaigou-lixia-water-fern'];
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const lixia=audit.rows.find(x=>x.term==='立夏');
 assert.ok(f);assert.deepEqual(Array.from(f.peakTerms),[8]);assert.deepEqual(Array.from(f.entryTerms),[8]);
 assert.ok(f.sources.some(x=>x[1]==='https://www.jzg.gov.cn/jzgrmzf/c101368/202505/42e49f1ceb8845abae99f3f9dc49231d.shtml'));
 assert.match(f.season,/2025年5月12日/);assert.match(f.season,/不保证其他年份上市/);assert.match(f.description,/没有给植物学鉴定/);
 assert.match(f.safety,/不采食身份不明/);assert.ok(f.procurement.checks.length>=3);assert.match(f.imageCaption,/不用于.*植物鉴定/);
 assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(profile.signature,C.signature(f));assert.equal(profile.senses.signature,C.sensorySignature(f));
 assert.ok(lixia.foodIds.includes(f.id));assert.ok(!audit.rows.find(x=>x.term==='谷雨').foodIds.includes(f.id));assert.ok(!audit.rows.find(x=>x.term==='小满').foodIds.includes(f.id));
 ;;
});
