/**
 * Gudla Vishal — Spider-Verse 3D Portfolio Interactive Engine
 * WebGL Background Shader, Pixel-by-Pixel Matrix Morph Engine, Three.js 3D Hero Emblem, Interactive Skill Web Graph, Custom Web Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorTrail();
  initBackgroundShader();
  initHeroPixelTransition();
  initThreeHero();
  initSkillWebGraph();
  initScrollAnimations();
  initContactTerminal();
  initMobileNav();
});

/* ----------------------------------------------------
   1. CUSTOM SPIDER-WEB CURSOR & TRAIL
---------------------------------------------------- */
function initCursorTrail() {
  const cursor = document.getElementById('custom-cursor');
  const trailPath = document.getElementById('trail-path');
  if (!cursor || !trailPath) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trail = [];
  const maxTrail = 24;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    trail.push({ x: mouseX, y: mouseY });
    if (trail.length > maxTrail) {
      trail.shift();
    }
  });

  // Hover states for interactables
  const interactables = document.querySelectorAll('a, button, .skill-node, .group, input, textarea, [data-interactive], .hero-reveal-container');
  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '30px';
      cursor.style.height = '30px';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '2px solid #E23636';
      cursor.style.boxShadow = '0 0 16px rgba(226, 54, 54, 0.9)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      cursor.style.backgroundColor = '#E23636';
      cursor.style.border = 'none';
      cursor.style.boxShadow = '0 0 10px #E23636';
    });
  });

  function renderTrail() {
    if (trail.length > 1) {
      let pathData = `M ${trail[0].x} ${trail[0].y}`;
      for (let i = 1; i < trail.length; i++) {
        const xc = (trail[i].x + trail[i - 1].x) / 2;
        const yc = (trail[i].y + trail[i - 1].y) / 2;
        pathData += ` Q ${trail[i - 1].x} ${trail[i - 1].y}, ${xc} ${yc}`;
      }
      pathData += ` L ${mouseX} ${mouseY}`;
      trailPath.setAttribute('d', pathData);

      if (trail.length > 0) {
        trail.shift();
      }
    } else {
      trailPath.setAttribute('d', '');
    }
    requestAnimationFrame(renderTrail);
  }
  renderTrail();
}

