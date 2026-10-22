'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('Dongguan Shixia longan adds a sourced Xiaoshu window after Summer Solstice',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='dongguan-tangxia-shixia-longan',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.deepEqual(Array.from(food.peakWindows[0]),['07-21','08-31']);assert.equal(food.seasonPrecision,'approximate-window');
 assert.match(food.season,/七月中下旬进入集中上市期/);assert.ok(food.sources.some(x=>x[1]==='https://nyncj.dg.gov.cn/zzzl/content/post_4561932.html'));assert.ok(food.sources.some(x=>x[1]==='https://nyncj.dg.gov.cn/zixun/snkd/content/post_4043533.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/非东莞实拍/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),solstice=audit.rows.find(x=>x.term==='夏至'),xiaoshu=audit.rows.find(x=>x.term==='小暑');
 assert.ok(!solstice.foodIds.includes(id));assert.ok(xiaoshu.foodIds.includes(id));
});
