"""Local Chromium checks. Clipboard/clock are controlled; no physical device or calendar app."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/core-validation'
OUT.mkdir(parents=True, exist_ok=True)
BASE = os.environ.get('SEASONAL_PREVIEW_BASE', 'http://127.0.0.1:8776/')
report = {'checks': [], 'limitations': ['Mobile viewport and enlarged-text simulation, not physical phones.', 'Clipboard failure is simulated; no native share-sheet delivery or external calendar import.']}

def check(name, condition):
    report['checks'].append({'name': name, 'passed': bool(condition)})
    assert condition, name

with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height in [(1280, 900), (390, 844), (320, 740)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.add_init_script("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}});Object.defineProperty(navigator,'share',{configurable:true,value:undefined});")
        page.goto(BASE + 'index.html?food=binchuan-renong1-yuganzi')
        page.wait_for_function("document.querySelector('#detailDialog')?.open === true")
        check(f'{width}: stable ingredient link restores correct detail', page.locator('#detailContent h1').inner_text() == '宾川“热农1号”余甘子')
        check(f'{width}: no horizontal dialog overflow', page.locator('#detailDialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
        image_figure = page.locator('.reader-portrait')
        image_note = image_figure.locator('figcaption')
        check(f'{width}: detail image note starts hidden', image_note.evaluate('(e)=>getComputedStyle(e).opacity') == '0')
        image_figure.hover()
        check(f'{width}: detail image note appears on hover', image_note.evaluate('(e)=>getComputedStyle(e).opacity') == '1')
        page.mouse.move(0, 0)
        page.locator('.reader-recipe-button').focus()
        check(f'{width}: detail image note hides after pointer leaves', image_note.evaluate('(e)=>getComputedStyle(e).opacity') == '0')
        image_figure.focus()
        check(f'{width}: keyboard focus reveals detail image note', image_note.evaluate('(e)=>getComputedStyle(e).opacity') == '1')
        check(f'{width}: recipe action initially visible', page.locator('.reader-recipe-button').bounding_box()['y'] < height)
        page.screenshot(path=str(OUT / f'detail-{width}.png'))
        page.locator('.reader-recipe-button').click()
        page.wait_for_selector('#foodRecipe[open]')
        check(f'{width}: recipe opened and focused', page.evaluate('document.activeElement===document.querySelector("#foodRecipe>summary")'))
        check(f'{width}: recipe visible below sticky controls', page.locator('#foodRecipe>summary').bounding_box()['y'] >= 0)
        page.locator('.food-purchase>summary').click()
        check(f'{width}: buying checks visible', page.locator('.purchase-content li').count() >= 2)
        expected_query = '宾川 热农1号 余甘子 新鲜 品种'
        if width == 1280:
            page.locator('.purchase-city-edit').click()
            page.locator('.purchase-city-form input[name=city]').fill('杭州')
            page.locator('.purchase-city-form button[type=submit]').click()
            expected_query += ' 杭州'
            check('1280: chosen city augments search and remains explicitly unverified', page.locator('.purchase-query').inner_text() == expected_query and '不代表本地有货' in page.locator('.purchase-city').inner_text() and '供应情况请自行核对' in page.locator('.purchase-disclaimer').inner_text())
            check('1280: platform URL contains the chosen city search term', page.locator('.purchase-links a').first.evaluate('(e)=>new URL(e.href).searchParams.get("q").includes("杭州")'))
            page.reload()
            page.wait_for_function("document.querySelector('#detailDialog')?.open === true")
            page.locator('.food-purchase>summary').click()
            check('1280: city preference survives reload and is reflected in query', page.locator('.purchase-query').inner_text() == expected_query)
        page.locator('.purchase-copy').click()
        page.wait_for_selector('.purchase-fallback:not([hidden])')
        check(f'{width}: copy fallback holds exact query', page.locator('.purchase-fallback textarea').input_value() == expected_query)
        check(f'{width}: external search preserves current dialog', page.locator('#detailDialog').get_attribute('open') is not None)
        page.screenshot(path=str(OUT / f'purchase-{width}.png'))
        page.locator('.reader-portrait').scroll_into_view_if_needed()
        if width == 390:
            page.evaluate("""()=>{const nodes=[...document.querySelectorAll('#detailContent *')];const sizes=nodes.map(e=>[e,getComputedStyle(e).fontSize]);for(const [e,s] of sizes)e.style.fontSize=(parseFloat(s)*2)+'px';}""")
            check('390: enlarged text does not overflow dialog', page.locator('#detailDialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
            page.screenshot(path=str(OUT / 'detail-390-text200.png'))
        page.locator('#detailShare').click()
        page.wait_for_selector('#detailShareFallback:not([hidden])')
        check(f'{width}: existing link share fallback intact', page.locator('#detailShareLink').input_value().endswith('index.html?food=binchuan-renong1-yuganzi'))
        if width == 320:
            page.goto(BASE + 'index.html?food=changning-hanlu-camellia-seed-oil')
            page.wait_for_selector('#detailDialog[open]')
            check('320: Hanlu oilseed detail, safety note and layout remain readable', page.locator('#detailContent h1').inner_text() == '常宁寒露籽茶油' and '不要食用生油茶果' in page.locator('#detailContent').inner_text() and page.locator('#detailDialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
            page.screenshot(path=str(OUT / 'changning-oilseed-320.png'))
        check(f'{width}: no JavaScript errors', not errors)
        page.close()

    page = browser.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
    page.add_init_script("Object.defineProperty(navigator,'share',{configurable:true,value:undefined});")
    page.goto(BASE + 'index.html')
    page.wait_for_function("[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).every(i=>i.complete)")
    check('home: every visible ingredient image loads', page.evaluate("[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).every(i=>i.naturalWidth>0)"))
    page.locator('#categoryFilter [data-category=oilseed]').click()
    check('Hanlu oilseed category exposes the sourced Changning entry', page.locator('#seasonCards [data-food=changning-hanlu-camellia-seed-oil]').count() == 3 and '油茶与油料' in page.locator('#categoryFilter [data-category=oilseed]').inner_text())
    page.locator('#categoryFilter [data-category=all]').click()
    page.locator('[data-view=flavor]').click()
    page.wait_for_function("document.querySelector('#flavorView').hidden === false && document.querySelector('#flavorCanvas').width > 0")
    check('flavor map renders the selected food and star field', page.locator('#flavorAside h2').is_visible() and page.locator('#flavorCanvas').evaluate('(e)=>e.width>0&&e.height>0'))
    page.screenshot(path=str(OUT / 'flavor-map-desktop.png'))
    relations = page.evaluate('''()=>{
      const selected=[...document.querySelectorAll('#flavorAside .aside-tags span')].map(e=>e.textContent);
      return [...document.querySelectorAll('#flavorAside .relation')].map(button=>{
        const row=[...document.querySelectorAll('#flavorList button[data-select]')].find(e=>e.dataset.select===button.dataset.select);
        const tags=row.querySelector('span').textContent.split(' · ');
        const shared=tags.filter(tag=>selected.includes(tag));
        const other=tags.filter(tag=>!selected.includes(tag)).slice(0,2);
        const expected=`共同风味：${shared.join('、')}${other.length?`；这味还带${other.slice(0,2).join('、')}`:''}`;
        return {id:button.dataset.select,shared,reason:button.querySelector('span').textContent,expected};
      });
    }''')
    check('flavor relation explanations exactly match shared and additional tags', len(relations)>0 and all(row['shared'] and row['reason']==row['expected'] for row in relations))
    check('flavor map offers compact filters based on catalog tags', page.locator('#flavorFilters [data-flavor-filter]').count() == 9)
    page.locator('#flavorFilters [data-flavor-filter=\"脆嫩\"]').click()
    check('flavor filter narrows the discovery list to foods carrying that exact tag', page.locator('#flavorList [data-select]').count() > 0 and page.locator('#flavorList [data-select]').evaluate_all('(nodes)=>nodes.every(e=>e.querySelector(\"span\").textContent.split(\" · \").includes(\"脆嫩\"))') and page.locator('#flavorFilters [data-flavor-filter=\"脆嫩\"]').get_attribute('aria-pressed') == 'true')
    page.locator('#flavorFilters [data-flavor-filter=\"all\"]').click()
    check('reset restores the full flavor catalog', page.locator('#flavorList [data-select]').count() == len(page.locator('#flavorFilters [data-flavor-filter=\"all\"]').evaluate('()=>window.FOODS')))
    chosen = relations[0]['id']
    page.locator(f'#flavorAside .relation[data-select="{chosen}"]').click()
    check('selecting a flavor relation updates the selected ingredient and star list', page.locator(f'#flavorList button[data-select="{chosen}"]').get_attribute('class') == 'active' and page.locator('#flavorAside .aside-tags span').count() > 0)
    ids = page.evaluate('Object.keys(window.CORE_REFINEMENTS)')
    for food_id in ids:
        page.goto(BASE + 'index.html?food=' + food_id)
        page.wait_for_selector('#detailDialog[open]')
        check(food_id + ': primary image loaded', page.locator('.reader-portrait img').evaluate('(e)=>e.complete&&e.naturalWidth>0'))
        check(food_id + ': image nature visible', bool(page.locator('.reader-portrait figcaption').inner_text()))
        check(food_id + ': four reading sections', page.locator('.reader-section').count() == 4)
        page.screenshot(path=str(OUT / (food_id + '.png')))

    page.goto(BASE + 'tarot.html')
    page.locator('#shuffle').click()
    page.locator('.cut-pile').first.click()
    for _ in range(3):
        page.locator('#spread [data-pick]:not(:disabled)').first.click()
    page.locator('#read-spread').click()
    page.wait_for_selector('#reveal:not([hidden])')
    before = page.locator('#dish-title').inner_text() + page.locator('#result-tableau').inner_text()
    page.locator('.food-purchase>summary').click()
    url = page.locator('.purchase-links a').first.get_attribute('href')
    with page.expect_popup() as popup_info:
        page.locator('.purchase-links a').first.click()
    popup = popup_info.value
    try:
        popup.wait_for_load_state('domcontentloaded', timeout=15000)
    except Exception:
        pass
    check('tarot: search opens separate tab', popup is not page)
    check('tarot: result and three cards survive external search', before == page.locator('#dish-title').inner_text() + page.locator('#result-tableau').inner_text())
    report['bingNavigation'] = {'requested': url, 'actual': popup.url, 'title': popup.title()}
    popup.close()
    page.screenshot(path=str(OUT / 'tarot-procurement.png'))

    page.goto(BASE + 'lottery.html')
    page.locator('#begin').click()
    for _ in range(5):
        page.locator('#next').click()
    page.wait_for_selector('#results:not([hidden])')
    before = page.locator('#food-list h2').all_text_contents()
    check('food list: shared purchase entry per filled slot', page.locator('#food-list .food-purchase').count() == len(before))
    page.locator('#remember').check()
    page.reload()
    page.locator('#resume').click()
    check('food list: stored six-term result restores unchanged', before == page.locator('#food-list h2').all_text_contents())
    page.locator('.food-purchase>summary').first.click()
    check('food list: menu does not redraw result', before == page.locator('#food-list h2').all_text_contents())
    check('food list: image notes present', page.locator('.food-image figcaption').count() == len(before))
    with page.expect_download() as download_info:
        page.locator('#calendar-open').click()
    download = download_info.value
    destination = OUT / 'six-term.ics'
    download.save_as(str(destination))
    check('calendar: real ICS download has events', 'BEGIN:VEVENT' in destination.read_text())
    page.screenshot(path=str(OUT / 'six-term-procurement.png'))
    page.close()
    browser.close()

report['passed'] = len(report['checks'])
(OUT / 'browser-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(f"{report['passed']} local browser checks passed")