/* ----------------------------------------------------
   2. HERO PIXEL-BY-PIXEL MATRIX MORPH TRANSITION ENGINE
---------------------------------------------------- */
function initHeroPixelTransition() {
  const container = document.getElementById('heroRevealContainer');
  const canvas = document.getElementById('heroPixelCanvas');
  const scanWave = document.getElementById('heroScanWave');
  const statusLabel = document.getElementById('heroStatusLabel');
  const toggleBtn = document.getElementById('toggleIdentityBtn');
  const pixelHUD = document.getElementById('heroPixelHUD');
  const progressText = document.getElementById('pixelProgressText');
  const progressBar = document.getElementById('pixelProgressBar');

  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let isRevealed = false;
  let isTransitioning = false;

  // Preload Image Objects for Canvas Slicing
  const imgMask = new Image();
  imgMask.src = 'mask-image.png';

  const imgReal = new Image();
  imgReal.src = 'real-photo.jpg';

  let imagesLoaded = false;
  let loadedCount = 0;
  function checkLoaded() {
    loadedCount++;
    if (loadedCount >= 2) {
      imagesLoaded = true;
    }
  }
  imgMask.onload = checkLoaded;
  imgReal.onload = checkLoaded;

  function runPixelTransition(e) {
    if (isTransitioning) return;
    isTransitioning = true;

    const rect = container.getBoundingClientRect();
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Determine click origin
    let clickX = width / 2;
    let clickY = height / 2;

    if (e && e.clientX && e.clientY) {
      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;
    } else if (e && e.touches && e.touches[0]) {
      clickX = e.touches[0].clientX - rect.left;
      clickY = e.touches[0].clientY - rect.top;
    }

    // Trigger Cyber Shockwave Burst
    if (scanWave) {
      scanWave.style.left = `${clickX}px`;
      scanWave.style.top = `${clickY}px`;
      scanWave.classList.remove('animating');
      void scanWave.offsetWidth;
      scanWave.classList.add('animating');
    }

    // Activate Canvas & HUD overlays
    canvas.classList.add('active');
    container.classList.add('animating-pixels');
    if (pixelHUD) pixelHUD.classList.add('active');

    // Source & Target images
    const fromImg = isRevealed ? imgReal : imgMask;
    const toImg = isRevealed ? imgMask : imgReal;

    // Grid Pixel Configuration (Responsive: 13px desktop, 16px mobile)
    const blockSize = width < 640 ? 16 : 13;
    const cols = Math.ceil(width / blockSize);
    const rows = Math.ceil(height / blockSize);
    const totalPixels = cols * rows;

    const maxDist = Math.hypot(Math.max(clickX, width - clickX), Math.max(clickY, height - clickY)) || 1;

    // Build Individual Pixel Data
    const pixels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * blockSize;
        const y = r * blockSize;
        const dist = Math.hypot(x + blockSize / 2 - clickX, y + blockSize / 2 - clickY);
        
        // Staggered delay: outward wave + randomized micro-delay for one-by-one dispersal
        const waveDelay = (dist / maxDist) * 0.48;
        const randomJitter = Math.random() * 0.36;
        const delay = waveDelay + randomJitter;
        const duration = 0.32;

        pixels.push({
          x, y, w: blockSize, h: blockSize,
          c, r,
          delay,
          duration,
          glitchColor: Math.random() < 0.4 ? '#E23636' : (Math.random() < 0.7 ? '#ffffff' : '#111111'),
          sparked: false
        });
      }
    }

    // Dispersing Cyber Sparks Particle System
    const sparks = [];
    const maxSparks = 60;

    const startTime = performance.now();
    const maxAnimTime = 1.15; // Total duration in seconds

    function animate(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let completedCount = 0;

      // Image source crop mapping helper (cover crop mode)
      function getSrcCoords(img, x, y, w, h) {
        const imgAspect = img.width / img.height;
        const containerAspect = width / height;
        let sW, sH, sX, sY;

        if (containerAspect > imgAspect) {
          sW = img.width;
          sH = img.width / containerAspect;
          sX = 0;
          sY = 0; // center top
        } else {
          sH = img.height;
          sW = img.height * containerAspect;
          sX = (img.width - sW) / 2;
          sY = 0;
        }

        const normX = x / width;
        const normY = y / height;
        const normW = w / width;
        const normH = h / height;

        return {
          sx: sX + normX * sW,
          sy: sY + normY * sH,
          sw: normW * sW,
          sh: normH * sH
        };
      }

      // Render Each Pixel Block
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        const localT = (elapsed - p.delay) / p.duration;

        if (localT <= 0) {
          // Pre-transition: Draw Source Image Pixel
          if (imagesLoaded) {
            const sc = getSrcCoords(fromImg, p.x, p.y, p.w, p.h);
            ctx.drawImage(fromImg, sc.sx, sc.sy, sc.sw, sc.sh, p.x, p.y, p.w, p.h);
          } else {
            ctx.fillStyle = '#050505';
            ctx.fillRect(p.x, p.y, p.w, p.h);
          }
        } else if (localT < 1.0) {
          // Active Transition Stage: Pixel Morphs One-by-One!
          if (localT < 0.35) {
            // Stage A: Dissolving old pixel with neon red flash
            if (imagesLoaded) {
              const sc = getSrcCoords(fromImg, p.x, p.y, p.w, p.h);
              ctx.drawImage(fromImg, sc.sx, sc.sy, sc.sw, sc.sh, p.x, p.y, p.w, p.h);
            }
            ctx.fillStyle = 'rgba(226, 54, 54, 0.65)';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(p.x, p.y, p.w, p.h);

            // Spawn Spark Particle once
            if (!p.sparked && sparks.length < maxSparks && Math.random() < 0.3) {
              p.sparked = true;
              sparks.push({
                x: p.x + p.w / 2,
                y: p.y + p.h / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                size: Math.random() * 3 + 1.5,
                color: p.glitchColor,
                life: 1.0,
                decay: Math.random() * 0.04 + 0.03
              });
            }
          } else if (localT < 0.7) {
            // Stage B: Cyber Matrix Scramble Pixel
            const shrink = Math.sin(localT * Math.PI) * 2;
            ctx.fillStyle = p.glitchColor;
            ctx.fillRect(p.x + shrink, p.y + shrink, p.w - shrink * 2, p.h - shrink * 2);

            ctx.strokeStyle = '#E23636';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
          } else {
            // Stage C: Materializing Target Image Pixel into place
            if (imagesLoaded) {
              const sc = getSrcCoords(toImg, p.x, p.y, p.w, p.h);
              ctx.drawImage(toImg, sc.sx, sc.sy, sc.sw, sc.sh, p.x, p.y, p.w, p.h);
            }
            // Glow Border on snap
            const glowOpacity = (1.0 - localT) * 3;
            ctx.strokeStyle = `rgba(226, 54, 54, ${glowOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(p.x, p.y, p.w, p.h);
          }
        } else {
          // Complete: Clean Target Image Pixel
          if (imagesLoaded) {
            const sc = getSrcCoords(toImg, p.x, p.y, p.w, p.h);
            ctx.drawImage(toImg, sc.sx, sc.sy, sc.sw, sc.sh, p.x, p.y, p.w, p.h);
          }
          completedCount++;
        }
      }

      // Render & Update Sparks Particle System
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= sp.decay;

        if (sp.life <= 0) {
          sparks.splice(s, 1);
          continue;
        }

        ctx.fillStyle = sp.color;
        ctx.shadowColor = '#E23636';
        ctx.shadowBlur = 8;
        ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
      }
      ctx.shadowBlur = 0;

      // Update Pixel HUD Progress
      const pct = Math.min(100, Math.round((completedCount / totalPixels) * 100));
      if (progressText) {
        progressText.textContent = `REASSEMBLING PIXELS: ${pct}%`;
      }
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }

      // Check Completion
      if (completedCount >= totalPixels || elapsed >= maxAnimTime) {
        // Finalize Transition State
        isRevealed = !isRevealed;
        container.classList.toggle('is-revealed', isRevealed);

        // Update HUD Status Labels
        if (statusLabel) {
          if (isRevealed) {
            statusLabel.innerHTML = `<span class="text-green-400 font-black flex items-center gap-1.5"><i class="fa-solid fa-user-check"></i> REAL IDENTITY</span> <span class="text-gray-300 font-mono text-[10px] hidden sm:inline">// CLICK TO SUIT UP</span>`;
          } else {
            statusLabel.innerHTML = `<span class="text-spidey-red font-black flex items-center gap-1.5"><i class="fa-solid fa-mask animate-pulse"></i> SPIDER SUIT ACTIVE</span> <span class="text-gray-300 font-mono text-[10px] hidden sm:inline">// CLICK TO UNMASK</span>`;
          }
        }

        // Hide overlays
        setTimeout(() => {
          canvas.classList.remove('active');
          container.classList.remove('animating-pixels');
          if (pixelHUD) pixelHUD.classList.remove('active');
          ctx.clearRect(0, 0, width, height);
          isTransitioning = false;
        }, 120);

        if (window.showToast) {
          window.showToast(isRevealed ? 'PIXEL PROTOCOL: REAL IDENTITY UNMASKED' : 'PIXEL PROTOCOL: SPIDER SUIT MATERIALIZED');
        }
      } else {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // Click / Tap Event Listeners
  container.addEventListener('click', (e) => {
    runPixelTransition(e);
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      runPixelTransition(e);
    });
  }
}

