"""Exercise the deployed reader in Chromium at desktop and phone widths.

In workflow_run mode this visits the public Pages URL and compares served bytes
with this exact checkout's prepared release. Screenshots are actual browser
captures, never mockups. JSON includes full directed-case text for review.
"""
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from playwright.sync_api import sync_playwright

LIVE = os.environ.get('LIVE_VERIFY') == '1'
BASE = 'https://randomclb.github.io/seasonal-flavors-atlas/' if LIVE else 'http://127.0.0.1:8774/'
SHA = os.environ.get('RELEASE_SHA', '')
PREFIX = 'live' if LIVE else 'preview'
CASES = ['zhenning-honey-plum', 'wujiang-xiaoxue-fragrant-greens', 'cangnan-lidong-four-seasons-pomelo', 'fengqing-xinhua-walnut-flowers', 'cizhousun', 'suzhou-bailu-ginkgo']
report = {'live': LIVE, 'base': BASE, 'releaseSha': SHA, 'resources': [], 'cases': [], 'errors': []}

def verify_resources():
    for name in ['index.html', 'app.js', 'food-detail.js', 'food-purchase.js', 'reader-copy.js', 'reader-copy-curation.js', 'tarot.html', 'tarot-spread-ui.js', 'lottery.html', 'lottery-ui.js', 'build-info.json']:
        with urlopen(Request(BASE + name + '?' + urlencode({'reader_verify': SHA}), headers={'User-Agent': 'SeasonalAtlasReleaseVerification'}), timeout=30) as response:
            body = response.read()
            assert response.status == 200
        expected = Path('dist', name).read_bytes()
        assert hashlib.sha256(body).digest() == hashlib.sha256(expected).digest(), name + ': served bytes differ'
        report['resources'].append({'path': name, 'sha256': hashlib.sha256(body).hexdigest(), 'match': True})

try:
    verify_resources()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width, height in [(1400, 1000), (390, 844)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1)
            page = context.new_page()
            page.on('pageerror', lambda error: report['errors'].append(str(error)))
            page.goto(BASE + '?' + urlencode({'reader_verify': SHA}), wait_until='load')
            page.locator('.reader-build').wait_for()
            assert '2026.10.23-reader.1' in page.locator('.reader-build').inner_text()
            categories = page.locator('#categoryFilter [data-category]').evaluate_all("els=>els.map(e=>e.dataset.category)")
            assert categories == ['all', 'vegetable', 'fruit', 'protein', 'other'], categories
            if width == 1400:
                audit = page.evaluate("""() => {
                  const failures=[];let sources=0,safety=0;
                  for(const raw of window.FOODS){
                    const f={...raw,...window.EDITORIAL_DETAILS?.[raw.id]};
                    const v=window.ReaderCopy.view(f), holder=document.createElement('div');
                    holder.innerHTML=window.FoodDetail.html(raw,{recognition:{src:'',alt:'',note:'',fit:'cover'},seasonLabel:raw.seasonLabel||'',category:'风物',originHtml:'',similar:[],imageAttrs:''});
                    if(v.safety!==f.safety)failures.push(raw.id+': safety changed');
                    if(f.safety && holder.querySelector('.reader-safety p')?.textContent!==f.safety)failures.push(raw.id+': safety missing');
                    const urls=[...holder.querySelectorAll('.reader-sources a')].map(a=>a.getAttribute('href'));
                    if((f.sources||[]).some(([,url])=>!urls.includes(url)))failures.push(raw.id+': source missing');
                    sources+=urls.length;if(f.safety)safety++;
                    if([...holder.querySelectorAll('h2,h3,p,dt,dd')].some(e=>!e.textContent.trim()))failures.push(raw.id+': empty content element');
                    holder.querySelectorAll('figcaption,.reader-sources,.reader-safety').forEach(e=>e.remove());
                    if(/本站.*试吃|这里是资料整理|官方资料描述|第一次试 · 2 人份/.test(holder.textContent))failures.push(raw.id+': editorial boilerplate');
                  }
                  return {catalog:window.FOODS.length,sources,safety,failures};
                }""")
                report['wholeCatalog'] = audit
                assert audit['catalog'] == 354
                assert not audit['failures'], audit['failures'][:20]
            for food_id in CASES:
                page.goto(BASE + 'index.html?' + urlencode({'food': food_id, 'reader_verify': SHA}), wait_until='load')
                dialog = page.locator('#detailDialog')
                dialog.wait_for(state='visible')
                for summary in dialog.locator('.reader-section > summary').all():
                    summary.click()
                body = dialog.inner_text()
                assert '2 人份' not in body
                assert '本站试吃' not in body
                assert not dialog.locator('h2:empty,h3:empty,p:empty').count()
                if food_id == 'zhenning-honey-plum':
                    assert '果肉紧实酥脆，果香清楚' in body
                if food_id == 'wujiang-xiaoxue-fragrant-greens':
                    assert '先炒粗菜梗' in body and '菜梗熟软，叶片熟透' in body
                    assert '清炒吃它的香气和软糯，也适合做咸肉菜饭' in body
                if food_id == 'cangnan-lidong-four-seasons-pomelo':
                    assert '剥皮分瓣，去籽和厚白络，直接鲜食' in body
                    assert '做到什么程度' not in body and '最容易失手' not in body
                if food_id == 'fengqing-xinhua-walnut-flowers':
                    assert '浸泡约一天' in body and '中途换水' in body
                    assert not dialog.locator('dt').filter(has_text='香气').count()
                overflow = dialog.evaluate('(e)=>e.scrollWidth>e.clientWidth+2')
                assert not overflow, (food_id, width, 'horizontal overflow')
                dialog.evaluate('(e)=>{e.scrollTop=0}')
                page.screenshot(path=f'/tmp/reader-{PREFIX}-{food_id}-{width}.png')
                report['cases'].append({'food': food_id, 'width': width, 'text': body, 'horizontalOverflow': overflow, 'screenshot': f'reader-{PREFIX}-{food_id}-{width}.png'})
            page.goto(BASE, wait_until='load')
            page.locator('[data-view="map"]').click()
            assert page.locator('#mapBase').is_visible()
            page.locator('[data-view="flavor"]').click()
            assert page.locator('#flavorCanvas').is_visible()
            page.locator('#flavorZoomIn').click()
            page.locator('#flavorZoomReset').click()
            page.screenshot(path=f'/tmp/reader-{PREFIX}-flavor-{width}.png')
            page.goto(BASE+'tarot.html', wait_until='load')
            page.locator('#shuffle').click()
            page.locator('.cut-pile').nth(1).click()
            for _ in range(3):
                page.locator('[data-pick]:not([disabled])').first.click()
            page.locator('#read-spread').click()
            page.locator('#reveal').wait_for(state='visible')
            assert '2 人份' not in page.locator('#recipe-ingredients').inner_text()
            assert '当前推荐依据产地记录' not in page.locator('#season-note').inner_text()
            page.goto(BASE+'lottery.html', wait_until='load')
            page.locator('#begin').click()
            for _ in range(5):
                page.locator('#next').click()
            page.locator('#results').wait_for(state='visible')
            assert page.locator('.food-entry[data-slot]').count() > 0
            context.close()
        browser.close()
    assert not report['errors'], report['errors']
    report['passed'] = True
except Exception as exc:
    report['passed'] = False
    report['failure'] = str(exc)
    raise
finally:
    Path('/tmp/reader-browser.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k not in ['cases','resources']},ensure_ascii=False))
