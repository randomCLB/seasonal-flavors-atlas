import * as THREE from 'three';

const stemColor = new THREE.Color('#86ac46');
const leafColor = new THREE.Color('#589344');
const youngColor = new THREE.Color('#a2c765');
const veinMaterial = new THREE.LineBasicMaterial({color: '#bed488', transparent: true, opacity: .56, depthWrite: false});

function tube(parent, points, radius, color = stemColor, segments = 32) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, segments, radius, 6, false),
    new THREE.MeshStandardMaterial({color, roughness: .88, side: THREE.DoubleSide})
  );
  parent.add(mesh);
  return mesh;
}

function leafPoint(t, u, length, width) {
  const bell = Math.pow(Math.sin(Math.PI * Math.pow(t, .82)), .78);
  const lobes = .08 * Math.exp(-Math.pow((t - .43) / .075, 2))
    + .055 * Math.exp(-Math.pow((t - .65) / .06, 2))
    - .025 * Math.exp(-Math.pow((t - .55) / .045, 2));
  const halfWidth = width * ((.22 * (1 - t)) + bell + lobes);
  const teeth = 1 + .014 * Math.sin(t * Math.PI * 38) * Math.pow(Math.abs(u), 9);
  const notch = t < .19 ? .15 * Math.pow(1 - t / .19, 2) * (1 - u * u) : 0;
  return new THREE.Vector3(
    u * halfWidth * teeth,
    t * length + notch,
    .07 * Math.sin(Math.PI * t) * u * u + .045 * t + .035 * Math.sin(2.5 * Math.PI * t) * u
  );
}

function leafGeometry(length, width, tint) {
  const rows = 26, columns = 16;
  const positions = [], colors = [], indices = [];
  for (let row = 0; row <= rows; row++) {
    const t = row / rows;
    for (let column = 0; column <= columns; column++) {
      const u = column / columns * 2 - 1;
      const p = leafPoint(t, u, length, width);
      positions.push(p.x, p.y, p.z);
      const color = leafColor.clone().lerp(youngColor, tint + .22 * (1 - t) + .09 * (1 - Math.abs(u)));
      colors.push(color.r, color.g, color.b);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        indices.push(a, a + columns + 1, a + 1, a + 1, a + columns + 1, a + columns + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function leafVeins(length, width, offset) {
  const positions = [];
  const segment = (a, b) => positions.push(a.x, a.y, a.z + offset, b.x, b.y, b.z + offset);
  for (let i = 0; i < 20; i++) segment(leafPoint(i / 20, 0, length, width), leafPoint((i + 1) / 20, 0, length, width));
  for (const base of [.19, .31, .44, .57, .7]) for (const side of [-1, 1]) {
    let last = leafPoint(base, 0, length, width);
    for (let step = 1; step <= 6; step++) {
      const p = leafPoint(Math.min(.98, base + step * .025), side * step / 6 * .93, length, width);
      segment(last, p);
      last = p;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.LineSegments(geometry, veinMaterial);
}

function leaf(parent, node, petioleEnd, size, pose, tint) {
  const petiole = tube(parent, [node, [
    (node[0] + petioleEnd[0]) / 2,
    (node[1] + petioleEnd[1]) / 2 + .035,
    (node[2] + petioleEnd[2]) / 2
  ], petioleEnd], .012 * size, stemColor, 14);
  const blade = new THREE.Group();
  blade.position.set(...petioleEnd);
  blade.rotation.set(...pose);
  const length = .78 * size, width = .43 * size;
  const mesh = new THREE.Mesh(
    leafGeometry(length, width, tint),
    new THREE.MeshStandardMaterial({vertexColors: true, side: THREE.DoubleSide, roughness: .91, metalness: 0})
  );
  blade.add(mesh, leafVeins(length, width, .008), leafVeins(length, width, -.008));
  parent.add(blade);
  return [mesh, petiole];
}

function tendril(parent, origin, direction, length, radius, turns) {
  const base = [origin, [origin[0] + direction * length * .28, origin[1] + .09, origin[2] + .02]];
  const points = [...base];
  for (let i = 0; i <= 36; i++) {
    const t = i / 36, angle = turns * 2 * Math.PI * t;
    points.push([
      origin[0] + direction * length * (.28 + .36 * t) + radius * (1 - .3 * t) * Math.cos(angle),
      origin[1] + .09 + .1 * t + radius * (1 - .3 * t) * Math.sin(angle),
      origin[2] + .02 + .018 * Math.sin(angle * .5)
    ]);
  }
  return tube(parent, points, .006, '#a7c76d', 90);
}

export function createChayoteShoot() {
  const root = new THREE.Group();
  root.name = '佛手瓜苗 · 单梢立体插画';
  const pickTargets = [];
  const stem = tube(root, [
    [-.12, -1.28, -.08], [-.08, -.88, -.05], [-.015, -.46, 0], [.08, .01, .04],
    [.14, .45, .025], [.19, .79, .015], [.24, 1.13, -.02]
  ], .027, stemColor, 54);
  pickTargets.push(stem);
  const leaves = [
    [[-.08, -.87, -.05], [-.43, -.69, .08], 1.08, [.08, -.28, .73], .02],
    [[-.015, -.46, 0], [.45, -.25, -.08], 1.18, [-.2, .42, -.65], .08],
    [[.08, .01, .04], [-.28, .21, -.2], .91, [.27, .68, .48], .17],
    [[.14, .45, .025], [.48, .62, .17], .76, [-.18, -.36, -.53], .25],
    [[.19, .79, .015], [-.05, .99, .1], .49, [.16, .46, .33], .36]
  ];
  for (const spec of leaves) pickTargets.push(...leaf(root, ...spec));
  const sideShoot = tube(root, [[.08, .01, .04], [.28, .14, .09], [.4, .38, .07]], .012, '#91b85b', 16);
  pickTargets.push(sideShoot);
  pickTargets.push(tendril(root, [.28, .14, .09], 1, .74, .09, 2.3));
  pickTargets.push(tendril(root, [.29, .17, .1], 1, .49, .055, 1.8));
  pickTargets.push(tendril(root, [.14, .45, .025], -1, .53, .063, 1.6));
  const tip = tube(root, [[.24, 1.13, -.02], [.27, 1.26, -.01], [.26, 1.37, .01]], .012, '#b0ce77', 14);
  pickTargets.push(tip);
  root.updateMatrixWorld(true);
  return {
    root,
    pickTargets,
    dispose() {
      root.traverse(object => {
        object.geometry?.dispose();
        if (object.material && object.material !== veinMaterial) object.material.dispose();
      });
    }
  };
}