/* ----------------------------------------------------
   3. WEBGL NOISE & WEB STRAND BACKGROUND SHADER
---------------------------------------------------- */
function initBackgroundShader() {
  const canvas = document.getElementById('webgl-bg-canvas');
  if (!canvas) return;

  function syncSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }
  syncSize();
  window.addEventListener('resize', syncSize);

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vs = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fs = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_texCoord;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = v_texCoord;
      vec2 mouse = u_mouse / u_resolution;
      
      float noise = snoise(uv * 3.5 + u_time * 0.08);
      float strands = smoothstep(0.42, 0.44, abs(noise));
      
      float dist = distance(uv, mouse);
      float glow = smoothstep(0.35, 0.0, dist) * 0.4;
      
      vec3 baseColor = vec3(0.02, 0.02, 0.02);
      vec3 accentColor = vec3(0.89, 0.21, 0.21); // Spidey Red
      
      vec3 finalColor = mix(baseColor, accentColor * 0.35, (1.0 - strands) * 0.3);
      finalColor += accentColor * glow;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = canvas.height - e.clientY;
  });

  function render(t) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  render(0);
}

/* ----------------------------------------------------
   4. THREE.JS 3D INTERACTIVE HERO SPIDER EMBLEM
---------------------------------------------------- */
function initThreeHero() {
  const container = document.getElementById('threejs-hero-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLightRed = new THREE.PointLight(0xe23636, 4, 20);
  pointLightRed.position.set(4, 4, 4);
  scene.add(pointLightRed);

  const pointLightWhite = new THREE.PointLight(0xffffff, 2, 20);
  pointLightWhite.position.set(-4, -4, 3);
  scene.add(pointLightWhite);

  const group = new THREE.Group();

  // Geometric Spider Emblem
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xe23636,
    metalness: 0.3,
    roughness: 0.2,
    emissive: 0x5a0808,
    wireframe: false
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8f9fa,
    metalness: 0.8,
    roughness: 0.1,
    emissive: 0x333333
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.6,
    roughness: 0.4
  });

  // Central Abdomen
  const thoraxGeo = new THREE.OctahedronGeometry(1.0, 2);
  const thorax = new THREE.Mesh(thoraxGeo, redMat);
  thorax.scale.set(0.9, 1.3, 0.5);
  group.add(thorax);

  // Head
  const headGeo = new THREE.OctahedronGeometry(0.55, 1);
  const head = new THREE.Mesh(headGeo, blackMat);
  head.position.set(0, 1.2, 0.15);
  head.scale.set(0.8, 0.7, 0.5);
  group.add(head);

  // Emblem Eyes (White angular facets)
  const eyeGeo = new THREE.TetrahedronGeometry(0.28, 0);
  const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
  eyeL.position.set(-0.25, 1.25, 0.4);
  eyeL.rotation.set(0.3, 0.4, 0.2);
  eyeL.scale.set(1, 1.6, 0.4);
  group.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
  eyeR.position.set(0.25, 1.25, 0.4);
  eyeR.rotation.set(0.3, -0.4, -0.2);
  eyeR.scale.set(1, 1.6, 0.4);
  group.add(eyeR);

  // 8 Articulated Geometric Legs
  const legCoords = [
    { side: -1, y: 0.8, xBend: 1.8, yBend: 1.8, xEnd: 2.2, yEnd: 0.6 },
    { side: 1,  y: 0.8, xBend: 1.8, yBend: 1.8, xEnd: 2.2, yEnd: 0.6 },
    { side: -1, y: 0.3, xBend: 2.1, yBend: 0.9, xEnd: 2.5, yEnd: -0.4 },
    { side: 1,  y: 0.3, xBend: 2.1, yBend: 0.9, xEnd: 2.5, yEnd: -0.4 },
    { side: -1, y: -0.3, xBend: 2.0, yBend: -0.4, xEnd: 2.3, yEnd: -1.4 },
    { side: 1,  y: -0.3, xBend: 2.0, yBend: -0.4, xEnd: 2.3, yEnd: -1.4 },
    { side: -1, y: -0.8, xBend: 1.6, yBend: -1.5, xEnd: 1.8, yEnd: -2.4 },
    { side: 1,  y: -0.8, xBend: 1.6, yBend: -1.5, xEnd: 1.8, yEnd: -2.4 },
  ];

  legCoords.forEach((coord) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(coord.side * 0.3, coord.y, 0),
      new THREE.Vector3(coord.side * coord.xBend, coord.yBend, 0.2),
      new THREE.Vector3(coord.side * coord.xEnd, coord.yEnd, -0.2)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.05, 6, false);
    const legMesh = new THREE.Mesh(tubeGeo, redMat);
    group.add(legMesh);
  });

  scene.add(group);

  // Floating Cyber Particles / Web Nodes
  const particleCount = 180;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 12;
    posArray[i + 1] = (Math.random() - 0.5) * 12;
    posArray[i + 2] = (Math.random() - 0.5) * 8;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xe23636,
    size: 0.08,
    transparent: true,
    opacity: 0.75
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse tilt tracking
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
    targetRotY = nx * 0.8;
    targetRotX = -ny * 0.6;
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    currentRotX += (targetRotX - currentRotX) * 0.06;
    currentRotY += (targetRotY - currentRotY) * 0.06;

    group.rotation.x = currentRotX + Math.sin(elapsed * 1.5) * 0.08;
    group.rotation.y = currentRotY + Math.cos(elapsed * 1.2) * 0.12;
    group.position.y = Math.sin(elapsed * 2.0) * 0.15;

    particleSystem.rotation.y = elapsed * 0.04;
    particleSystem.rotation.x = Math.sin(elapsed * 0.03) * 0.1;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ----------------------------------------------------
   5. INTERACTIVE SKILL WEB GRAPH (CANVAS + NODES)
