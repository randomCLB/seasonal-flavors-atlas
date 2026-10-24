"""Verify reader records, browsing and exact release bytes; capture actual browser screenshots."""
import hashlib, json, os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from playwright.sync_api import sync_playwright
LIVE = os.environ.get('LIVE_VERIFY') == '1'
BASE = 'https://randomclb.github.io/seasonal-flavors-atlas/' if LIVE else 'http://127.0.0.1:8774/'
SHA = os.environ.get('RELEASE_SHA', '')
PREFIX = 'live' if LIVE else 'preview'
CASES = ['zhenning-honey-plum','wujiang-xiaoxue-fragrant-greens','cangnan-lidong-four-seasons-pomelo','fengqing-xinhua-walnut-flowers','cizhousun','suzhou-bailu-ginkgo','wenzhou-pancai','cigu','pucai','tengchong-fenghuang-xiaohan-yam','luocheng-dafu-xiaohan-black-wood-ear','lianjiang-xiaoshu-june-hemp-bamboo-shoot','suao-xiaohan-white-skin-sailfish','chuan-yu-dahan-pea-tips']
report = {'live':LIVE,'base':BASE,'releaseSha':SHA,'resources':[],'cases':[],'flows':[],'errors':[]}
try:
    names=['index.html','app.js','food-detail.js','food-purchase.js','reader-copy.js','reader-copy-curation.js','reader-depth.js','catalog-photos.js','catalog-quality.css','tarot.html','tarot-spread-ui.js','lottery.html','lottery-ui.js','build-info.json']
    names += [p['path'] for p in json.loads(Path('docs/CATALOG_PHOTOS_20261024.json').read_text())]
    for name in names:
        with urlopen(Request(BASE+name+'?'+urlencode({'reader_verify':SHA}),headers={'User-Agent':'SeasonalAtlasReleaseVerification'}),timeout=30) as response:
            body=response.read();assert response.status==200
        assert hashlib.sha256(body).digest()==hashlib.sha256(Path('dist',name).read_bytes()).digest(),name+': served bytes differ'
        report['resources'].append({'path':name,'sha256':hashlib.sha256(body).hexdigest(),'match':True})
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROME_BIN') or None)
        for width,height in [(1400,1000),(390,844)]:
            context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,reduced_motion='reduce')
            page=context.new_page();page.on('pageerror',lambda error:report['errors'].append(str(error)))
            page.goto(BASE+'?'+urlencode({'reader_verify':SHA}),wait_until='load');page.locator('.reader-build').wait_for()
            assert '2026.10.24-depth.1' in page.locator('.reader-build').inner_text()
            assert page.locator('#categoryFilter [data-category]').evaluate_all('els=>els.map(e=>e.dataset.category)')==['all','vegetable','fruit','protein','other']
            if width==1400:
                audit=page.evaluate("""()=>{
                  const failures=[];let sources=0,safety=0;
                  for(const raw of window.FOODS){
                    const f={...raw,...window.EDITORIAL_DETAILS?.[raw.id]},v=window.ReaderCopy.view(f),holder=document.createElement('div');
                    holder.innerHTML=window.FoodDetail.html(raw,{recognition:{src:'',alt:'',note:'',fit:'cover'},seasonLabel:raw.seasonLabel||'',category:'风物',originHtml:'',similar:[],imageAttrs:''});
                    if(v.safety!==f.safety)failures.push(raw.id+': safety changed');
                    if(f.safety&&holder.querySelector('.reader-safety p')?.textContent!==f.safety)failures.push(raw.id+': safety missing');
                    const urls=[...holder.querySelectorAll('.reader-sources a')].map(a=>a.getAttribute('href'));
                    if((f.sources||[]).some(([,url])=>!urls.includes(url)))failures.push(raw.id+': source missing');
                    sources+=urls.length;if(f.safety)safety++;
                    if([...holder.querySelectorAll('h2,h3,p:not([role=status]),dt,dd')].some(e=>!e.textContent.trim()))failures.push(raw.id+': empty content element');
                    holder.querySelectorAll('figcaption,.reader-sources,.reader-safety').forEach(e=>e.remove());
                    if(/本站|这里是资料整理|官方资料描述|第一次试 · 2 人份/.test(holder.textContent))failures.push(raw.id+': editorial boilerplate');
                  }
                  return {catalog:window.FOODS.length,sources,safety,failures};
                }""")
                report['wholeCatalog']=audit;assert audit['catalog']==354;assert not audit['failures'],audit['failures'][:20]
            before=page.locator('#seasonCards article').count()
            page.locator('#allSeasonScope').click();assert page.locator('#allSeasonScope').get_attribute('aria-pressed')=='true'
            assert page.locator('#seasonCards article').count()>=before
            page.locator('#catalogDirectory').click();assert page.locator('#searchResults [data-food]').count()==354
            page.locator('#searchClose').click();page.locator('#curatedScope').click();assert page.locator('#seasonCards article').count()==before
            page.screenshot(path=f'/tmp/reader-{PREFIX}-homepage-{width}.png')
            catalog=page.evaluate('''()=>({noPhoto:foods.filter(f=>!foodVisual(f).src).length,withPhoto:foods.filter(f=>foodVisual(f).src).length,terms:termWindow.map(t=>{const selected=rankSeasonFoods(chinaParts(new Date(t.time+86400000)).month,t);return {term:termNames[t.index],total:selected.length,unique:new Set(selected.map(window.SeasonSelection.group)).size}})})''')
            assert catalog['noPhoto']<=33;assert all(t['total']==t['unique'] for t in catalog['terms'])
            report['catalogQuality']=catalog;report['flows'].append({'width':width,'flow':'all-season-and-full-directory','passed':True})
            for food_id in CASES:
                page.goto(BASE+'index.html?'+urlencode({'food':food_id,'reader_verify':SHA}),wait_until='load')
                dialog=page.locator('#detailDialog');dialog.wait_for(state='visible')
                for summary in dialog.locator('.reader-section:not([open]) > summary').all():summary.click()
                if food_id in ['cigu','pucai']:assert len(dialog.inner_text())>250
                if food_id=='tengchong-fenghuang-xiaohan-yam':assert '筷子能穿过' in dialog.inner_text()
                if food_id=='suao-xiaohan-white-skin-sailfish':assert dialog.locator('.reader-variants [data-food]').count()>0
                if food_id=='chuan-yu-dahan-pea-tips':assert dialog.locator('.ingredient-text-cover').count()==1
                portrait=dialog.locator('.reader-portrait img')
                if portrait.count():portrait.evaluate('(img)=>img.decode()')
                body=dialog.inner_text();assert '2 人份' not in body;assert '本站试吃' not in body
                assert not dialog.locator('h2:empty,h3:empty,p:empty:not([role=status])').count()
                if food_id=='zhenning-honey-plum':assert '果肉紧实酥脆，果香清楚' in body
                if food_id=='wujiang-xiaoxue-fragrant-greens':assert '先炒粗菜梗' in body and '菜梗熟软，叶片熟透' in body and '清炒吃它的香气和软糯，也适合做咸肉菜饭' in body
                if food_id=='cangnan-lidong-four-seasons-pomelo':assert '剥皮分瓣，去籽和厚白络，直接鲜食' in body and '做到什么程度' not in body and '最容易失手' not in body
                if food_id=='fengqing-xinhua-walnut-flowers':assert '浸泡约一天' in body and '中途换水' in body and not dialog.locator('dt').filter(has_text='香气').count()
                if food_id=='wenzhou-pancai':assert '一月下旬' in body and '九月采收' in body
                overflow=dialog.evaluate('(e)=>e.scrollWidth>e.clientWidth+2');assert not overflow,(food_id,width,'horizontal overflow')
                dialog.evaluate('(e)=>{e.scrollTop=0}');page.screenshot(path=f'/tmp/reader-{PREFIX}-{food_id}-{width}.png')
                report['cases'].append({'food':food_id,'width':width,'text':body,'horizontalOverflow':overflow,'screenshot':f'reader-{PREFIX}-{food_id}-{width}.png'})
                print('PASS detail',food_id,width,flush=True)
            page.goto(BASE,wait_until='load');page.locator('[data-view="map"]').click();assert page.locator('#mapBase').is_visible()
            page.locator('[data-view="flavor"]').click();assert page.locator('#flavorCanvas').is_visible();page.locator('#flavorZoomIn').click();page.locator('#flavorZoomReset').click();page.screenshot(path=f'/tmp/reader-{PREFIX}-flavor-{width}.png')
            report['flows'].append({'width':width,'flow':'map-and-flavor','passed':True})
            page.goto(BASE+'tarot.html',wait_until='load');page.locator('#shuffle').click();page.get_by_role('button',name='从中叠切牌',exact=True).click()
            for _ in range(3):page.locator('[data-pick]:not([disabled])').first.click()
            page.locator('#read-spread').click();page.locator('#reveal').wait_for(state='visible')
            assert '2 人份' not in page.locator('#recipe-ingredients').inner_text();assert '当前推荐依据产地记录' not in page.locator('#season-note').inner_text()
            page.screenshot(path=f'/tmp/reader-{PREFIX}-tarot-{width}.png');report['flows'].append({'width':width,'flow':'tarot-shuffle-cut-three-card-reveal','passed':True});print('PASS tarot',width,flush=True)
            page.goto(BASE+'lottery.html',wait_until='load');page.locator('#begin').click()
            for _ in range(5):page.locator('#next').click()
            page.locator('#results').wait_for(state='visible');assert page.locator('.food-entry[data-slot]').count()>0
            report['flows'].append({'width':width,'flow':'five-question-flavor-draw','passed':True});print('PASS flavor draw',width,flush=True);context.close()
        browser.close()
    assert not report['errors'],report['errors'];report['passed']=True
except Exception as exc:
    report['passed']=False;report['failure']=str(exc)
    try:page.screenshot(path=f'/tmp/reader-{PREFIX}-failure.png')
    except Exception:pass
    raise
finally:
    Path('/tmp/reader-browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({**{k:v for k,v in report.items() if k not in ['cases','resources']},'resourceCount':len(report['resources']),'caseCount':len(report['cases'])},ensure_ascii=False))
