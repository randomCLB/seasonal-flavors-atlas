"""Verify public admission, shared image rendering and decoded local photos on the actual site."""
import hashlib,json,os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request,urlopen
from playwright.sync_api import sync_playwright
LIVE=os.environ.get('LIVE_VERIFY')=='1'
BASE='https://randomclb.github.io/seasonal-flavors-atlas/' if LIVE else 'http://127.0.0.1:8774/'
SHA=os.environ.get('RELEASE_SHA','')
report={'live':LIVE,'base':BASE,'releaseSha':SHA,'resources':[],'viewports':[],'errors':[],'screens':[]}
try:
    names=['index.html','app.js','reader-access.js','food-media.js','reader-media-additions.js','reader-access.css','food-detail.js','food-records.js','tarot.html','tarot-spread-ui.js','lottery.html','lottery-ui.js','build-info.json','credits.html']
    names += [r['path'] for r in json.loads(Path('docs/READER_MEDIA_20261024.json').read_text())]
    for name in names:
        with urlopen(Request(BASE+name+'?'+urlencode({'access_verify':SHA}),headers={'User-Agent':'SeasonalAtlasAccessAudit'}),timeout=30) as r:body=r.read()
        digest=hashlib.sha256(body).hexdigest();assert digest==hashlib.sha256(Path('dist',name).read_bytes()).hexdigest(),name
        if name=='build-info.json':
            data=json.loads(body);assert data['accessVersion']=='2026.10.24-access.1'
            if SHA:assert data['siteCommit']==SHA
        report['resources'].append({'path':name,'sha256':digest,'match':True})
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width,height in [(1400,1000),(390,844)]:
            context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
            page=context.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
            page.goto(BASE,wait_until='load');page.locator('.media-build').wait_for()
            state=page.evaluate('''()=>{
                const A=window.ReaderAccess,I=window.IngredientIdentity,M=window.FoodMedia,original=I.catalog(window.FOODS),removed=original.filter(f=>!A.visible(f));
                if(canonicalCatalog.length!==291||removed.length!==31)throw Error('Admission counts');
                const terms=[];for(const t of termWindow){selectedTerm=t;catalogScope='curated';selectedCategory='all';renderSeason();const cards=[...document.querySelectorAll('#seasonCards article')];if(cards.some(e=>!e.querySelector('img')))throw Error('Missing curated cover '+termNames[t.index]);const ids=cards.map(e=>e.querySelector('[data-food]').dataset.food);if(ids.some(id=>!A.visible(I.detail(id))))throw Error('Withdrawn seasonal food');terms.push({term:termNames[t.index],cards:ids.length,allHaveImages:true});}
                selectedTerm=currentTerm;renderSeason();renderSearch('');
                const buttons=[...document.querySelectorAll('#searchResults [data-food]')],covers=canonicalCatalog.filter(M.hasIngredient);
                if(buttons.length!==291||document.querySelectorAll('#searchResults .search-food-photo').length!==covers.length)throw Error('Search photo registry mismatch');
                for(const f of removed){renderSearch(f.name);if(document.querySelector(`#searchResults [data-food="${f.id}"]`))throw Error('Withdrawn search '+f.id);}
                const drawIds=window.FOODS.filter(f=>A.visible(f)&&M.hasIngredient(f)).map(f=>f.id);
                return {publicIngredients:canonicalCatalog.length,covered:covers.length,missing:canonicalCatalog.length-covers.length,withdrawn:removed.map(f=>({id:f.id,name:f.name})),terms,drawCandidates:drawIds.length,images:[...new Set(covers.map(f=>M.ingredient(f).src))]};
            }''')
            expected=json.loads(Path('docs/VISUAL_COVERAGE_20261024.json').read_text());assert state['covered']==expected['homeCovered'] and state['missing']==len(expected['missingHome'])
            if width==1400:
                decoded=page.evaluate('''async paths=>{
                  const queue=[...paths],results=[];
                  await Promise.all(Array.from({length:6},async()=>{while(queue.length){const src=queue.shift(),img=new Image();img.src=src;try{await img.decode();results.push({src,width:img.naturalWidth,height:img.naturalHeight,ok:img.naturalWidth>0});}catch(e){results.push({src,ok:false,error:String(e)});}}}));return results;
                }''',state['images'])
                report['decodedImages']=decoded;assert all(x['ok'] for x in decoded),[x for x in decoded if not x['ok']]
            page.locator('#catalogDirectory').click();page.locator('#searchInput').fill('豌豆');page.locator('#searchResults img').evaluate('(e)=>e.decode()')
            image=f'/tmp/access-{"live" if LIVE else "preview"}-search-{width}.png';page.screenshot(path=image);report['screens'].append(image)
            page.locator('#searchClose').click()
            for food_id in ['chuan-yu-dahan-pea-tips','taiwan-jialiao-bream']:
                page.goto(BASE+'?'+urlencode({'food':food_id}),wait_until='load');dialog=page.locator('#detailDialog');dialog.wait_for(state='visible')
                for img in dialog.locator('img').all():img.evaluate('(e)=>{e.loading="eager";return e.decode()}')
                if food_id=='chuan-yu-dahan-pea-tips':
                    assert 'pea_dish.webp' in dialog.locator('.reader-portrait img').get_attribute('src')
                    assert 'pea_tips.webp' in dialog.locator('.reader-ingredient img').get_attribute('src')
                    dialog.locator('#foodRecipe').scroll_into_view_if_needed()
                else:
                    assert 'bilibili.com/video/BV' in dialog.locator('.verified-video').get_attribute('href')
                    dialog.locator('.reader-access-links').scroll_into_view_if_needed()
                assert not dialog.evaluate('(e)=>e.scrollWidth>e.clientWidth+2')
                image=f'/tmp/access-{"live" if LIVE else "preview"}-{food_id}-{width}.png';page.screenshot(path=image);report['screens'].append(image)
            for food_id in ['taiwan-lichiu-kaohsiung-xiaochuan','taiwan-jingzhe-tongjian','suao-xiaohan-white-skin-sailfish']:
                page.goto(BASE+'?'+urlencode({'food':food_id}),wait_until='load');assert page.locator('.reader-withdrawn').is_visible();assert not page.locator('.reader-overview').count()
                assert 'food=' not in page.url
            saved={'version':1,'items':{'hezhou-xialiang-xiaohan-goji-greens':{'state':'want','updatedAt':10},'taiwan-jingzhe-tongjian':{'state':'want','updatedAt':20}}}
            page.evaluate('(v)=>localStorage.setItem("fengwu.food-records.v1",JSON.stringify(v))',saved)
            page.goto(BASE,wait_until='load');page.evaluate('window.FoodRecords.open()')
            assert page.locator('.record-entry').count()==1
            photo=page.locator('.record-entry img');assert 'goji' in photo.get_attribute('src');photo.evaluate('(e)=>e.decode()')
            assert page.evaluate('JSON.parse(localStorage.getItem("fengwu.food-records.v1"))')==saved
            image=f'/tmp/access-{"live" if LIVE else "preview"}-saved-{width}.png';page.screenshot(path=image);report['screens'].append(image)
            page.locator('.record-entry [data-record-state="tried"]').click()
            assert page.evaluate('JSON.parse(localStorage.getItem("fengwu.food-records.v1")).items["taiwan-jingzhe-tongjian"].state')=='want'
            page.goto(BASE+'tarot.html',wait_until='load');page.locator('#shuffle').click();page.get_by_role('button',name='从中叠切牌',exact=True).click()
            for _ in range(3):page.locator('[data-pick]:not([disabled])').first.click()
            page.locator('#read-spread').click();page.locator('#reveal').wait_for(state='visible');page.locator('#dish-image').evaluate('(e)=>e.decode()')
            assert not page.locator('#image-failed').is_visible()
            page.goto(BASE+'lottery.html',wait_until='load');page.locator('#begin').click()
            for _ in range(5):page.locator('#next').click()
            page.locator('#results').wait_for(state='visible')
            for img in page.locator('.food-entry img').all():img.evaluate('(e)=>{e.loading="eager";return e.decode()}')
            report['viewports'].append({'width':width,**{k:v for k,v in state.items() if k!='images'},'savedRegistryImage':True,'savedWithdrawnRecordPreserved':True,'drawImagesDecoded':True});context.close()
        browser.close()
    assert not report['errors'],report['errors'];report['passed']=True
except Exception as e:
    report['passed']=False;report['failure']=str(e)
    try:page.screenshot(path='/tmp/access-failure.png')
    except Exception:pass
    raise
finally:
    Path('/tmp/reader-access-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k not in ['viewports','resources','decodedImages']},ensure_ascii=False))
    print('PUBLIC_MEDIA',[(x['width'],x['publicIngredients'],x['covered'],x['missing'],len(x['withdrawn'])) for x in report['viewports']])