---------------------------------------------------- */
function initSkillWebGraph() {
  const container = document.getElementById('skillWebContainer');
  const canvas = document.getElementById('skill-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  const nodes = Array.from(container.querySelectorAll('.skill-node'));
  const coreNode = container.querySelector('.core-node');

  function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let hoveredNode = null;
  let pulseTime = 0;

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      hoveredNode = node;
    });
    node.addEventListener('mouseleave', () => {
      hoveredNode = null;
    });
  });

  function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const containerRect = container.getBoundingClientRect();
    const coreRect = coreNode.getBoundingClientRect();

    const coreX = coreRect.left + coreRect.width / 2 - containerRect.left;
    const coreY = coreRect.top + coreRect.height / 2 - containerRect.top;

    pulseTime += 0.03;

    nodes.forEach((node, idx) => {
      if (node === coreNode) return;
      const nRect = node.getBoundingClientRect();
      const nodeX = nRect.left + nRect.width / 2 - containerRect.left;
      const nodeY = nRect.top + nRect.height / 2 - containerRect.top;

      const isConnected = hoveredNode === node || hoveredNode === coreNode;

      // Draw Base Spider Strand
      ctx.beginPath();
      ctx.moveTo(coreX, coreY);
      ctx.lineTo(nodeX, nodeY);

      if (isConnected) {
        ctx.strokeStyle = '#E23636';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#E23636';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();

      // Inter-node secondary web strands
      const nextNode = nodes[(idx + 1) % nodes.length];
      if (nextNode && nextNode !== coreNode) {
        const nextRect = nextNode.getBoundingClientRect();
        const nxX = nextRect.left + nextRect.width / 2 - containerRect.left;
        const nxY = nextRect.top + nextRect.height / 2 - containerRect.top;
        ctx.beginPath();
        ctx.moveTo(nodeX, nodeY);
        ctx.lineTo(nxX, nxY);
        ctx.strokeStyle = 'rgba(226, 54, 54, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Animated Electrical Pulse on Strand
      const pulsePos = (Math.sin(pulseTime + idx * 0.8) + 1) / 2;
      const px = coreX + (nodeX - coreX) * pulsePos;
      const py = coreY + (nodeY - coreY) * pulsePos;

      ctx.beginPath();
      ctx.arc(px, py, isConnected ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isConnected ? '#ffffff' : '#E23636';
      ctx.shadowColor = '#E23636';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    requestAnimationFrame(drawLines);
  }

  positionNodes();
  window.addEventListener('resize', positionNodes);
  drawLines();

  function positionNodes() {
    const config = [
      { id: 'node-langgraph', left: '18%', top: '18%' },
      { id: 'node-dsa',       left: '50%', top: '12%' },
      { id: 'node-gcp',       left: '82%', top: '20%' },
      { id: 'node-cv',        left: '12%', top: '48%' },
      { id: 'node-salesforce',left: '86%', top: '50%' },
      { id: 'node-crypto',    left: '16%', top: '78%' },
      { id: 'node-mern',      left: '48%', top: '86%' },
      { id: 'node-zerotrust', left: '82%', top: '78%' },
      { id: 'node-docker',    left: '32%', top: '30%' },
      { id: 'node-socket',    left: '68%', top: '30%' },
      { id: 'node-owasp',     left: '32%', top: '68%' },
      { id: 'node-rag',       left: '68%', top: '68%' },
    ];

    config.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        el.style.left = item.left;
        el.style.top = item.top;
        el.style.transform = 'translate(-50%, -50%)';
      }
    });
  }
}

