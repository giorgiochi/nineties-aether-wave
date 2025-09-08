import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    .wrap{max-width:1120px;margin:0 auto;padding:32px 10px}

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

    .device{justify-self:center;width:min(420px,98%);background:linear-gradient(180deg,#161b23,#0f131a);border:1px solid #212733;border-radius:26px;padding:18px;box-shadow:var(--shadow-big);position:relative}
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
      .hero{grid-template-columns:1fr;min-height:auto;text-align:center;gap:32px}
      .device{order:-1;margin:24px auto 0;width:min(380px,95%)}
      .h1{font-size:36px;line-height:1.1;margin:20px 0 12px}
      .lead{font-size:18px;max-width:none;line-height:1.6;margin-bottom:16px}
      .grid.cols-3{grid-template-columns:1fr;gap:24px}
      .wrap{padding:24px 16px}
      .section{padding:80px 0}
      .section h2{font-size:32px;margin-bottom:16px}
      .section p.lead{font-size:18px;margin-bottom:32px}
      .cta{justify-content:center;gap:16px;margin-top:32px}
      .btn{padding:18px 28px;font-size:17px;font-weight:700}
      
      /* Show hamburger, hide regular menu */
      .hamburger{display:flex}
      .desktop-nav{display:none !important}
      
      /* Touch-friendly sliders */
      .slider{height:16px;margin:12px 0}
      .slider .thumb{width:24px;height:24px}
      
      /* Better card spacing on mobile */
      .card{padding:20px;margin-bottom:20px}
      .card h3{font-size:20px;margin-bottom:12px;font-weight:700}
      .card p{font-size:16px;line-height:1.5}
      
      /* Better badge styling */
      .badge{padding:12px 16px;font-size:14px}
      
      /* Better kpi text */
      .kpi{font-size:14px;line-height:1.4}
    }
    
    @media (max-width:640px){
      .h1{font-size:26px}
      .section h2{font-size:24px}
      .device{width:min(280px,96%)}
      .wrap{padding:12px 10px}
      .hero{padding:16px 0}
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

  const goToApp = () => {
    navigate('/app');
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
            <button className="btn btn-primary" onClick={goToApp}>Provala ora</button>
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
              goToApp();
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
              <button className="btn btn-primary" onClick={goToApp}>Avvia demo interattiva</button>
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
            <button className="btn btn-primary" onClick={goToApp}>Provala adesso</button>
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
            <button className="btn btn-primary" onClick={goToApp}>Avvia demo interattiva</button>
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
    </div>
  );
};

export default Landing;