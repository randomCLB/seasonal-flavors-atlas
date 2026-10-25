"""Exercise canonical IDs through real rendered lists, legacy URLs and saved records."""
import hashlib,json,os
from pathlib import Path
from urllib.parse import urlencode,urlparse,parse_qs
from urllib.request import Request,urlopen
from playwright.sync_api import sync_playwright
LIVE=os.environ.get('LIVE_VERIFY')=='1'
BASE='https://randomclb.github.io/seasonal-flavors-atlas/' if LIVE else 'http://127.0.0.1:8774/'
SHA=os.environ.get('RELEASE_SHA','')
report={'live':LIVE,'base':BASE,'releaseSha':SHA,'resources':[],'screens':[],'viewports':[],'errors':[]}
try:
    for name in ['index.html','app.js','ingredient-identity.js','ingredient-identity.css','season-selection.js','food-records.js','food-detail.js','build-info.json']:
        with urlopen(Request(BASE+name+'?'+urlencode({'identity_verify':SHA}),headers={'User-Agent':'SeasonalAtlasIdentityCheck'}),timeout=30) as r:body=r.read()
        digest=hashlib.sha256(body).hexdigest()
        assert digest==hashlib.sha256(Path('dist',name).read_bytes()).hexdigest(),name
        if name=='build-info.json' and SHA:assert json.loads(body)['siteCommit']==SHA
        report['resources'].append({'path':name,'sha256':digest,'match':True})
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width,height in [(1400,1000),(390,844)]:
            context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
            page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
            page.goto(BASE,wait_until='load');page.locator('.identity-build').wait_for()
            summary=page.evaluate("""()=>{
              const I=window.IngredientIdentity,results=[];
              for(const term of termWindow)for(const scope of ['curated','all']){
                selectedTerm=term;catalogScope=scope;selectedCategory='all';renderSeason();
                const ids=[...document.querySelectorAll('#seasonCards article')].map(e=>e.querySelector('[data-food]')?.dataset.food);
                const keys=ids.map(I.key),families=ids.map(id=>window.SeasonSelection.group(byId[id]));
                if(new Set(keys).size!==ids.length||new Set(families).size!==ids.length)throw Error('Repeated rendered term '+term.index+'/'+scope);
                results.push({term:termNames[term.index],scope,count:ids.length,ids});
              }
              selectedTerm=currentTerm;catalogScope='curated';renderSeason();
              const searches=[];for(const g of I.groups)for(const id of g.ids){
                const raw=window.FOODS.find(f=>f.id===id);renderSearch(raw.name);
                const ids=[...document.querySelectorAll('#searchResults [data-food]')].map(e=>e.dataset.food);
                const allowed=window.ReaderAccess.visible(raw);if(ids.filter(x=>x===g.id).length!==(allowed?1:0)||ids.some(x=>I.key(x)!==x))throw Error('Alias visibility '+raw.name);
                searches.push({query:raw.name,canonical:g.id,count:ids.length});
              }
              renderSearch('');const all=[...document.querySelectorAll('#searchResults [data-food]')].map(e=>e.dataset.food);
              if(all.length!==canonicalCatalog.length||new Set(all).size!==all.length)throw Error('Duplicate directory');
              return {version:I.version,observations:window.FOODS.length,ingredients:canonicalCatalog.length,groups:I.groups.length,termCount:termWindow.length,terms:results,searches};
            }""")
            assert summary['termCount']>=72
            assert len(summary['terms'])==summary['termCount']*2
            page.locator('#catalogDirectory').click()
            page.locator('#searchInput').fill('合江')
            assert page.locator('#searchResults [data-food="hejiang-late-lychee"]').count()==1
            image=f'/tmp/identity-{"live" if LIVE else "preview"}-search-{width}.png';page.screenshot(path=image);report['screens'].append(image)
            page.locator('#searchResults [data-food="hejiang-late-lychee"]').click()
            assert parse_qs(urlparse(page.url).query)['food']==['hejiang-late-lychee']
            legacy=['qingdao-shazikou-li-xia-shrimp-2026','hejiang-xiaoshu-late-lychee','taiwan-rainwater-jialai-fish','taiwan-lichiu-red-eye-bream','keelung-hanlu-cuttlefish','jiangan-changsha-xiaohan-early-tea-first-pick']
            redirects=[]
            for old in legacy:
                page.goto(BASE+'index.html?'+urlencode({'food':old}),wait_until='load')
                dialog=page.locator('#detailDialog');dialog.wait_for(state='visible')
                expected=page.evaluate('(id)=>window.IngredientIdentity.key(id)',old)
                assert parse_qs(urlparse(page.url).query)['food']==[expected]
                names=page.evaluate('(id)=>window.IngredientIdentity.members(id).map(f=>f.name)',old)
                sections=dialog.locator('.reader-section')
                for i in range(sections.count()):
                    section=sections.nth(i)
                    if not section.evaluate('(e)=>e.open'):section.locator(':scope > summary').click()
                body=dialog.inner_text();assert all(name in body for name in names),(old,names)
                assert not dialog.evaluate('(e)=>e.scrollWidth>e.clientWidth+2'),old
                redirects.append({'old':old,'canonical':expected,'title':dialog.locator('h1').inner_text(),'regionalEvidence':len(names)})
                if old in ['qingdao-shazikou-li-xia-shrimp-2026','taiwan-rainwater-jialai-fish']:
                    dialog.locator('.identity-origins').scroll_into_view_if_needed()
                    image=f'/tmp/identity-{"live" if LIVE else "preview"}-{expected}-{width}.png';page.screenshot(path=image);report['screens'].append(image)
            page.goto(BASE,wait_until='load');page.locator('[data-view="map"]').click()
            map_audit=page.evaluate("""()=>{
              mapOnlySeason=false;renderMap();const I=window.IngredientIdentity;let checks=0;
              for(let i=0;i<mapGroups.length;i++){
                openMapPopup(i);const ids=[...document.querySelectorAll('#mapPopover [data-food]')].map(e=>e.dataset.food);
                if(new Set(ids).size!==ids.length||ids.some(id=>I.key(id)!==id))throw Error('Duplicate map popup '+i);checks++;
              }
              hideMapPopup();return {popups:checks};
            }""")
            page.locator('[data-view="flavor"]').click()
            flavor=page.locator('#flavorList [data-select]').evaluate_all('els=>els.map(e=>e.dataset.select)')
            assert len(flavor)==len(set(flavor))==summary['ingredients']
            saved={'version':1,'items':{'qingdao-shazikou-li-xia':{'state':'want','updatedAt':10},'qingdao-shazikou-li-xia-shrimp-2026':{'state':'tried','updatedAt':20}}}
            page.evaluate('(s)=>localStorage.setItem("fengwu.food-records.v1",JSON.stringify(s))',saved)
            page.reload(wait_until='load');page.evaluate('window.FoodRecords.open()')
            page.locator('[data-record-filter="tried"]').click();assert page.locator('.record-entry').count()==1
            assert 'huangbohai-yingzhuaxia' in page.locator('.record-entry a').get_attribute('href')
            assert page.evaluate('JSON.parse(localStorage.getItem("fengwu.food-records.v1"))')==saved
            report['viewports'].append({'width':width,**summary,'redirects':redirects,'map':map_audit,'savedMigration':True})
            context.close()
        browser.close()
    assert not report['errors'],report['errors'];report['passed']=True
except Exception as e:
    report['passed']=False;report['failure']=str(e)
    try:page.screenshot(path='/tmp/identity-failure.png')
    except Exception:pass
    raise
finally:
    Path('/tmp/identity-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k not in ['resources','viewports']},ensure_ascii=False))
    for result in report['viewports']:print('IDENTITY_BROWSER',json.dumps({k:result[k] for k in ['width','observations','ingredients','groups','savedMigration']},ensure_ascii=False),'termLists',len(result['terms']),'aliases',len(result['searches']),'redirects',len(result['redirects']))
