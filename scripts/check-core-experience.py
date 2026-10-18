"""Local Chromium checks. Clipboard/clock are controlled; no physical device or calendar app."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/core-validation'
OUT.mkdir(parents=True, exist_ok=True)
BASE = 'http://127.0.0.1:8776/'
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
        page.add_init_script("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}});")
        page.goto(BASE + 'index.html?food=binchuan-renong1-yuganzi')
        page.wait_for_selector('#detailDialog[open]')
        check(f'{width}: stable ingredient link restores correct detail', page.locator('#detailContent h1').inner_text() == '宾川“热农1号”余甘子')
        check(f'{width}: no horizontal dialog overflow', page.locator('#detailDialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth'))
        check(f'{width}: recipe action initially visible', page.locator('.reader-recipe-button').bounding_box()['y'] < height)
        page.screenshot(path=str(OUT / f'detail-{width}.png'))
        page.locator('.reader-recipe-button').click()
        page.wait_for_selector('#foodRecipe[open]')
        check(f'{width}: recipe opened and focused', page.evaluate('document.activeElement===document.querySelector("#foodRecipe>summary")'))
        check(f'{width}: recipe visible below sticky controls', page.locator('#foodRecipe>summary').bounding_box()['y'] >= 0)
        page.locator('.food-purchase>summary').click()
        check(f'{width}: buying checks visible', page.locator('.purchase-content li').count() >= 2)
        page.locator('.purchase-copy').click()
        page.wait_for_selector('.purchase-fallback:not([hidden])')
        check(f'{width}: copy fallback holds exact query', page.locator('.purchase-fallback textarea').input_value() == '宾川 热农1号 余甘子 新鲜 品种')
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
        check(f'{width}: no JavaScript errors', not errors)
        page.close()

    page = browser.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
    page.goto(BASE + 'index.html')
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
