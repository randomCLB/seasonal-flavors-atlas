'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Huocheng Xiangfei crabapple adds a cross-year August harvest window to Daxu',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='huocheng-xiangfei-crabapple',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['08-01','08-15']);assert.equal(food.seasonPrecision,'approximate-window');assert.match(food.season,/2025年.*八月初.*2026年.*八月中旬/);
 assert.ok(food.sources.some(x=>x[1]==='https://www.xjhc.gov.cn/xjhc/c113327/202508/3d03b2eaffe1408493ae7bee0af69541.shtml'));assert.ok(food.sources.some(x=>x[1]==='https://www.xjhc.gov.cn/xjhc/c113324/202608/b9c4edaca05b4639b33b323c9223fe3d.shtml'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非霍城实拍/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),xiaoshu=audit.rows.find(x=>x.term==='小暑'),daxue=audit.rows.find(x=>x.term==='大暑');
 assert.ok(!xiaoshu.foodIds.includes(id));assert.ok(daxue.foodIds.includes(id));assert.equal(daxue.repeatRate,0.5);
});
