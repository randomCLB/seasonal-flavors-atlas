'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
test('West Lake Longjing group-cultivar entry is limited to the sourced late-March picking stage',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const id='xihu-longjing-group-late-march',food=ctx.window.FOODS.find(x=>x.id===id),C=require(path.join(root,'dist/lottery-core.js'));
 assert.ok(food);assert.deepEqual(Array.from(food.peakTerms),[5]);assert.deepEqual(Array.from(food.entryTerms),[5]);assert.match(food.season,/2024、2025、2026年/);assert.match(food.season,/不确认下一年度采摘或现货/);assert.match(food.pitfall,/不等于所有西湖龙井/);assert.equal(food.category,'tea');
 assert.ok(food.sources.some(x=>x[1]==='https://agri.hangzhou.gov.cn/art/2025/3/18/art_1229708901_58930673.html'));assert.ok(food.sources.some(x=>x[1]==='https://www.forestry.gov.cn/c/www/lcdt/547962.jhtml'));assert.match(food.imageCaption,/非实物摄影/);assert.ok(fs.existsSync(path.join(root,'dist',food.image)));
 const profile=ctx.window.LOTTERY_PROFILES[id];assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),spring=audit.rows.find(x=>x.term==='春分'),jingzhe=audit.rows.find(x=>x.term==='惊蛰');assert.ok(spring.foodIds.includes(id));assert.ok(!jingzhe.foodIds.includes(id));
});
