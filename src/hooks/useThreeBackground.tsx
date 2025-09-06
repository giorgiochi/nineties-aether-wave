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
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 9;

    const N = 800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    
    for (let i = 0; i < N; i++) { 
      pos[i*3] = (Math.random() - 0.5) * 50; 
      pos[i*3+1] = (Math.random() - 0.5) * 30; 
      pos[i*3+2] = (Math.random() - 0.5) * 15; 
    }
    
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ 
      color: 0xa28af7, 
      size: 0.05, 
      transparent: true, 
      opacity: 0.8,
      sizeAttenuation: true 
    });
    const pts = new THREE.Points(geo, mat); scene.add(pts);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => { 
      mx = (e.clientX / window.innerWidth - 0.5) * 0.3; 
      my = (e.clientY / window.innerHeight - 0.5) * 0.3; 
    };
    
    const onResize = () => { 
      camera.aspect = window.innerWidth / window.innerHeight; 
      camera.updateProjectionMatrix(); 
      renderer.setSize(window.innerWidth, window.innerHeight); 
    };
    
    window.addEventListener("mousemove", onMouse); 
    window.addEventListener("resize", onResize);

    let raf = 0; 
    const loop = () => { 
      raf = requestAnimationFrame(loop);
      pts.rotation.y += 0.001 + mx * 0.002; 
      pts.rotation.x += 0.0005 - my * 0.001; 
      renderer.render(scene, camera); 
    };
    loop();

    return () => { 
      window.removeEventListener("mousemove", onMouse); 
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf); 
      renderer.dispose(); 
      geo.dispose(); 
      mat.dispose(); 
    };
  }, []);

  // Waves overlay
  useEffect(() => {
    if (!fxRef.current) return;
    const canvas = fxRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    const onResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", onResize);

    return () => { 
      window.removeEventListener("resize", onResize); 
      cancelAnimationFrame(raf);
      (quad.material as THREE.ShaderMaterial).dispose(); 
      quad.geometry.dispose(); 
      renderer.dispose(); 
    };
  }, []);

  return { bgRef, fxRef };
}