/* ----------------------------------------------------
   6. INTERSECTION OBSERVER ENTRANCE ANIMATIONS
---------------------------------------------------- */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.swing-up, .swing-right, .swing-left').forEach((el) => {
    observer.observe(el);
  });
}

/* ----------------------------------------------------
   7. CONTACT TERMINAL & COPY-TO-CLIPBOARD ACTIONS
---------------------------------------------------- */
function initContactTerminal() {
  window.showToast = function(message) {
    let toast = document.getElementById('comic-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'comic-toast';
      toast.className = 'fixed bottom-8 right-8 z-50 bg-spidey-red text-white font-black text-xs uppercase tracking-widest px-6 py-3 border-2 border-white shadow-[6px_6px_0_0_#fff] transition-all duration-300 transform translate-y-20 opacity-0';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2800);
  };

  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(`COPIED ${label.toUpperCase()} TO CLIPBOARD`);
    }).catch(() => {
      window.showToast(`FAILED TO COPY`);
    });
  };

  // Handle Signal Contact Form Submission
  const contactForm = document.getElementById('signalForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value || 'Agent';
      window.showToast(`TRANSMISSION SENT! THANK YOU, ${name.toUpperCase()}`);
      contactForm.reset();
    });
  }
}

/* ----------------------------------------------------
   8. MOBILE NAVIGATION TOGGLE
---------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}
