import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useThreeBackground() {
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<HTMLCanvasElement | null>(null);

  // Particles
  useEffect(() => {
    if (!bgRef.current) return;
    const canvas = bgRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    camera.position.z = 9;

    const N = 900, geo = new THREE.BufferGeometry(), pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i*3]=(Math.random()-.5)*60; pos[i*3+1]=(Math.random()-.5)*36; pos[i*3+2]=(Math.random()-.5)*20; }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xa28af7, size: 0.035, transparent: true, opacity: .75 });
    const pts = new THREE.Points(geo, mat); scene.add(pts);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => { mx = (e.clientX / innerWidth - .5) * .25; my = (e.clientY / innerHeight - .5) * .25; };
    const onResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    addEventListener("mousemove", onMouse); addEventListener("resize", onResize);

    let raf = 0; const loop = () => { raf = requestAnimationFrame(loop);
      pts.rotation.y += 0.0007 + mx * 0.0015; pts.rotation.x += 0.0002 - my * 0.001; renderer.render(scene, camera); };
    loop();

    return () => { removeEventListener("mousemove", onMouse); removeEventListener("resize", onResize);
      cancelAnimationFrame(raf); renderer.dispose(); geo.dispose(); mat.dispose(); };
  }, []);

  // Waves overlay
  useEffect(() => {
    if (!fxRef.current) return;
    const canvas = fxRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const vs = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0);} `;
    const fs = `precision mediump float; varying vec2 vUv; uniform float uTime;
      void main(){ vec2 uv=vUv; float t=uTime*.25;
        float w=sin((uv.x*10.)+t)*.06+cos((uv.y*8.)-t*.8)*.06;
        float glow=smoothstep(.48,.46,length(uv-.5)+w);
        vec3 col=vec3(0.64,0.54,0.97)*glow*.38; gl_FragColor=vec4(col,.22);} `;
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2),
      new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms: { uTime: { value: 0 } }, transparent: true }));
    scene.add(quad);

    let raf = 0; const loop = (t: number) => { raf = requestAnimationFrame(loop);
      (quad.material as THREE.ShaderMaterial).uniforms.uTime.value = t * 0.001; renderer.render(scene, camera); };
    loop(0);

    const onResize = () => renderer.setSize(innerWidth, innerHeight);
    addEventListener("resize", onResize);

    return () => { removeEventListener("resize", onResize); cancelAnimationFrame(raf);
      (quad.material as THREE.ShaderMaterial).dispose(); quad.geometry.dispose(); renderer.dispose(); };
  }, []);

  return { bgRef, fxRef };
}