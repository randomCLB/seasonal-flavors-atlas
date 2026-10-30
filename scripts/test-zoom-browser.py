"""Zoom regressions using Chromium wheel and touch input; no physical trackpad."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('output/zoom-regression-20261029')
OUT.mkdir(parents=True, exist_ok=True)
report = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height in [(1301, 871), (390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, has_touch=True, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto('http://127.0.0.1:8774/', wait_until='networkidle')
        result = page.evaluate('''()=>{
            setView('map');mapOnlySeason=false;mapFocus=null;renderMap();
            const ids=['ninghai-white-loquat','shangyu-duanbing-cherry'];
            const combined=mapGroups.some(g=>ids.every(id=>g.some(x=>x.food.id===id)));
            const targets=mapPlaces.filter(x=>ids.includes(x.food.id));
            zoomMap(targets);
            if(mapGroups.some(g=>ids.every(id=>g.some(x=>x.food.id===id))))throw Error('Ninghai and Shaoxing still clustered after zoom');
            if(!ids.every(id=>mapGroups.some(g=>g.some(x=>x.food.id===id))))throw Error('Zoom lost a regional target');
            const regional=mapFocus.width;
            for(let i=0;i<30;i++)stepMapZoom(.72);
            const limit={...mapFocus};stepMapZoom(.72);
            if(Math.abs(mapFocus.left-limit.left)>1e-8||Math.abs(mapFocus.top-limit.top)>1e-8)throw Error('Map shifts at zoom limit');
            if(!document.getElementById('mapZoomIn').disabled)throw Error('Zoom-in still enabled at limit');
            const scale=document.getElementById('mapScale').textContent;
            if(scale==='约 50 公里')throw Error('Scale label did not follow zoom');
            mapFocus=null;renderMap();
            const identical=mapPlaces.filter((x,i,a)=>a.some((y,j)=>j<i&&x.place.lat===y.place.lat&&x.place.lon===y.place.lon));
            if(!identical.length)throw Error('Expected co-located source records');
            const place=identical[0].place,point=mapProject(place),w=homeView.width*.005;
            setMapViewport({left:point.x-w/2,top:point.y-w/mapAspect/2,width:w});
            const index=mapGroups.findIndex(g=>g.length>1&&g.some(x=>x.place.lat===place.lat&&x.place.lon===place.lon));
            if(index<0)throw Error('Co-located records lost');
            openMapPopup(index);
            const entries=document.querySelectorAll('#mapPopover [data-food]').length;
            if(entries<2||!document.querySelector('.map-popover-zoom').disabled)throw Error('Maximum zoom has no usable co-located list');
            hideMapPopup();return {combined,regional,minimum:limit.width,scale,coLocatedEntries:entries};
        }''')
        page.locator('.map-image').screenshot(path=str(OUT / f'map-{width}.png'))
        page.evaluate("setView('flavor');document.getElementById('flavorZoomReset').click()")
        canvas = page.locator('#flavorCanvas')
        canvas.scroll_into_view_if_needed()
        box = canvas.bounding_box()
        cx, cy = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
        page.mouse.move(cx + box['width'] * .25, cy)
        page.keyboard.down('Control')
        page.mouse.wheel(0, -200)
        page.keyboard.up('Control')
        page.wait_for_function('starView.scale>1')
        assert page.evaluate('starView.x===0&&starView.y===0'), 'Trackpad wheel moved sphere center'
        page.evaluate("for(let i=0;i<20;i++)document.getElementById('flavorZoomIn').click()")
        assert page.evaluate('starView.scale===2.5&&starView.x===0&&starView.y===0')
        client = page.context.new_cdp_session(page)
        for diagonal in [False, True]:
            page.evaluate("document.getElementById('flavorZoomReset').click()")
            def touches(radius):
                dx = radius if diagonal else 0
                return [{'id': 1, 'x': cx-dx, 'y': cy-radius}, {'id': 2, 'x': cx+dx, 'y': cy+radius}]
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': touches(30)})
            client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': touches(60)})
            state = page.evaluate('({...starView})')
            assert abs(state['scale']-2)<.02 and state['x']==0 and state['y']==0, state
            client.send('Input.dispatchTouchEvent', {'type': 'touchCancel', 'touchPoints': []})
            assert page.evaluate('starPointers.size===0&&starGesture===null'), 'Cancelled pinch left stale pointers'
        page.evaluate("document.getElementById('flavorZoomReset').click()")
        assert page.evaluate('starView.scale===1&&starView.x===0&&starView.y===0')
        canvas.screenshot(path=str(OUT / f'globe-{width}.png'))
        assert not errors, errors
        report.append({'width': width, 'map': result, 'wheelCenter': True, 'verticalAndDiagonalPinch': True, 'cancelAndReset': True})
        page.close()
    browser.close()
(OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
print(json.dumps(report, ensure_ascii=False))
