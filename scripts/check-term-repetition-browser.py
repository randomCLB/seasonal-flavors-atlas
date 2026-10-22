"""Compare all 24 homepage term lists with the audit and check the Ougan feedback."""
import json
import os
import subprocess
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/term-repeat-audit-20261019/browser-counts-20261021.json'
BASE = os.environ.get('SEASONAL_PREVIEW_BASE', 'http://127.0.0.1:8776/').rstrip('/') + '/index.html?preview=adjacent-term-audit-20261019'
AUDIT = json.loads(subprocess.check_output(['node', 'scripts/audit-term-repetition.cjs', '2026'], cwd=ROOT, text=True))
rows = []
page_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1305, 'height': 871}, reduced_motion='reduce')
    context.add_init_script("Date.now=()=>Date.parse('2026-10-18T04:00:00Z')")
    page = context.new_page()
    page.on('pageerror', lambda error: page_errors.append(str(error)))
    page.goto(BASE)
    page.wait_for_function("document.querySelector('#termBookmark').textContent.trim() !== ''")
    current = page.locator('#termBookmark').inner_text().strip()
    for _ in range(24):
        if current == AUDIT['rows'][0]['term']:
            break
        page.locator('#termPrev').click()
        page.wait_for_function("previous => document.querySelector('#termBookmark').textContent.trim() !== previous", arg=current)
        current = page.locator('#termBookmark').inner_text().strip()
    assert current == AUDIT['rows'][0]['term']
    for index, expected in enumerate(AUDIT['rows']):
        if index:
            page.locator('#termNext').click()
            page.wait_for_function("term => document.querySelector('#termBookmark').textContent === term", arg=expected['term'])
        actual_ids = page.locator('#seasonCards .season-list-name').evaluate_all('(nodes)=>nodes.map(node=>node.dataset.food)')
        actual_names = page.locator('#seasonCards .season-list-name').all_text_contents()
        heading_count = int(page.locator('#seasonHeading').inner_text().split('·')[-1].replace('味', '').strip())
        assert len(actual_ids) == len(set(actual_ids)), f"{expected['term']}: duplicate IDs"
        assert set(actual_ids) == set(expected['foodIds']), f"{expected['term']}: homepage IDs differ from audit"
        assert heading_count == len(actual_ids) == expected['count'], f"{expected['term']}: count mismatch"
        rows.append({'term': expected['term'], 'count': len(actual_ids), 'foodIds': actual_ids, 'foods': actual_names})

    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(BASE.split('?', 1)[0] + '?food=wenzhou-sanyang-ougan')
    page.locator('#detailDialog[open]').wait_for()
    detail = page.locator('#detailContent')
    text = detail.inner_text()
    assert '温州三垟瓯柑' in text and '预贮藏40天以上、转味后洗净剥皮食用' in text
    assert '和它风味相近的，还有哪些？' in text and '换个口味' not in text
    photo = page.locator('.reader-portrait img')
    assert photo.evaluate("img=>img.currentSrc.endsWith('oranges-fruits-vasil-vyagov-cc-by-sa-4.0.jpg')&&img.complete&&img.naturalWidth>0")
    caption = page.locator('.reader-portrait figcaption')
    assert caption.evaluate("el=>getComputedStyle(el).opacity==='0'")
    page.locator('.reader-portrait').hover()
    assert caption.evaluate("el=>getComputedStyle(el).opacity==='1'")
    detail.locator('details.food-purchase summary').click()
    links = detail.locator('.purchase-links a').evaluate_all('(nodes)=>nodes.map(node=>node.href)')
    assert [urlparse(link).netloc for link in links] == ['www.bing.com', 's.taobao.com', 'search.jd.com']
    assert all(any('三垟' in value and '瓯柑' in value for group in parse_qs(urlparse(link).query).values() for value in group) for link in links)
    assert not page_errors, f'page errors: {page_errors}'
    browser.close()

OUT.write_text(json.dumps({
    'auditYear': 2026,
    'matchedMachineAudit': True,
    'scope': 'Local Chromium readback of all 24 homepage lists, compared by food ID and count to the date-window audit.',
    'rows': rows,
    'foodLists': [{'term': row['term'], 'foodIds': row['foodIds']} for row in rows],
    'wenzhouSanyangOugan': {'mobileViewport': '390x844', 'photorealisticGenericReferenceLoaded': True,
                            'imageNoteHoverOnly': True, 'fortyDayStorageShown': True,
                            'similarFlavorCopyClear': True, 'purchaseHosts': ['www.bing.com', 's.taobao.com', 'search.jd.com']},
    'pageErrors': page_errors,
}, ensure_ascii=False, indent=2) + '\n')
print(f"Chromium verified {len(rows)}/24 term lists; Ougan detail and purchase entry passed; errors={len(page_errors)}")
