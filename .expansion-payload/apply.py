"""Apply the locally tested, hash-checked expansion on its isolated branch only."""
import base64
import hashlib
import json
import lzma
import pathlib
import re
import shutil
import subprocess

ROOT = pathlib.Path('.')
BRANCH = 'feature/seasonal-pool-expansion'
if subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip() != BRANCH:
    raise SystemExit('Refusing to write any other branch')
if subprocess.check_output(['git', 'status', '--porcelain', '--untracked-files=no'], text=True).strip():
    raise SystemExit('Tracked checkout is not clean')
raw = lzma.decompress(base64.b64decode(''.join((ROOT / '.expansion-payload' / f'part-{i}.b64').read_text().strip() for i in range(5)), validate=True))
assert hashlib.sha256(raw).hexdigest() == 'b6d8cea57d26ef6248249021f913d1b55ef859fcf8673d5bf39feb1c0bc7655d', 'Bundle integrity failure'
ops = json.loads(raw)
assert len(ops) == 17
seen = set()
for op in ops:
    path = pathlib.PurePosixPath(op['path'])
    assert not path.is_absolute() and '..' not in path.parts and path.parts[0] in {'dist', 'tests', 'docs', 'scripts', 'reviews'}
    assert str(path) not in seen
    seen.add(str(path))
    dest = ROOT / path
    if op['before'] is None:
        assert not dest.exists(), f'New path already exists: {path}'
        text = op['content']
    else:
        original = dest.read_bytes()
        assert hashlib.sha256(original).hexdigest() == op['before'], f'Base changed: {path}'
        text = original.decode('utf-8')
        previous = len(text) + 1
        for start, end, replacement in reversed(op['edits']):
            assert 0 <= start <= end <= len(text) and end <= previous
            text = text[:start] + replacement + text[end:]
            previous = start
    data = text.encode('utf-8')
    assert hashlib.sha256(data).hexdigest() == op['after'], f'Result differs: {path}'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    print('Verified:', path)

media_hashes = {
    'jianou-zhuilli-reference.webp': '149faf90f0f07c01f6c0ae76533471b8547f5286e14701c0c546ae79c51b7e16',
    'chongming-biandou-reference.webp': '51907f2f7d478a30f28cf722ddc48878f0053880de9f906cce1b9956d42bb272',
    'chongming-taro-reference.webp': '775e7520827ab1f6d052c4b87f4c24f29817174d313d530a4e5ac2da8ae55d9b',
    'xiangyin-jiaotou-reference.webp': '9d8b9b9a0fbb35956ad72d270f1d349b4250dbc94777a6c4315a63da74003859',
    'wenzhou-pancai-reference.webp': 'af1ca1080054e31e1e0b1ea226f213a18f2aafa6b57b0545173e1d73ec2e7a58'
}
for name, expected in media_hashes.items():
    source = ROOT / '.expansion-media' / name
    assert hashlib.sha256(source.read_bytes()).hexdigest() == expected, name
    target = ROOT / 'dist/assets' / name
    assert not target.exists(), name
    shutil.copyfile(source, target)

def replace_once(path, old, new):
    p = ROOT / path
    text = p.read_text()
    assert text.count(old) == 1, f'Expected unique old text in {path}: {old}'
    p.write_text(text.replace(old, new, 1), encoding='utf-8')

replace_once('tests/lottery.test.cjs', 'assert.equal(foods.length,55)', 'assert.equal(foods.length,60)')
replace_once('tests/lottery.test.cjs', 'all 55 recipes and sensory source fingerprints match', 'all 60 recipes and sensory source fingerprints match')
replace_once('tests/lottery.test.cjs', 'assert.ok(f.dishImage||f.cutImage,', 'assert.ok(f.dishImage||f.cutImage||f.tarotImage?.src,')
replace_once('tests/lottery.test.cjs', '[f.dishImage,f.cutImage].filter(Boolean)', '[f.dishImage,f.cutImage,f.tarotImage?.src].filter(Boolean)')
for path in ['tests/tarot.test.cjs', 'tests/tarot-spread.test.cjs']:
    replace_once(path, 'assert.ok(foods.find(f=>f.id===a.foodId).dishImage);', 'assert.ok(T.mediaFor(foods.find(f=>f.id===a.foodId)));')
replace_once('README.md', '目前收录 55 味：蔬菜 34 味、水果 13 味、蛋白类 8 味。', '目前收录 60 味：蔬菜 38 味、水果 14 味、水产与肉 8 味。')
with (ROOT / 'README.md').open('a', encoding='utf-8') as f:
    f.write('\n## 塔罗牌池与轮换\n\n默认抽签为塔罗三牌阵。新增5种地方食材，并将12种已有鲜果的可食状态图显式接入；原料参考与熟制照片分开标记。同一页面内先抽遍当前合格候选再轮换，刷新重新开始。不会放宽忌口或改写时令凑数。详见[扩充说明](docs/TAROT_POOL_EXPANSION.md)与[全年牌池采样](docs/TAROT_POOL_COVERAGE_2027.json)。运行 `node scripts/audit-tarot-pool.cjs 2027` 可复算。\n')

manifest = json.loads((ROOT / 'docs/EXPANSION_MEDIA_SOURCES.json').read_text())
licenses = {'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/', 'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/', 'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/'}
with (ROOT / 'IMAGE_REGISTER.md').open('a', encoding='utf-8') as f:
    f.write('\n## 牌池扩充的许可参考图\n\n以下5张缩小并转为WebP，未放大，改作保留原许可。均不是对应地方品种的认证实拍。白扁豆图片含紫边荚，不代表崇明白扁豆颜色与品相；盘菜图片为普通芜菁，不能据此鉴别温州盘菜品种；熟芋参考不是本配方实拍。网页同步列出作者与许可。\n\n| 文件 | 作者与来源 | 许可 | 展示尺寸 |\n| --- | --- | --- | --- |\n')
    for row in manifest:
        f.write(f"| `{row['file']}` | [{row['author']}]({row['sourceURL']}) | [{row['license']}]({licenses[row['license']]}) | {row['size'][0]} × {row['size'][1]} |\n")

for path in ['.github/workflows/pages.yml', '.github/workflows/tarot-checks.yml']:
    p = ROOT / path
    text = p.read_text()
    text, count = re.subn(r'node --test tests/draw-navigation\.test\.cjs tests/lottery\.test\.cjs tests/tarot\.test\.cjs tests/tarot-spread\.test\.cjs', 'node --test tests/*.test.cjs', text)
    assert count == 1, path
    if path.endswith('pages.yml'):
        extra = "'editorial-notes.js', 'lottery-profiles.js', " + ', '.join(repr('assets/' + name) for name in media_hashes) + ', '
        assert text.count("paths = ['index.html',") == 1
        text = text.replace("paths = ['index.html',", "paths = [" + extra + "'index.html',", 1)
    p.write_text(text, encoding='utf-8')
print('All scoped changes and licensed assets are ready for regression tests.')
