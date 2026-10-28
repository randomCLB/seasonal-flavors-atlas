"""Check explicit image roles on rendered home/detail pages and exact live bytes."""
import hashlib,json,os
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright
LIVE=os.environ.get('LIVE_VERIFY')=='1'
BASE='https://randomclb.github.io/seasonal-flavors-atlas/' if LIVE else 'http://127.0.0.1:8774/'
SHA=os.environ.get('RELEASE_SHA','');PREFIX='live' if LIVE else 'preview'
CASES=['helan-luosicai','lanzhou-xianbaihe','heshi-xianfenge','hanshou-yubiou','huadu-jingtang-lotusroot','rongan-xiaozhou-winter-head-vegetable','fuling-yuzao100-mustard-stem','conghua-dajiecai','chuan-yu-dahan-pea-tips','cangnan-lidong-four-seasons-pomelo','zengcheng-caixin','cigu','shajiguo']
report={'live':LIVE,'releaseSha':SHA,'resources':[],'screens':[],'viewports':[],'errors':[]}
try:
    paths=['index.html','app.js','food-media.js','food-detail.js','visual-standard.js','visual-standard.css','tarot-spread-ui.js','build-info.json']+[r['path'] for r in json.loads(Path('docs/VISUAL_MEDIA_20261024.json').read_text())]
    for name in paths:
        with urlopen(Request(BASE+name+'?'+urlencode({'visual_verify':SHA}),headers={'User-Agent':'SeasonalAtlasVisualAudit'}),timeout=30) as r:body=r.read()
        digest=hashlib.sha256(body).hexdigest();assert digest==hashlib.sha256(Path('dist',name).read_bytes()).hexdigest(),name
        if name=='build-info.json':
            data=json.loads(body);assert data['visualVersion']=='2026.10.27-visual.2'
            if SHA:assert data['siteCommit']==SHA
        report['resources'].append({'path':name,'sha256':digest,'match':True})
    with sync_playwright() as p:
        b=p.chromium.launch()
        for width,height in [(1400,1000),(390,844)]:
            context=b.new_context(viewport={'width':width,'height':height},device_scale_factor=1,reduced_motion='reduce');page=context.new_page()
            page.on('pageerror',lambda e:report['errors'].append(str(e)))
            page.goto(BASE,wait_until='load');page.locator('.visual-build').wait_for()
            state=page.evaluate('''()=>{const terms=[];for(const t of termWindow){selectedTerm=t;catalogScope='curated';selectedCategory='all';renderSeason();const imgs=[...document.querySelectorAll('#seasonCards img')];if(imgs.some(i=>!['plant','whole-ingredient','animal','processed-food'].includes(i.dataset.photoRole)))throw Error('Bad home photo role '+termNames[t.index]);terms.push({term:termNames[t.index],cards:imgs.length,roles:[...new Set(imgs.map(i=>i.dataset.photoRole))]});}selectedTerm=currentTerm;renderSeason();return {terms,catalog:canonicalCatalog.length};}''')
            cases=[]
            for food_id in CASES:
                page.goto(BASE+'?'+urlencode({'food':food_id,'visual_verify':SHA}),wait_until='load');dialog=page.locator('#detailDialog');dialog.wait_for(state='visible')
                m=page.evaluate('''id=>{const f=window.IngredientIdentity.detail(id,foods)||byId[id];return {home:window.FoodMedia.ingredient(f),detail:window.FoodMedia.detail(f)};}''',food_id)
                hero=dialog.locator('.reader-portrait img');hero.evaluate('(i)=>i.decode()')
                assert hero.get_attribute('src')==(m['home'] or m['detail'])['src'],food_id
                if m['detail']:
                    plate=dialog.locator('#foodRecipe .reader-recipe-photo img');assert plate.get_attribute('src')==m['detail']['src'];plate.evaluate('(i)=>i.decode()')
                    assert plate.get_attribute('src')!=hero.get_attribute('src')
                assert not dialog.evaluate('(d)=>d.scrollWidth>d.clientWidth+2'),food_id
                image=f'/tmp/visual-{PREFIX}-{food_id}-detail-{width}.png';page.screenshot(path=image);report['screens'].append(image)
                if food_id in CASES[:2]:
                    if m['detail']:
                        dialog.locator('#foodRecipe').scroll_into_view_if_needed()
                        image=f'/tmp/visual-{PREFIX}-{food_id}-recipe-{width}.png';page.screenshot(path=image);report['screens'].append(image)
                    page.goto(BASE,wait_until='load')
                    found=page.evaluate('''id=>{const term=termWindow.find(t=>rankSeasonFoods(chinaParts(new Date(t.time+86400000)).month,t).some(f=>window.IngredientIdentity.key(f)===id));if(!term)return false;selectedTerm=term;catalogScope='all';selectedCategory='all';renderSeason();return true;}''',food_id);assert found,food_id
                    card=page.locator('#seasonCards article').filter(has=page.locator(f'h3 [data-food="{food_id}"]')).first
                    card.locator('img').evaluate('(i)=>{i.loading="eager";return i.decode()}');assert card.locator('img').get_attribute('src')==m['home']['src']
                    card.scroll_into_view_if_needed()
                    page.locator('#seasonCards img').evaluate_all('async imgs=>Promise.all(imgs.map(i=>{i.loading="eager";return i.decode()}))')
                    image=f'/tmp/visual-{PREFIX}-{food_id}-home-{width}.png';page.screenshot(path=image);report['screens'].append(image)
                cases.append({'id':food_id,'home':m['home']['src'],'homeScene':m['home']['scene'],'detail':m['detail']['src'] if m['detail'] else None,'overflow':False})
            report['viewports'].append({'width':width,'cases':cases,**state});context.close()
        b.close()
    assert not report['errors'],report['errors'];report['passed']=True
except Exception as e:
    report['passed']=False;report['failure']=str(e)
    try:page.screenshot(path=f'/tmp/visual-{PREFIX}-failure.png')
    except Exception:pass
    raise
finally:
    Path('/tmp/visual-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k not in ['resources','viewports']},ensure_ascii=False))
