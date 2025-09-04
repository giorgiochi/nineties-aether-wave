import React from 'react';
import { cn } from '@/lib/utils';

export interface DeviceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  state?: 'default' | 'active' | 'disabled';
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const colorSchemes = {
  primary: {
    symbol: 'hsl(210, 95%, 75%)',      // Blu chiaro
    led: 'hsl(210, 95%, 58%)',         // Blu LED
    glow: 'hsl(210, 95%, 58%)'         // Glow blu
  },
  secondary: {
    symbol: 'hsl(215, 25%, 75%)',      // Grigio chiaro
    led: 'hsl(215, 18%, 58%)',         // Grigio LED
    glow: 'hsl(215, 18%, 58%)'         // Glow grigio
  },
  success: {
    symbol: 'hsl(140, 65%, 75%)',      // Verde chiaro
    led: 'hsl(140, 65%, 45%)',         // Verde LED
    glow: 'hsl(140, 65%, 45%)'         // Glow verde
  },
  warning: {
    symbol: 'hsl(45, 100%, 80%)',      // Giallo chiaro
    led: 'hsl(45, 100%, 60%)',         // Giallo LED
    glow: 'hsl(45, 100%, 60%)'         // Glow giallo
  },
  danger: {
    symbol: 'hsl(0, 85%, 75%)',        // Rosso chiaro
    led: 'hsl(0, 85%, 60%)',           // Rosso LED
    glow: 'hsl(0, 85%, 60%)'           // Glow rosso
  }
};

const sizeClasses = {
  sm: 'px-3 py-2 text-xs gap-2',
  md: 'px-4 py-3 text-sm gap-3',
  lg: 'px-6 py-4 text-base gap-4'
};

export const DeviceButton = React.forwardRef<HTMLButtonElement, DeviceButtonProps>(
  ({ className, variant = 'primary', state = 'default', icon, children, size = 'md', disabled, ...props }, ref) => {
    const isActive = state === 'active';
    const isDisabled = disabled || state === 'disabled';
    const colors = colorSchemes[variant];
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base button style - rettangolare con angoli arrotondati
          "relative inline-flex items-center justify-center font-bold uppercase tracking-wider",
          "transition-all duration-100 select-none rounded-lg",
          
          // Superficie scura grafite con effetto 3D
          "bg-gradient-to-br from-graphite-2 to-graphite-0",
          "border border-graphite-edge",
          
          // Ombre per realismo e profondità
          !isActive && !isDisabled && "shadow-device-button hover:shadow-device-button-hover",
          isActive && "shadow-device-button-active",
          
          // Stato normale
          !isActive && !isDisabled && "hover:transform hover:-translate-y-0.5 hover:brightness-105",
          
          // Stato attivo (premuto)
          isActive && "transform translate-y-0.5 brightness-90",
          
          // Stato disabilitato
          isDisabled && "opacity-40 cursor-not-allowed",
          
          // Sizing
          sizeClasses[size],
          
          className
        )}
        {...props}
      >
        {/* Overlay per effetto plastica */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
        
        {/* Contenuto del bottone centrato */}
        <div className="relative z-10 flex items-center justify-center gap-2 w-full">
          {/* Simbolo con colore coordinato */}
          {icon && (
            <span 
              className="shrink-0"
              style={{
                color: colors.symbol
              }}
            >
              {icon}
            </span>
          )}
          
          {/* LED circolare */}
          <div 
            className="relative w-2 h-2 rounded-full border border-black/30 shrink-0"
            style={{
              background: isActive && !isDisabled 
                ? `radial-gradient(circle at 30% 30%, ${colors.led}, ${colors.led}cc 60%, ${colors.led}88)`
                : 'radial-gradient(circle at 30% 30%, hsl(215 20% 25%), hsl(215 25% 15%) 60%, hsl(215 30% 8%))',
              boxShadow: isActive && !isDisabled 
                ? `0 0 3px ${colors.glow}88, 0 0 6px ${colors.glow}44, inset 0 0.5px 1px rgba(255,255,255,0.2)`
                : 'inset 0 0.5px 1px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.05)'
            }}
          >
            {/* Riflesso sul LED */}
            <div className="absolute top-0 left-0 w-1 h-1 rounded-full bg-white/30" />
          </div>
          
          {/* Testo adattato */}
          <span 
            className="flex-1 text-center leading-tight"
            style={{
              color: colors.symbol,
              fontSize: size === 'sm' ? '0.65rem' : size === 'lg' ? '0.9rem' : '0.75rem',
              wordWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {children}
          </span>
        </div>
        
        {/* Riflesso interno per effetto 3D */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      </button>
    );
  }
);

DeviceButton.displayName = 'DeviceButton';