import { useNavigate } from "react-router-dom";
import { NeuroDeckDisplay } from "@/components/NeuroDeckDisplay";
import { useAudioManager } from "@/hooks/useAudioManager";

const Landing = () => {
  const navigate = useNavigate();
  const neuroDeck = useAudioManager();

  const handleStartSession = () => {
    navigate('/app');
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center device-texture"
      style={{ 
        background: `
          radial-gradient(ellipse at center, hsl(var(--graphite-2)), hsl(var(--graphite-0))),
          var(--gradient-panel)
        `,
        padding: '20px'
      }}
    >
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-8 mb-12">
        
        {/* Logo 3D */}
        <div className="mb-8">
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-wider"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              color: 'hsl(var(--lcd-green-soft))',
              textShadow: `
                0 0 10px hsl(var(--lcd-green-soft) / 0.8),
                0 0 20px hsl(var(--lcd-green-soft) / 0.6),
                0 0 30px hsl(var(--lcd-green-soft) / 0.4),
                2px 2px 0px hsl(var(--device-accent-violet)),
                4px 4px 0px hsl(var(--graphite-3))
              `,
              letterSpacing: '0.1em',
              lineHeight: '1.2'
            }}
          >
            AUDIO<br/>PSYCO
          </h1>
        </div>

        {/* Headlines */}
        <div className="space-y-6">
          <h2 
            className="text-2xl md:text-4xl font-bold"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              color: 'hsl(var(--lcd-green-soft))',
              textShadow: '0 0 8px hsl(var(--lcd-green-soft) / 0.6)',
              letterSpacing: '0.05em'
            }}
          >
            Focus Your Mind. Clear Your Thoughts.
          </h2>
          
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              color: 'hsl(var(--lcd-green-dim))',
              textShadow: '0 0 4px hsl(var(--lcd-green-dim) / 0.4)',
              lineHeight: '1.6',
              fontSize: 'clamp(0.8rem, 2vw, 1.2rem)'
            }}
          >
            L'app che unisce audio neurali e suoni ambientali per migliorare concentrazione e relax.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-12">
          <button
            onClick={handleStartSession}
            className="px-8 py-4 text-xl md:text-2xl font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              background: `
                linear-gradient(145deg, 
                  hsl(var(--lcd-green-soft)), 
                  hsl(var(--lcd-green-dim))
                )
              `,
              color: 'hsl(var(--graphite-0))',
              boxShadow: `
                0 0 20px hsl(var(--lcd-green-soft) / 0.6),
                0 4px 15px rgba(0,0,0,0.3),
                inset 0 1px 0 rgba(255,255,255,0.2)
              `,
              border: '2px solid hsl(var(--lcd-green-soft))',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              animation: 'lcd-pulse 2s ease-in-out infinite'
            }}
          >
            Try Audio Psyco Now
          </button>
        </div>
      </div>

      {/* Interface Preview Mockup */}
      <div className="w-full max-w-lg mx-auto mb-12">
        <div className="mb-6">
          <p 
            className="text-center text-sm md:text-base"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              color: 'hsl(var(--lcd-green-dim))',
              textShadow: '0 0 4px hsl(var(--lcd-green-dim) / 0.4)',
              lineHeight: '1.6'
            }}
          >
            Un design minimal, ispirato alle console retro, per riportarti al focus con semplicità.
          </p>
        </div>
        
        {/* Mockup Display */}
        <div className="transform scale-90 md:scale-100">
          <NeuroDeckDisplay neuroDeck={neuroDeck} />
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-3xl mx-auto mb-12">
        <div className="grid gap-8 md:gap-12">
          {[
            "Modalità neurali per stimolare concentrazione o rilassamento.",
            "Rumori ambientali per personalizzare l'esperienza.",
            "Design retro-futuristico che trasforma l'audio in un rituale visivo."
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div 
                className="inline-block w-8 h-8 rounded-full mr-4 mb-2"
                style={{
                  background: `
                    radial-gradient(circle, 
                      hsl(var(--lcd-green-soft)), 
                      hsl(var(--lcd-green-dim))
                    )
                  `,
                  boxShadow: '0 0 10px hsl(var(--lcd-green-soft) / 0.5)'
                }}
              />
              <p 
                className="text-sm md:text-base inline-block max-w-md"
                style={{
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  color: 'hsl(var(--lcd-green-dim))',
                  textShadow: '0 0 4px hsl(var(--lcd-green-dim) / 0.4)',
                  lineHeight: '1.6'
                }}
              >
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <button
          onClick={handleStartSession}
          className="px-6 py-3 text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            background: `
              linear-gradient(145deg, 
                hsl(var(--lcd-green-soft)), 
                hsl(var(--lcd-green-dim))
              )
            `,
            color: 'hsl(var(--graphite-0))',
            boxShadow: `
              0 0 20px hsl(var(--lcd-green-soft) / 0.6),
              0 4px 15px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
            border: '2px solid hsl(var(--lcd-green-soft))',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            animation: 'lcd-pulse 2s ease-in-out infinite'
          }}
        >
          Start Your Session
        </button>
      </div>

      {/* Terminal cursor animation */}
      <div 
        className="fixed bottom-4 right-4 text-2xl animate-pulse"
        style={{
          fontFamily: '"Press Start 2P", "Courier New", monospace',
          color: 'hsl(var(--lcd-green-soft))',
          textShadow: '0 0 8px hsl(var(--lcd-green-soft) / 0.8)'
        }}
      >
        _
      </div>
    </div>
  );
};

export default Landing;