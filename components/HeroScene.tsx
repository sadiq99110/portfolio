"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive "network globe" for the hero.
 * - Nodes on a sphere joined by edges, with data packets travelling along them.
 * - Tilts toward the cursor, drag to spin (with inertia), click to send a pulse.
 * - Three.js is loaded lazily so it never blocks the first paint.
 * - Pauses when off screen or the tab is hidden; respects reduced motion.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ---------- Renderer, scene, camera ----------
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      const globe = new THREE.Group();
      scene.add(globe);

      // Soft round sprite for points
      const sprite = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.85)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      })();

      // ---------- Nodes (Fibonacci sphere) ----------
      const NODE_COUNT = 160;
      const RADIUS = 2.25;
      const base: InstanceType<typeof THREE.Vector3>[] = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < NODE_COUNT; i++) {
        const y = 1 - (i / (NODE_COUNT - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const jitter = 1 + (Math.random() - 0.5) * 0.08;
        base.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(RADIUS * jitter));
      }

      const nodePos = new Float32Array(NODE_COUNT * 3);
      base.forEach((v, i) => v.toArray(nodePos, i * 3));
      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
      const nodeMat = new THREE.PointsMaterial({
        size: 0.11, map: sprite, transparent: true, depthWrite: false, opacity: 0.95,
      });
      globe.add(new THREE.Points(nodeGeo, nodeMat));

      // ---------- Edges between nearby nodes ----------
      const edges: [number, number][] = [];
      const MAX_DIST = RADIUS * 0.42;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          if (base[i].distanceTo(base[j]) < MAX_DIST) edges.push([i, j]);
        }
      }
      // node index -> edges touching it, so packets can hop node to node
      const adjacency: number[][] = Array.from({ length: NODE_COUNT }, () => []);
      edges.forEach(([a, b], idx) => { adjacency[a].push(idx); adjacency[b].push(idx); });
      const edgePos = new Float32Array(edges.length * 6);
      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
      const edgeMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.22, depthWrite: false });
      globe.add(new THREE.LineSegments(edgeGeo, edgeMat));

      // ---------- Inner core ----------
      const coreMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.18 });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), coreMat);
      globe.add(core);

      // ---------- Data packets moving along edges ----------
      const PACKETS = 36;
      const packets = Array.from({ length: PACKETS }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.5,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
      const packetPos = new Float32Array(PACKETS * 3);
      const packetGeo = new THREE.BufferGeometry();
      packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
      const packetMat = new THREE.PointsMaterial({
        size: 0.17, map: sprite, transparent: true, depthWrite: false,
      });
      globe.add(new THREE.Points(packetGeo, packetMat));

      // ---------- Ambient dust ----------
      const DUST = 500;
      const dustPos = new Float32Array(DUST * 3);
      for (let i = 0; i < DUST; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(3 + Math.random() * 4);
        v.toArray(dustPos, i * 3);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 0.035, map: sprite, transparent: true, opacity: 0.5, depthWrite: false,
      });
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      // ---------- Theme colours (follow light/dark) ----------
      const applyTheme = () => {
        const s = getComputedStyle(document.documentElement);
        const accent = new THREE.Color((s.getPropertyValue("--accent") || "#5eead4").trim());
        const accent2 = new THREE.Color((s.getPropertyValue("--accent-2") || "#a78bfa").trim());
        const text = new THREE.Color((s.getPropertyValue("--muted") || "#8b95a3").trim());
        nodeMat.color.copy(accent);
        edgeMat.color.copy(accent);
        coreMat.color.copy(accent2);
        packetMat.color.copy(accent2);
        dustMat.color.copy(text);
      };
      applyTheme();
      const themeQuery = window.matchMedia("(prefers-color-scheme: light)");
      themeQuery.addEventListener("change", applyTheme);

      // ---------- Interaction ----------
      const pointer = { x: 0, y: 0 };            // normalised -1..1 for tilt
      let dragging = false;
      let moved = 0;
      let lastX = 0, lastY = 0;
      const spin = { x: 0, y: reduceMotion ? 0 : 0.12 }; // angular velocity
      const angle = { x: 0.25, y: 0 };
      let pulse = -1; // time of last click pulse (seconds), -1 = none

      const el = renderer.domElement;
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (dragging) {
          const dx = e.clientX - lastX, dy = e.clientY - lastY;
          moved += Math.abs(dx) + Math.abs(dy);
          spin.y = dx * 0.006 * 60;
          spin.x = dy * 0.006 * 60;
          lastX = e.clientX; lastY = e.clientY;
        }
      };
      const onDown = (e: PointerEvent) => {
        dragging = true; moved = 0;
        lastX = e.clientX; lastY = e.clientY;
        el.setPointerCapture(e.pointerId);
        el.classList.add("grabbing");
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        el.classList.remove("grabbing");
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
        if (moved < 6) {
          // A click, not a drag: send a pulse and a burst of packets
          pulse = clock.getElapsedTime();
          packets.forEach((p) => { p.speed = 0.9 + Math.random() * 1.2; });
        }
      };
      const onLeave = () => { pointer.x = 0; pointer.y = 0; };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointerleave", onLeave);

      // ---------- Sizing ----------
      const resize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Pull the camera back on narrow screens so the globe fits
        camera.position.z = w / h < 0.9 ? 9.5 : 8;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(mount);
      resize();

      // ---------- Animation loop (paused when not visible) ----------
      const clock = new THREE.Clock();
      let visible = true;
      let raf = 0;
      const tmp = new THREE.Vector3();

      const updateEdges = () => {
        for (let k = 0; k < edges.length; k++) {
          const [a, b] = edges[k];
          edgePos[k * 6 + 0] = nodePos[a * 3];     edgePos[k * 6 + 1] = nodePos[a * 3 + 1]; edgePos[k * 6 + 2] = nodePos[a * 3 + 2];
          edgePos[k * 6 + 3] = nodePos[b * 3];     edgePos[k * 6 + 4] = nodePos[b * 3 + 1]; edgePos[k * 6 + 5] = nodePos[b * 3 + 2];
        }
        edgeGeo.attributes.position.needsUpdate = true;
      };
      updateEdges();

      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.getElapsedTime();

        // Rotation: inertia decays back to a gentle idle spin
        const idle = reduceMotion ? 0 : 0.12;
        if (!dragging) {
          spin.y += (idle - spin.y) * Math.min(1, dt * 1.5);
          spin.x += (0 - spin.x) * Math.min(1, dt * 1.5);
        }
        angle.y += spin.y * dt;
        angle.x = THREE.MathUtils.clamp(angle.x + spin.x * dt, -1.2, 1.2);

        // Cursor tilt layered on top
        globe.rotation.y = angle.y + pointer.x * 0.35;
        globe.rotation.x = angle.x + pointer.y * 0.25;
        core.rotation.y = -t * 0.25;
        core.rotation.z = t * 0.1;
        dust.rotation.y = t * 0.015;

        // Breathing + click pulse wave across the nodes
        const since = pulse < 0 ? 99 : t - pulse;
        for (let i = 0; i < NODE_COUNT; i++) {
          const v = base[i];
          let s = 1 + (reduceMotion ? 0 : Math.sin(t * 1.2 + i * 0.37) * 0.015);
          if (since < 2) {
            // wave travels from top (y=+R) to bottom over ~1.2s
            const front = RADIUS - since * (2 * RADIUS / 1.2);
            const d = Math.abs(v.y - front);
            s += Math.max(0, 1 - d / 0.6) * 0.22 * (1 - since / 2);
          }
          tmp.copy(v).multiplyScalar(s).toArray(nodePos, i * 3);
        }
        nodeGeo.attributes.position.needsUpdate = true;
        updateEdges();
        coreMat.opacity = 0.18 + (since < 1 ? (1 - since) * 0.35 : 0);

        // Packets
        for (let p = 0; p < PACKETS; p++) {
          const pk = packets[p];
          pk.speed += (0.4 - pk.speed) * Math.min(1, dt * 0.8);
          pk.t += pk.speed * dt * (reduceMotion ? 0 : 1);
          if (pk.t >= 1) {
            // hop to a random edge that starts where this one ended
            const end = edges[pk.edge][pk.dir > 0 ? 1 : 0];
            const options = adjacency[end];
            const idx = options[Math.floor(Math.random() * options.length)];
            pk.edge = idx;
            pk.dir = edges[idx][0] === end ? 1 : -1;
            pk.t = 0;
          }
          const [a, b] = edges[pk.edge];
          const from = pk.dir > 0 ? a : b, to = pk.dir > 0 ? b : a;
          for (let c = 0; c < 3; c++) {
            packetPos[p * 3 + c] = nodePos[from * 3 + c] + (nodePos[to * 3 + c] - nodePos[from * 3 + c]) * pk.t;
          }
        }
        packetGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        if (visible) raf = requestAnimationFrame(frame);
      };

      const start = () => { if (!raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) start(); else stop();
      });
      io.observe(mount);
      const onVis = () => {
        visible = !document.hidden;
        if (visible) start(); else stop();
      };
      document.addEventListener("visibilitychange", onVis);

      requestAnimationFrame(() => mount.classList.add("ready"));
      start();

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        themeQuery.removeEventListener("change", applyTheme);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointerleave", onLeave);
        [nodeGeo, edgeGeo, packetGeo, dustGeo, core.geometry].forEach((g) => g.dispose());
        [nodeMat, edgeMat, coreMat, packetMat, dustMat].forEach((m) => m.dispose());
        sprite.dispose();
        renderer.dispose();
        el.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <div ref={mountRef} className="hero-canvas" />
      <p className="scene-hint mono">drag to spin · click to pulse</p>
    </div>
  );
}
