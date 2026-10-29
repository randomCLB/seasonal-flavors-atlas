'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),C=require('../dist/lottery-core.js');
test('sourced Great Heat additions are term-specific and accurately registered',()=>{
 const ctx={window:{FOODS:[],LOTTERY_PROFILES:{}}};vm.createContext(ctx);
 for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
 const audit=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'}));
 const heat=audit.rows.find(row=>row.term==='大暑'),previous=audit.rows.find(row=>row.term==='小暑');
 const items=[
  ['dengkou-wallace-melon','https://news.weather.com.cn/2024/07/3818436.shtml'],
  ['longyangxia-salmon','https://news.weather.com.cn/2024/07/3818436.shtml'],
  ['hejiang-late-lychee','https://news.weather.com.cn/2024/07/3818436.shtml'],
  ['shicheng-white-lotus','https://news.weather.com.cn/2024/07/3818436.shtml'],
  ['lufeng-zhongcun-late-early-chestnut','https://ynlf.gov.cn/info/1042/137184.htm'],
  ['nanhui-daxue-water-honey-peach','https://nyncw.sh.gov.cn/mtbd/20260724/498d577cc0994d9c9079be4816930be5.html'],
  ['jiading-malu-zuijinxiang-grape','https://nyncw.sh.gov.cn/mtbd/20260724/498d577cc0994d9c9079be4816930be5.html']
 ];
 for(const [id,source] of items){
  const food=ctx.window.FOODS.find(item=>item.id===id),profile=ctx.window.LOTTERY_PROFILES[id];
  assert.ok(food,id);assert.deepEqual(Array.from(food.peakTerms),[13]);assert.deepEqual(Array.from(food.entryTerms),[13]);
  assert.ok(food.sources.some(item=>item[1]===source),id);assert.ok(fs.existsSync(path.join(root,'dist',food.image)),id);
  assert.match(food.imageCaption,/非实物摄影/);assert.equal(profile.signature,C.signature(food));assert.equal(profile.senses.signature,C.sensorySignature(food));
  assert.ok(heat.foodIds.includes(id));assert.ok(!previous.foodIds.includes(id));
 }
 ;assert.equal(heat.repeatRate,12/25);
});
