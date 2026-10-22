'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Lanxi Huitan sugarcane uses the sourced late-November bulk-harvest term and completes Lidong overlap target',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='lanxi-huitan-sugarcane',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[20]);assert.deepEqual(Array.from(food.entryTerms),[20]);assert.equal(food.seasonBasis,'harvest');assert.match(food.season,/11月中下旬进入大规模采收/);assert.match(food.description,/标准描述/);assert.match(food.pitfall,/不凭蔗皮颜色鉴定/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.cnipa.gov.cn/attach/0/20250826010509.pdf'));assert.ok(food.sources.some(x=>x[1]==='https://cs.zjol.com.cn/tszc/202211/t20221102_24997901.shtml'));assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非实物摄影/);
 assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),lidong=audit.rows.find(x=>x.term==='立冬'),xiaoxue=audit.rows.find(x=>x.term==='小雪');
 assert.ok(lidong.foodIds.includes(id));assert.ok(!xiaoxue.foodIds.includes(id));assert.equal(lidong.repeatRate,0.5);
 ;
});
