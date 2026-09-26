import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createChayoteShoot} from './chayote.js';

const smallScreen = () => matchMedia('(max-width: 800px), (pointer: coarse)').matches;
const prefersLessMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createChayoteViewer(host, onSelect, initialDirection) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'food3d-canvas';
  renderer.domElement.setAttribute('aria-label', '可旋转的佛手瓜嫩梢立体插画');
  host.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xf8fff0, 0x55735a, 2.1));
  const sunlight = new THREE.DirectionalLight(0xfff7de, 2.3);
  sunlight.position.set(-2, 4, 5);
  scene.add(sunlight);
  const backlight = new THREE.DirectionalLight(0xd9efd0, .8);
  backlight.position.set(3, 1, -3);
  scene.add(backlight);

  const model = createChayoteShoot();
  scene.add(model.root);
  const box = new THREE.Box3().setFromObject(model.root);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(center);
  controls.enableDamping = true;
  controls.dampingFactor = .075;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = .35;
  controls.maxPolarAngle = Math.PI - .35;
  controls.autoRotateSpeed = .42;

  const raycaster = new THREE.Raycaster();
  const cursor = new THREE.Vector2();
  const canvas = renderer.domElement;
  const observeButton = host.parentElement.querySelector('[data-food3d-observe]');
  const resetButton = host.parentElement.querySelector('[data-food3d-reset]');
  const hint = host.parentElement.querySelector('[data-food3d-hint]');
  const mobile = smallScreen();
  let observing = false, gesture = null, frameId = 0, lastFrame = 0, awakeUntil = 0, visible = true, disposed = false;
  const autoUntil = !mobile && !prefersLessMotion() ? performance.now() + 6000 : 0;
  let framed = false;

  function fit() {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    const vertical = size.y / (2 * Math.tan(camera.fov * Math.PI / 360));
    const horizontal = size.x / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
    const distance = Math.max(vertical, horizontal, size.z * 1.4) * 1.28;
    const direction = framed ? camera.position.clone().sub(center).normalize()
      : initialDirection ? new THREE.Vector3(...initialDirection).normalize() : new THREE.Vector3(.12, .06, 1).normalize();
    camera.position.copy(center).addScaledVector(direction, distance);
    controls.minDistance = distance * .74;
    controls.maxDistance = distance * 1.55;
    controls.update();
    if (!framed) controls.saveState();
    framed = true;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    wake();
  }

  function hit(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    cursor.set((clientX - rect.left) / rect.width * 2 - 1, -(clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(cursor, camera);
    return raycaster.intersectObjects(model.pickTargets, true).length > 0;
  }

  function stopAuto() {
    controls.autoRotate = false;
    wake();
  }

  function setObserving(value) {
    observing = value;
    controls.enabled = mobile ? value : true;
    controls.enableZoom = value;
    canvas.style.touchAction = value ? 'none' : 'pan-y pinch-zoom';
    host.classList.toggle('is-observing', value);
    observeButton.textContent = value ? '退出观察' : '转一转';
    observeButton.setAttribute('aria-pressed', String(value));
    resetButton.hidden = !value;
    if (hint && mobile) hint.textContent = value ? '手指拖动观察，轻点嫩梢看做法' : '轻点嫩梢看做法；按“转一转”后可拖动观察';
    stopAuto();
  }

  function render(now) {
    frameId = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min(.05, (now - (lastFrame || now)) / 1000);
    lastFrame = now;
    if (controls.autoRotate && now >= autoUntil) controls.autoRotate = false;
    controls.update(dt);
    renderer.render(scene, camera);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    host.dataset.triangles = String(renderer.info.render.triangles);
    host.classList.add('is-ready');
    if (controls.autoRotate || gesture || now < awakeUntil) frameId = requestAnimationFrame(render);
  }

  function wake() {
    if (disposed || !visible || document.hidden) return;
    awakeUntil = performance.now() + 700;
    if (!frameId) frameId = requestAnimationFrame(render);
  }

  function pointerDown(event) {
    if (gesture) {gesture.canceled = true; return;}
    gesture = {id: event.pointerId, x: event.clientX, y: event.clientY, maxMove: 0,
      started: performance.now(), startedOnModel: hit(event.clientX, event.clientY), canceled: false};
    stopAuto();
  }

  function pointerMove(event) {
    if (gesture?.id === event.pointerId) {
      gesture.maxMove = Math.max(gesture.maxMove, Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y));
      wake();
    } else if (!gesture && event.pointerType === 'mouse') {
      host.classList.toggle('is-hovering', hit(event.clientX, event.clientY));
    }
  }

  function pointerUp(event) {
    if (gesture?.id !== event.pointerId) return;
    const clicked = !gesture.canceled && gesture.maxMove <= 8 && performance.now() - gesture.started < 750
      && gesture.startedOnModel && hit(event.clientX, event.clientY);
    gesture = null;
    wake();
    if (clicked) onSelect();
  }

  function pointerCancel() { if (gesture) gesture.canceled = true; gesture = null; }
  function mouseLeave() { if (!gesture) host.classList.remove('is-hovering'); }
  function onContextLost(event) { event.preventDefault(); host.classList.remove('is-ready'); host.dataset.modelState = 'fallback'; dispose(); observeButton.parentElement.hidden = true; }
  function onVisibility() {visible = !document.hidden; if (visible) wake(); else {cancelAnimationFrame(frameId); frameId = 0;}}
  function onObserve() {setObserving(!observing);}
  function onReset() {controls.reset(); stopAuto();}

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointercancel', pointerCancel);
  canvas.addEventListener('lostpointercapture', pointerCancel);
  canvas.addEventListener('pointerleave', mouseLeave);
  canvas.addEventListener('webglcontextlost', onContextLost);
  window.addEventListener('blur', pointerCancel);
  document.addEventListener('visibilitychange', onVisibility);
  observeButton.addEventListener('click', onObserve);
  resetButton.addEventListener('click', onReset);
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(host);
  const viewObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting && !document.hidden;
    if (visible) wake(); else {cancelAnimationFrame(frameId); frameId = 0;}
  });
  viewObserver.observe(host);
  setObserving(false);
  fit();
  controls.autoRotate = !!autoUntil;
  wake();
  host.dataset.modelState = 'loaded';

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    viewObserver.disconnect();
    canvas.removeEventListener('pointerdown', pointerDown);
    canvas.removeEventListener('pointermove', pointerMove);
    canvas.removeEventListener('pointerup', pointerUp);
    canvas.removeEventListener('pointercancel', pointerCancel);
    canvas.removeEventListener('lostpointercapture', pointerCancel);
    canvas.removeEventListener('pointerleave', mouseLeave);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    window.removeEventListener('blur', pointerCancel);
    document.removeEventListener('visibilitychange', onVisibility);
    observeButton.removeEventListener('click', onObserve);
    resetButton.removeEventListener('click', onReset);
    controls.dispose();
    model.dispose();
    renderer.dispose();
    canvas.remove();
    host.classList.remove('is-ready', 'is-observing', 'is-hovering');
  }

  return {dispose, setObserving, getOrientation: () => camera.position.clone().sub(center).normalize().toArray()};
}
