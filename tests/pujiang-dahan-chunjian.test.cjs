'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');

const root = path.join(__dirname, '..');
const context = {window: {}};
vm.createContext(context);
for (const name of ['solar-terms', 'data', 'editorial', 'editorial-notes', 'november-additions', 'core-refinements', 'winter-additions', 'seasonal-additions', 'lottery-profiles', 'lottery-senses']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'dist', `${name}.js`), 'utf8'), context);
}
const lottery = require(path.join(root, 'dist/lottery-core.js'));

test('蒲江春见从有来源支持的大寒始采期入选，后续季节和图像性质均如实标注', () => {
  const food = context.window.FOODS.find(item => item.id === 'pujiang-dahan-chunjian');
  const profile = context.window.LOTTERY_PROFILES[food.id];
  assert.ok(food);
  assert.equal(food.seasonStartTerm, 1);
  assert.deepEqual([...food.peakMonths], [1, 2, 3, 4]);
  assert.ok(food.sources.some(source => source[1].includes('news/4728051')));
  assert.ok(food.sources.some(source => source[1].includes('83187834')));
  assert.ok(food.procurement.checks.some(check => check.includes('成熟度')));
  assert.ok(food.context.includes('不能据此认定每年同日'));
  assert.ok(food.imageCaption.includes('不用于品种或产地鉴别'));
  assert.ok(fs.existsSync(path.join(root, 'dist', food.image)));
  assert.equal(profile.signature, lottery.signature(food));
  assert.equal(profile.senses.signature, lottery.sensorySignature(food));

  const audit = JSON.parse(execFileSync(process.execPath, ['scripts/audit-term-repetition.cjs', '2026'], {cwd: root, encoding: 'utf8'}));
  const xiaohan = audit.rows.find(row => row.term === '小寒');
  const dahan = audit.rows.find(row => row.term === '大寒');
  const lichun = audit.rows.find(row => row.term === '立春');
  assert.ok(!xiaohan.foodIds.includes(food.id));
  assert.ok(dahan.foodIds.includes(food.id));
  assert.ok(lichun.foodIds.includes(food.id));
  ;
  ;
  ;
  ;
});
