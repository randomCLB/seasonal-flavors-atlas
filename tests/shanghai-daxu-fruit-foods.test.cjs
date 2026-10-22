'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const name of ['solar-terms','data','editorial','editorial-notes','november-additions','core-refinements','winter-additions','seasonal-additions','lottery-profiles','lottery-senses'])vm.runInContext(fs.readFileSync(path.join(root,'dist',name+'.js'),'utf8'),ctx);
const C=require(path.join(root,'dist/lottery-core.js')),source='https://nyncw.sh.gov.cn/mtbd/20260724/498d577cc0994d9c9079be4816930be5.html';

test('上海大暑专题中的水蜜桃和醉金香葡萄保留单年来源精度',()=>{
 for(const [id,sig,senseSig] of [['nanhui-daxue-water-honey-peach','388ce692','2177d576'],['jiading-malu-zuijinxiang-grape','f98ee4fc','fbca8939']]){
  const f=ctx.window.FOODS.find(x=>x.id===id),p=ctx.window.LOTTERY_PROFILES[id];assert.ok(f);assert.equal(f.seasonPrecision,'local-term-feature');assert.deepEqual([...f.peakTerms],[13]);assert.ok(f.sources.some(x=>x[1]===source));assert.ok(fs.existsSync(path.join(root,'dist',f.image)));assert.equal(p.signature,sig);assert.equal(p.senses.signature,senseSig);
 }
 const a=JSON.parse(execFileSync(process.execPath,['scripts/audit-term-repetition.cjs','2026'],{cwd:root,encoding:'utf8'})),d=a.rows.find(x=>x.term==='大暑');assert.equal(d.repeatRate,.5);assert.equal(d.withinLimit,true);
});
