import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Landing page for Audio Psyco
// Endel-style minimal layout + subtle references to the app (pixel display preview)
// Dark theme, transparencies, soft animations
// Three.js background: particles + soft wave shader overlay
// CTA points to "/app"

export default function Landing() {
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const wavesRef = useRef<HTMLCanvasElement | null>(null);

  // ---------- Three.js Scene 1: particles ----------
  useEffect(() => {
    if (!bgRef.current) return;

    const canvas = bgRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.z = 8;

    const count = 600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xa28af7,
      size: 0.03,
      transparent: true,
      opacity: 0.75,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let mx = 0,
      my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.2;
      my = -(e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      pts.rotation.y += 0.0008 + mx * 0.002;
      pts.rotation.x += 0.0002 + my * 0.002;
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

  // ---------- Three.js Scene 2: soft waves shader overlay ----------
  useEffect(() => {
    if (!wavesRef.current) return;

    const canvas = wavesRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vs = `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position,1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      void main(){
        vec2 uv = vUv;
        float t = uTime * .25;
        float w = sin((uv.x*10.0)+t)*.06 + cos((uv.y*8.0)-t*.8)*.06;
        float glow = smoothstep(.48, .46, length(uv-0.5) + w);
        vec3 col = vec3(0.64,0.54,0.97) * glow * .35; // violet soft
        gl_FragColor = vec4(col, 0.22);
      }
    `;

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
      })
    );
    scene.add(quad);

    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      (quad.material as THREE.ShaderMaterial).uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
    };
    loop(0);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      renderer.dispose();
      quad.geometry.dispose();
      (quad.material as THREE.ShaderMaterial).dispose();
    };
  }, []);

  // ---------- helpers ----------
  const scrollToId = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f3f5f7]">
      {/* Three.js layers */}
      <canvas ref={bgRef} id="bg" className="fixed inset-0 w-full h-full -z-20 pointer-events-none" />
      <canvas ref={wavesRef} id="waves" className="fixed inset-0 w-full h-full -z-10 pointer-events-none mix-blend-screen opacity-70" />

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-5">
          <nav className="flex items-center justify-between py-4">
            <div className="font-bold tracking-wide">Audio Psyco</div>
            <div className="flex items-center gap-3">
              <a
                href="/app"
                className="bg-[#a28af7] text-white px-4 py-2 rounded-xl font-semibold shadow-[0_6px_24px_rgba(162,138,247,.25)] hover:translate-y-[-2px] transition-all"
              >
                Prova ora
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-[86vh] grid place-items-center px-6">
        <div className="max-w-[900px] text-center animate-fade-in">
          <div className="text-[#aab0b6] text-sm mb-3 tracking-wide">Focus. Relax. No Thoughts.</div>
          <h1 className="text-[clamp(36px,6vw,76px)] leading-[1.08] font-bold mb-3">
            Libera la mente. Entra in sessione.
          </h1>
          <p className="text-[#aab0b6] text-[clamp(16px,2.4vw,20px)] max-w-[760px] mx-auto mb-6">
            Audio neurali e rumori ambientali in un'interfaccia essenziale. Scegli la modalità, premi Start, lascia fuori il rumore mentale.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/app" className="bg-[#a28af7] text-white px-6 py-3 rounded-2xl font-semibold shadow-[0_10px_40px_rgba(162,138,247,.28)] hover:translate-y-[-2px] transition-all">
              Prova ora
            </a>
            <button onClick={() => scrollToId("#benefits")} className="bg-white/5 border border-white/15 px-6 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-all">
              Perché funziona
            </button>
          </div>
        </div>
      </section>

      {/* Preview & copy */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-5 grid md:grid-cols-[1.1fr_.9fr] gap-6 bg-white/5 border border-white/15 rounded-2xl p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_24px_80px_rgba(0,0,0,.45)]">
          <div>
            <h2 className="text-[clamp(24px,3vw,36px)] mb-2">Interfaccia semplice. Zero frizioni.</h2>
            <p className="text-[#aab0b6] max-w-[820px]">
              Display chiaro, controlli minimi, nessun autoplay non richiesto. Il volume non cambia da solo. I rumori ambientali si attivano solo quando lo decidi tu.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/5 border border-white/15 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Modalità neurali</h4>
                <p className="text-[#aab0b6] text-sm">Attiva la modalità e parti. Ogni modalità è un ambiente sonoro per focus o rilascio.</p>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-[#a28af7]/15 border border-[#a28af7]/30">Controllo utente totale</span>
              </div>
              <div className="bg-white/5 border border-white/15 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Rumori ambientali</h4>
                <p className="text-[#aab0b6] text-sm">Pioggia, foresta e altre texture. Volume indipendente, mai forzato.</p>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-[#a28af7]/15 border border-[#a28af7]/30">Ambient ON solo su richiesta</span>
              </div>
              <div className="bg-white/5 border border-white/15 rounded-xl p-4">
                <h4 className="font-semibold mb-1">Timer di sessione</h4>
                <p className="text-[#aab0b6] text-sm">Mostra il tempo trascorso. Parte con la sessione, si ferma quando serve.</p>
                <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-[#a28af7]/15 border border-[#a28af7]/30">Chiarezza visiva</span>
              </div>
            </div>
          </div>

          {/* App display preview with pixel font */}
          <div className="font-pixel text-device-primary bg-black rounded-xl p-5 shadow-[inset_0_0_0_1px_#0f1a14,inset_0_0_40px_rgba(132,255,152,.10)]">
            <div className="text-xs my-2">Audio Psyco ver.1</div>
            <div className="text-xs my-2">NO THOUGHTS ▪ ready</div>
            <div className="text-xs my-2">TIMER 00:00:00</div>
            <div className="text-xs my-2">NEURAL VOL 48%</div>
            <div className="text-xs my-2">AMBIENT OFF</div>
            <div className="text-xs my-2">PRESS START ▷</div>
          </div>
        </div>
      </section>

      {/* Modes & waves copy */}
      <section className="py-24" id="modes">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[clamp(24px,3vw,36px)] mb-2">Modalità e onde</h2>
          <p className="text-[#aab0b6] max-w-[820px]">Ogni modalità nasce per uno scopo preciso. Non promettiamo miracoli: ti offriamo strumenti chiari per raggiungere il tuo stato migliore.</p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">No Thoughts</h3>
              <p className="text-[#aab0b6]">Quando i pensieri si accavallano, questa modalità aiuta a creare silenzio interno. Meno stimoli, più presenza. È il tuo interruttore mentale per ripartire.</p>
            </article>
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">Gamma</h3>
              <p className="text-[#aab0b6]">Per compiti intensi e problem solving. Sonorità dirette, asciutte. L'obiettivo è sostenere la concentrazione senza distrazioni.</p>
            </article>
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">Theta</h3>
              <p className="text-[#aab0b6]">Per rallentare, lasciar scivolare le tensioni, preparare la mente a un rilascio profondo. Più spazio, meno pressione.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" id="benefits">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-[clamp(24px,3vw,36px)] mb-2">Perché funziona</h2>
          <p className="text-[#aab0b6] max-w-[820px]">Togliamo attrito. Pochi controlli, regole chiare, suoni puliti. Entri, imposti, parti.</p>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">Riduci il rumore mentale</h3>
              <p className="text-[#aab0b6]">Interfaccia minimale e modalità No Thoughts aiutano a mettere ordine. Meno stimoli superflui, più spazio a ciò che conta.</p>
            </article>
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">Rituale semplice</h3>
              <p className="text-[#aab0b6]">Stesse azioni ogni volta. Start, respira, lavora. La coerenza abbassa le resistenze e migliora la costanza.</p>
            </article>
            <article className="bg-white/5 border border-white/15 rounded-xl p-5 hover:bg-white/8 transition-all">
              <h3 className="text-lg font-semibold mb-2">Ambiente su misura</h3>
              <p className="text-[#aab0b6]">Rumori ambientali quando servono, mai imposti. Volume separato. La scena sonora resta tua.</p>
            </article>
          </div>

          <div className="mt-6 grid place-items-center bg-gradient-to-b from-[#a28af7]/10 to-[#a28af7]/5 border border-white/15 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-2">Pronto a iniziare</h3>
            <p className="text-[#aab0b6] mb-4">Scegli una modalità, imposta i volumi, premi Start. Tutto qui.</p>
            <a href="/app" className="bg-[#a28af7] text-white px-6 py-3 rounded-2xl font-semibold shadow-[0_10px_40px_rgba(162,138,247,.28)] hover:translate-y-[-2px] transition-all">Prova ora</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 py-10 text-[#aab0b6] text-sm">
          Developed by Giorgio Chiriatti — Audiopsyco non è un dispositivo medico. Se hai problemi di attenzione o stress, consigliamo di consultare un medico qualificato.
        </div>
      </footer>
    </div>
  );
}