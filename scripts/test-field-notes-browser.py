"""Read the new editorial content through the actual public entry points."""
import functools
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

class Server(ThreadingHTTPServer):
    request_queue_size = 128

handler = functools.partial(Handler, directory=str(ROOT / 'dist'))
server = Server(('127.0.0.1', 0), handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = os.environ.get('ATLAS_BASE', f'http://127.0.0.1:{server.server_port}/')
catalog = json.loads((ROOT / 'docs/CONTENT_DEPTH_20261110.json').read_text())
report = {'base': BASE, 'viewports': [], 'errors': []}

try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=os.environ.get('CHROME_BIN') or None)
        for label, width, height in [('desktop', 1280, 900), ('mobile', 390, 844)]:
            context = browser.new_context(viewport={'width': width, 'height': height})
            context.add_init_script("""{
                const NativeDate=Date, fixed=NativeDate.parse('2026-11-11T04:00:00Z');
                globalThis.Date=class extends NativeDate {
                    constructor(...args){super(...(args.length?args:[fixed]));}
                    static now(){return fixed;}
                };
            }""")
            page = context.new_page()
            page.on('pageerror', lambda error: report['errors'].append(str(error)))
            page.on('requestfailed', lambda request: report['errors'].append(request.url + ' ' + request.failure))
            page.goto(BASE, wait_until='networkidle')
            assert '螺丝菜' in page.locator('#seasonIntro').inner_text()
            assert page.locator('#seasonIntro .field-reading-link').count() == 2
            page.locator('#seasonIntro .field-reading-link').first.click()
            page.locator('#detailDialog').wait_for(state='visible')
            assert '贺兰' in page.locator('.reader-lead .field-lead').inner_text()
            page.screenshot(path=f'/tmp/atlas-field-{label}-overview.png')
            page.get_by_role('heading', name='来处、时令与来源', exact=True).click()
            assert '2023' in page.locator('.field-season').inner_text()
            page.screenshot(path=f'/tmp/atlas-field-{label}-detail.png')

            for term in catalog['terms']:
                page.goto(BASE + '?food=' + term['representative'], wait_until='networkidle')
                dialog = page.locator('#detailDialog')
                dialog.wait_for(state='visible')
                assert len(dialog.locator('.field-lead p').inner_text()) >= 80
                assert dialog.locator('.field-source').get_attribute('href').startswith('http')
                assert dialog.locator('.field-season p').count() >= 1
                assert not dialog.evaluate('(el)=>el.scrollWidth>el.clientWidth+2'), term['representative']

            page.goto(BASE, wait_until='networkidle')
            page.locator('[data-view="map"]').first.click()
            page.locator('#mapPins button.map-cluster').first.focus()
            page.locator('#mapPopover').wait_for(state='visible', timeout=5000)
            assert page.locator('#mapPopover .field-map').count()
            assert page.locator('#mapPopover .field-source').count()
            page.screenshot(path=f'/tmp/atlas-field-{label}-map.png')
            page.locator('[data-view="flavor"]').first.click()
            assert page.locator('#flavorAside .field-flavor-sense').count()
            assert page.locator('#flavorAside .field-flavor-contrast').count()
            page.locator('#flavorAside .relation').first.click()
            assert page.locator('#flavorAside .aside-primary').is_visible()

            page.locator('#searchTrigger').click()
            page.locator('#searchInput').fill('棕包米')
            assert '嫩花穗' in page.locator('#searchResults').inner_text()
            page.locator('#searchResults [data-food]').first.click()
            page.locator('#detailDialog [data-record-state="want"]').click()
            page.locator('#detailClose').click()
            page.locator('[data-open-records]').first.click()
            assert '腾冲' in page.locator('.record-window').inner_text()
            assert '2027年1月' in page.locator('.record-window').inner_text()

            page.goto(BASE + 'tarot.html', wait_until='networkidle')
            page.locator('#shuffle').click()
            page.get_by_role('button', name='从中叠切牌', exact=True).click()
            for _ in range(3):
                page.locator('#spread button:not([disabled])').first.click()
            page.locator('#read-spread').click()
            page.locator('#dish-field-note .field-lead').wait_for(state='visible')
            assert page.locator('#dish-field-note .field-source').count()
            assert page.locator('#dish-field-note .field-season').inner_text()

            page.goto(BASE + 'lottery.html', wait_until='networkidle')
            page.locator('#begin').click()
            for _ in range(5):
                page.locator('#next').click()
            page.locator('#food-list .field-lottery').first.wait_for(state='visible')
            assert page.locator('#food-list .food-entry .field-source').count() == 6
            page.screenshot(path=f'/tmp/atlas-field-{label}-lottery.png')

            page.goto(BASE + 'credits.html', wait_until='networkidle')
            page.locator('#field-image-index summary').click()
            assert page.locator('.field-image-row').count() == catalog['publicIngredients']
            assert '生成示意' in page.locator('#field-image-tengchong-late-winter-palm-bud').inner_text()
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+2')
            report['viewports'].append({'name': label, 'stories': len(catalog['terms']), 'flows': ['term', 'map', 'flavor', 'search', 'records', 'tarot', 'lottery', 'credits']})
            context.close()
        browser.close()
    assert not report['errors'], report['errors']
    report['passed'] = True
finally:
    server.shutdown()
    Path('/tmp/atlas-field-browser.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False))
