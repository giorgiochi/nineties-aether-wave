import React, { useState, useEffect, useRef } from "react";

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedMode, setSelectedMode] = useState("FOCUS");
  const [neuralVolume, setNeuralVolume] = useState(30);
  const [ambientVolume, setAmbientVolume] = useState(80);
  const [selectedSound, setSelectedSound] = useState("Ocean");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const styles = `
    :root{
      --bg:#0e1116;
      --panel:#171b22;
      --panel-2:#1d222b;
      --stroke:#222832;
      --ink:#cfd6e4;
      --ink-dim:#8791a3;
      --accent:#23c26b;
      --accent-2:#42a5f5;
      --warning:#f5a623;
      --focus:#23c26b;
      --relax:#69d3ff;
      --adhd:#f6c251;
      --void:#ffa86a;
      --radius:18px;
      --shadow-big: 0 40px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.03);
      --shadow-soft: 0 16px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03);
      --grad: radial-gradient(1200px 600px at 20% -10%, rgba(66,165,245,.08), transparent 60%),
              radial-gradient(800px 400px at 90% 10%, rgba(35,194,107,.06), transparent 60%),
              radial-gradient(1000px 600px at 50% 120%, rgba(255,168,106,.06), transparent 60%);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,"Helvetica Neue",Arial,"Noto Sans",sans-serif;background:var(--bg);color:var(--ink);line-height:1.5;}
    a{color:var(--ink)}
    .wrap{max-width:1120px;margin:0 auto;padding:32px}

    .hero{position:relative;min-height:86vh;display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:center;background:var(--grad);} 
    .badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(180deg,#11151c,#0c0f14);border:1px solid var(--stroke);padding:8px 12px;border-radius:999px;color:var(--ink-dim);box-shadow:var(--shadow-soft)}
    .h1{font-weight:800;font-size:48px;letter-spacing:-.02em;margin:16px 0 8px}
    .lead{color:var(--ink-dim);font-size:18px;max-width:56ch}
    .cta{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
    .btn{appearance:none;border:0;border-radius:14px;padding:14px 18px;font-weight:700;cursor:pointer;transition:transform .08s ease,opacity .2s ease,box-shadow .2s ease;text-decoration:none;display:inline-block}
    .btn:hover{transform:translateY(-1px)}
    .btn:active{transform:translateY(0)}
    .btn-primary{background:linear-gradient(180deg,#1ad06a,#1ab65e);color:#08140c;box-shadow:0 10px 24px rgba(26,208,106,.35)}
    .btn-ghost{background:#11151b;border:1px solid var(--stroke);color:var(--ink)}

    .device{justify-self:center;width:min(420px,92%);background:linear-gradient(180deg,#161b23,#0f131a);border:1px solid #212733;border-radius:26px;padding:18px;box-shadow:var(--shadow-big);position:relative}
    .device:before,.device:after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:#202633;top:10px}
    .device:before{left:10px}
    .device:after{right:10px}

    .lcd{height:92px;background:radial-gradient(100% 140% at 50% 0, #0b2316 0, #071510 50%, #05130e 100%);border:1px solid #183024;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02)}
    .lcd-text{font-family:"JetBrains Mono",monospace;font-size:14px;line-height:1.2;text-align:center;color:#72ffb7;text-shadow:0 0 8px rgba(35,194,107,.5)}

    .panel{background:linear-gradient(180deg,#1a202a,#131820);border:1px solid var(--stroke);border-radius:14px;padding:14px;margin:10px 0;box-shadow:var(--shadow-soft)}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .seg-title{font-size:12px;color:var(--ink-dim);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}
    .pill{display:flex;align-items:center;justify-content:center;background:#0f131a;border:1px solid var(--stroke);border-radius:12px;padding:12px 14px;font-weight:700;cursor:pointer;transition:all 0.2s}
    .pill.is-active{background:linear-gradient(180deg,#19202a,#0f151d);box-shadow:inset 0 -18px 40px rgba(255,255,255,.02),0 10px 20px rgba(0,0,0,.35)}
    .pill--focus.is-active{outline:2px solid var(--focus)}
    .pill--relax.is-active{outline:2px solid var(--relax)}
    .pill--adhd.is-active{outline:2px solid var(--adhd)}
    .pill--void.is-active{outline:2px solid var(--void)}

    .slider{height:10px;background:#0f131a;border:1px solid var(--stroke);border-radius:999px;position:relative;cursor:pointer}
    .slider .fill{position:absolute;left:0;top:0;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--warning),#ffd27f)}
    .slider .thumb{position:absolute;top:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:#0f131a;border:1px solid var(--stroke);box-shadow:0 2px 8px rgba(0,0,0,.4)}

    .slider.green .fill{background:linear-gradient(90deg,#56ffa9,#0be476)}

    .session{display:flex;justify-content:center;align-items:center}
    .btn-round{display:inline-flex;align-items:center;gap:10px;border-radius:12px;padding:12px 16px;background:linear-gradient(180deg,#1ad06a,#1ab65e);border:0;color:#05150d;font-weight:800;cursor:pointer}

    .section{padding:84px 0}
    .section h2{font-size:36px;margin:0 0 10px}
    .section p.lead{margin:0 auto 26px}
    .grid{display:grid;gap:18px}
    .grid.cols-3{grid-template-columns:repeat(3,1fr)}
    .card{background:linear-gradient(180deg,#161b23,#10151c);border:1px solid var(--stroke);border-radius:16px;padding:18px;box-shadow:var(--shadow-soft)}
    .kpi{font-family:"JetBrains Mono",monospace;color:var(--ink-dim);font-size:13px}

    .modal{position:fixed;inset:0;background:rgba(6,8,12,.8);display:none;align-items:center;justify-content:center;padding:24px;z-index:1000}
    .modal.is-open{display:flex}
    .modal .sheet{width:min(860px,96%);background:linear-gradient(180deg,#161b23,#0f141b);border:1px solid var(--stroke);border-radius:22px;box-shadow:var(--shadow-big);padding:26px}
    .modal .sheet header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .x{background:#11151b;border:1px solid var(--stroke);border-radius:10px;padding:8px 10px;cursor:pointer}

    footer{padding:26px 0;color:var(--ink-dim);border-top:1px solid var(--stroke)}

    /* Desktop and mobile navigation */
    .desktop-nav{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
    .hamburger{display:none;flex-direction:column;cursor:pointer;padding:8px;gap:4px;border:1px solid var(--stroke);border-radius:8px;background:var(--panel)}
    .hamburger span{display:block;width:20px;height:2px;background:var(--ink);transition:all 0.3s ease;border-radius:1px}
    .hamburger.active span:nth-child(1){transform:rotate(45deg) translate(5px, 5px)}
    .hamburger.active span:nth-child(2){opacity:0}
    .hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(7px, -6px)}
    
    .mobile-menu{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(14,17,22,0.95);backdrop-filter:blur(8px);z-index:1000;display:none;align-items:center;justify-content:center;flex-direction:column;gap:32px}
    .mobile-menu.is-open{display:flex}
    .mobile-menu a, .mobile-menu button{font-size:20px;padding:16px 24px;border-radius:12px;transition:all 0.2s;min-height:56px;display:flex;align-items:center;justify-content:center}
    .mobile-menu a{color:var(--ink);text-decoration:none;background:var(--panel);border:1px solid var(--stroke)}
    .mobile-menu a:hover{background:var(--panel-2);transform:translateY(-2px)}
    .mobile-menu .close-menu{position:absolute;top:24px;right:24px;width:48px;height:48px;background:var(--panel);border:1px solid var(--stroke);border-radius:12px;color:var(--ink);font-size:20px;cursor:pointer}

    @media (max-width:1000px){
      .hero{grid-template-columns:1fr;min-height:auto;text-align:center}
      .device{order:-1;margin:20px auto 0;width:min(360px,95%)}
      .h1{font-size:32px;line-height:1.1}
      .lead{font-size:16px;max-width:none}
      .grid.cols-3{grid-template-columns:1fr}
      .wrap{padding:20px}
      .section{padding:60px 0}
      .cta{justify-content:center}
      .btn{padding:16px 24px;font-size:16px}
      
      /* Show hamburger, hide regular menu */
      .hamburger{display:flex}
      .desktop-nav{display:none !important}
      
      /* Mobile modal optimizations */
      .modal{padding:12px;align-items:flex-start;padding-top:20px}
      .modal .sheet{width:100%;max-width:none;margin:0;padding:16px;border-radius:16px;max-height:95vh;overflow-y:auto}
      .modal .sheet header{margin-bottom:16px;align-items:flex-start}
      .modal .sheet .grid{grid-template-columns:1fr;gap:16px}
      .modal .device{width:100%;max-width:300px;margin:0 auto}
      .modal .lcd{height:70px}
      .modal .lcd-text{font-size:11px}
      .modal .panel{margin:6px 0;padding:10px}
      .modal .pill{padding:8px 10px;font-size:13px}
      .modal .seg-title{font-size:10px}
      .modal .btn-round{padding:8px 12px;font-size:13px}
      .modal .x{width:40px;height:40px;display:flex;align-items:center;justify-content:center}
      
      /* Touch-friendly sliders */
      .slider{height:14px;margin:10px 0}
      .slider .thumb{width:22px;height:22px}
      
      /* Better card spacing on mobile */
      .card{padding:14px}
      .card h3{font-size:16px;margin-bottom:8px}
      .card p{font-size:14px;line-height:1.4}
    }
    
    @media (max-width:640px){
      .h1{font-size:26px}
      .section h2{font-size:24px}
      .device{width:min(280px,90%)}
      .wrap{padding:12px}
      .hero{padding:16px 0}
      
      /* Ultra-compact mobile modal */
      .modal{padding:4px;padding-top:12px}
      .modal .sheet{padding:12px;border-radius:12px;max-height:98vh}
      .modal .device{max-width:260px}
      .modal .lcd{height:60px}
      .modal .lcd-text{font-size:10px}
      .modal .row{gap:6px;grid-template-columns:1fr 1fr}
      .modal .pill{padding:6px 8px;font-size:12px;min-height:36px}
      .modal .panel{margin:4px 0;padding:8px}
      .modal .seg-title{margin-bottom:6px}
      .modal .btn-round{min-height:36px;font-size:12px}
      .modal .card{padding:10px;margin-bottom:10px}
      .modal .card h3{font-size:14px}
      .modal .card p{font-size:12px}
      
      /* Stack pills for "NO THOUGHTS" mode on very small screens */
      .modal .row{grid-template-columns:1fr 1fr 1fr 1fr}
    }

    details.card summary{cursor:pointer;font-weight:600;padding:4px 0}
    details.card[open] summary{margin-bottom:10px}
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsRunning(false);
    setTimer(0);
  };

  const handleSliderClick = (e: React.MouseEvent, type: 'neural' | 'ambient') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.round(100 * x / rect.width);
    const clampedPct = Math.max(0, Math.min(100, pct));
    
    if (type === 'neural') {
      setNeuralVolume(clampedPct);
    } else {
      setAmbientVolume(clampedPct);
    }
  };

  const toggleSession = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const getLcdText = () => {
    const status = isRunning ? formatTime(timer) : "00:00:00";
    return (
      <>
        {selectedMode} • {status}
        <br />
        <span style={{ opacity: 0.75 }}>
          NEURAL {neuralVolume}% • AMBIENT {ambientVolume}%
        </span>
      </>
    );
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      <header className="wrap" aria-label="Intestazione del sito">
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid var(--stroke)", background: "linear-gradient(180deg,#10151b,#0c1016)" }}></div>
            <strong>Audiopsyco</strong>
          </div>
          
          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <a href="#funzioni" className="kpi" style={{ padding: "8px" }}>Funzioni</a>
            <a href="#come" className="kpi" style={{ padding: "8px" }}>Come funziona</a>
            <a href="#faq" className="kpi" style={{ padding: "8px" }}>FAQ</a>
            <button className="btn btn-primary" onClick={openModal}>Provala ora</button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
          <button 
            className="close-menu"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Chiudi menu"
          >
            ✕
          </button>
          <a href="#funzioni" onClick={() => setIsMobileMenuOpen(false)}>Funzioni</a>
          <a href="#come" onClick={() => setIsMobileMenuOpen(false)}>Come funziona</a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal();
            }}
            style={{ width: "200px" }}
          >
            Provala ora
          </button>
        </div>
      </header>

      <main>
        <section className="hero wrap" id="home">
          <div>
            <div className="badge">Nuova versione • Demo interattiva inclusa</div>
            <h1 className="h1">Audiopsyco – Focus e Relax con un tocco</h1>
            <p className="lead">Audiopsyco combina stimoli neurali e suoni ambientali in un'interfaccia semplice per entrare nello stato mentale giusto in meno tempo. Modalità Focus, Relax, ADHD e No Thoughts, con volumi indipendenti e avvio sessione.</p>
            <div className="cta">
              <button className="btn btn-primary" onClick={openModal}>Avvia demo interattiva</button>
              <a className="btn btn-ghost" href="#funzioni">Scopri le funzioni</a>
            </div>
            <p className="kpi" style={{ marginTop: "10px" }}>Non è un dispositivo medico. Per problemi di attenzione o stress si consiglia di rivolgersi a un medico qualificato.</p>
          </div>

          <aside className="device" aria-label="Anteprima applicazione">
            <div className="lcd">
              <div className="lcd-text">
                FOCUS • 01:00:00<br />
                <span style={{ opacity: 0.75 }}>NEURAL 30% • AMBIENT OFF • READY</span>
              </div>
            </div>

            <div className="panel">
              <div className="seg-title">Focus Modes</div>
              <div className="row">
                <div className="pill pill--focus is-active">Focus</div>
                <div className="pill pill--relax">Relax</div>
                <div className="pill pill--adhd">ADHD</div>
                <div className="pill pill--void">No Thoughts</div>
              </div>
            </div>

            <div className="panel">
              <div className="seg-title">Neural Volume</div>
              <div className="slider">
                <div className="fill" style={{ width: "32%" }}></div>
                <div className="thumb" style={{ left: "32%" }}></div>
              </div>
            </div>

            <div className="panel">
              <div className="seg-title">Ambient Volume</div>
              <div className="slider green">
                <div className="fill" style={{ width: "86%" }}></div>
                <div className="thumb" style={{ left: "86%" }}></div>
              </div>
            </div>

            <div className="panel session">
              <button className="btn-round">▶ Start</button>
            </div>

            <div className="panel">
              <div className="seg-title">Ambient Sounds</div>
              <div className="row">
                <div className="pill is-active">Ocean</div>
                <div className="pill">Rain</div>
                <div className="pill">Forest</div>
                <div className="pill">Airport</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="section wrap" id="funzioni">
          <h2>Quattro modalità per il tuo stato mentale</h2>
          <p className="lead">Tutto quello che serve per guidare lo stato mentale senza distrazioni.</p>
          <div className="grid cols-3">
            <article className="card">
              <h3>Quattro modalità</h3>
              <p>Seleziona Focus, Relax, ADHD o No Thoughts. Ogni modalità applica preset dedicati di stimoli neurali e suggerimenti ambientali.</p>
            </article>
            <article className="card">
              <h3>Volumi separati</h3>
              <p>Controlli indipendenti per Neural e Ambient. Mantieni la spinta cognitiva bassa e i rumori ambientali più alti o viceversa.</p>
            </article>
            <article className="card">
              <h3>Session Control</h3>
              <p>Avvio rapido con Start, stato in tempo reale sul display e indicatori di prontezza. Pensato per essere chiaro anche al buio.</p>
            </article>
            <article className="card">
              <h3>Suoni ambientali</h3>
              <p>Ocean, Rain, Forest, Airport. Seleziona la texture sonora che ti aiuta ad entrare nel flusso e a mascherare le distrazioni.</p>
            </article>
            <article className="card">
              <h3>UI dark grafite</h3>
              <p>Interfaccia a pannelli con display verde, controlli a pillola e micro‑gradazioni per un'esperienza elegante e leggibile.</p>
            </article>
            <article className="card">
              <h3>Privacy by design</h3>
              <p>Nessun tracciamento superfluo. La demo qui sotto gira in locale nel browser. L'app completa non vende i tuoi dati.</p>
            </article>
          </div>
        </section>

        <section className="section wrap" id="come">
          <h2>Suoni ambientali e stimoli neurali personalizzabili</h2>
          <div className="grid cols-3">
            <article className="card">
              <h3>1. Scegli la modalità</h3>
              <p>Seleziona Focus per concentrazione profonda, Relax per decomprimere, ADHD per stimolazione ritmica, No Thoughts per azzerare il dialogo interno.</p>
            </article>
            <article className="card">
              <h3>2. Regola i volumi</h3>
              <p>Imposta Neural e Ambient secondo la sensibilità personale. L'equilibrio ottimale arriva dopo pochi tentativi.</p>
            </article>
            <article className="card">
              <h3>3. Avvia la sessione</h3>
              <p>Premi Start. Il display mostra timer e stato. Interrompi quando preferisci, riprendi da dove eri.</p>
            </article>
          </div>
          <div className="cta">
            <button className="btn btn-primary" onClick={openModal}>Provala adesso</button>
          </div>
        </section>

        {/* Interface Section */}
        <section className="section wrap" id="interfaccia">
          <h2>Un'interfaccia scura, elegante e intuitiva</h2>
          <p className="lead">Design pensato per l'uso prolungato senza affaticare la vista.</p>
          <div className="grid cols-3">
            <article className="card">
              <h3>Display LCD Verde</h3>
              <p>Schermo retroilluminato che mostra stato, timer e parametri senza abbagliare. Perfetto anche in ambienti bui.</p>
            </article>
            <article className="card">
              <h3>Controlli a Pillola</h3>
              <p>Pulsanti grandi e chiari per modalità e suoni ambientali. Feedback visivo immediato per la selezione attiva.</p>
            </article>
            <article className="card">
              <h3>Slider Precisi</h3>
              <p>Regolazione fine dei volumi Neural e Ambient con indicatori percentuali in tempo reale.</p>
            </article>
          </div>
        </section>

        {/* Demo Section */}
        <section className="section wrap" id="demo">
          <h2>Demo gratuita: provala subito</h2>
          <p className="lead">Sperimenta l'interfaccia e i controlli senza installare nulla.</p>
          <div className="cta">
            <button className="btn btn-primary" onClick={openModal}>Avvia demo interattiva</button>
          </div>
        </section>

        <section className="section wrap" id="faq">
          <h2>Domande frequenti (FAQ)</h2>
          <div className="grid">
            <details className="card">
              <summary><strong>L'app è un dispositivo medico?</strong></summary>
              <p>No. Audiopsyco è uno strumento di benessere digitale. In caso di problemi clinici rivolgiti a un professionista.</p>
            </details>
            <details className="card">
              <summary><strong>Posso usarla mentre lavoro?</strong></summary>
              <p>Sì. È stata progettata per essere discreta e poco invasiva. Il consiglio è partire a basso volume.</p>
            </details>
            <details className="card">
              <summary><strong>Serve un account?</strong></summary>
              <p>Per la demo no. L'app completa offre salvataggio preset facoltativo.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <p>© {new Date().getFullYear()} Audiopsyco • Progetto di Giorgio Chiriatti. Non è un dispositivo medico.</p>
          <div className="kpi">OCN 08 • PGG 68 • FOR e0 • AER e0</div>
        </div>
      </footer>

      {isModalOpen && (
        <div 
          className="modal is-open" 
          onClick={closeModal} 
          style={{ touchAction: "manipulation", zIndex: 2000 }}
        >
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", flexGrow: 1 }}>Demo interattiva</h3>
              <button 
                className="x" 
                onClick={closeModal}
                style={{ 
                  minWidth: "40px", 
                  minHeight: "40px", 
                  fontSize: "16px", 
                  flexShrink: 0,
                  marginLeft: "16px"
                }}
                aria-label="Chiudi"
              >
                ✕
              </button>
            </header>
            
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Device Panel */}
              <div className="device" style={{ margin: 0 }}>
                <div className="lcd">
                  <div className="lcd-text">{getLcdText()}</div>
                </div>
                
                <div className="panel">
                  <div className="seg-title">Focus Modes</div>
                  <div className="row" style={{ gap: "8px" }}>
                    {["FOCUS", "RELAX", "ADHD", "NO THOUGHTS"].map((mode, index) => (
                      <button
                        key={mode}
                        className={`pill pill--${mode.toLowerCase().replace(" ", "-")} ${selectedMode === mode ? "is-active" : ""}`}
                        onClick={() => setSelectedMode(mode)}
                        style={{ 
                          minHeight: "40px", 
                          touchAction: "manipulation",
                          fontSize: "12px",
                          padding: "6px 8px",
                          gridColumn: mode === "NO THOUGHTS" && window.innerWidth < 640 ? "1 / -1" : "auto"
                        }}
                      >
                        {mode === "NO THOUGHTS" ? "No Thoughts" : mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="panel">
                  <div className="seg-title">Neural Volume <span className="kpi">{neuralVolume}%</span></div>
                  <div 
                    className="slider" 
                    onClick={(e) => handleSliderClick(e, 'neural')}
                    style={{ touchAction: "manipulation", cursor: "pointer" }}
                  >
                    <div className="fill" style={{ width: `${neuralVolume}%` }}></div>
                    <div className="thumb" style={{ left: `${neuralVolume}%` }}></div>
                  </div>
                </div>
                
                <div className="panel">
                  <div className="seg-title">Ambient Volume <span className="kpi">{ambientVolume}%</span></div>
                  <div 
                    className="slider green" 
                    onClick={(e) => handleSliderClick(e, 'ambient')}
                    style={{ touchAction: "manipulation", cursor: "pointer" }}
                  >
                    <div className="fill" style={{ width: `${ambientVolume}%` }}></div>
                    <div className="thumb" style={{ left: `${ambientVolume}%` }}></div>
                  </div>
                </div>
                
                <div className="panel session">
                  <button 
                    className="btn-round" 
                    onClick={toggleSession}
                    style={{ 
                      minHeight: "40px", 
                      touchAction: "manipulation",
                      fontSize: "14px",
                      padding: "8px 12px"
                    }}
                  >
                    {isRunning ? "❚❚ Pause" : "▶ Start"}
                  </button>
                </div>
                
                <div className="panel">
                  <div className="seg-title">Ambient Sounds</div>
                  <div className="row" style={{ gap: "6px" }}>
                    {["Ocean", "Rain", "Forest", "Airport"].map((sound) => (
                      <button
                        key={sound}
                        className={`pill ${selectedSound === sound ? "is-active" : ""}`}
                        onClick={() => setSelectedSound(sound)}
                        style={{ 
                          minHeight: "40px", 
                          touchAction: "manipulation",
                          fontSize: "12px",
                          padding: "6px 8px"
                        }}
                      >
                        {sound}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Info Panel */}
              <div>
                <div className="card" style={{ marginBottom: "12px" }}>
                  <h3 style={{ marginTop: 0, fontSize: "15px", marginBottom: "8px" }}>Cosa fa la demo</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.4 }}>È una simulazione dell'interfaccia: puoi cambiare modalità e regolare i volumi per vedere il comportamento del display. Non riproduce audio.</p>
                </div>
                
                <div className="card" style={{ marginBottom: "12px" }}>
                  <h3 style={{ marginTop: 0, fontSize: "15px", marginBottom: "8px" }}>Suggerimento rapido</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.4 }}>Parti con Neural tra 20 e 35, Ambient tra 60 e 90. Se svolgi attività ripetitive puoi alzare Neural di poco.</p>
                </div>
                
                <div className="card" style={{ 
                  textAlign: "center", 
                  background: "linear-gradient(180deg, #1a202a, #131820)", 
                  border: "2px solid var(--accent)" 
                }}>
                  <h3 style={{ marginTop: 0, fontSize: "15px", color: "var(--accent)", marginBottom: "8px" }}>Prova l'app completa</h3>
                  <p style={{ fontSize: "13px", marginBottom: "12px", lineHeight: 1.4 }}>Audio neurali reali e suoni ambientali completi ti aspettano nell'applicazione.</p>
                  <a 
                    href="/app" 
                    className="btn btn-primary" 
                    style={{ 
                      width: "100%", 
                      minHeight: "44px",
                      fontSize: "14px",
                      touchAction: "manipulation",
                      textDecoration: "none",
                      color: "#05150d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    Apri l'App Completa →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;