'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');

test('Chaoyang Xilu Wusu waxberry keeps its sourced post-Mangzhong window',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='chaoyang-xilu-wusu-waxberry',food=ctx.window.FOODS.find(x=>x.id===id),C=require('../dist/lottery-core.js'),profile=ctx.window.LOTTERY_PROFILES[id];
 assert.ok(food);assert.equal(food.category,'fruit');assert.deepEqual(Array.from(food.peakTerms),[10]);assert.deepEqual(Array.from(food.entryTerms),[10]);
 assert.match(food.season,/芒种后采收/);assert.match(food.description,/质脆/);assert.ok(food.sources.some(x=>x[1]==='https://www.shantou.gov.cn/nyj/fctp/tsncp/content/post_930909.html'));
 assert.ok(fs.existsSync(path.join(root,'dist',food.image)));assert.match(food.imageCaption,/生成示意/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const term=audit.rows.find(x=>x.term==='芒种'),previous=audit.rows.find(x=>x.term==='小满');
 assert.ok(term.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));assert.equal(term.requiredAdditionalFoodsNotInPreviousTerm,Math.max(0,term.repeated*2-term.count));
});
