import React from 'react';
import { cn } from '@/lib/utils';

export interface DeviceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  state?: 'default' | 'active' | 'disabled';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const indicatorColors = {
  primary: 'hsl(210, 95%, 58%)',    // Blu
  secondary: 'hsl(215, 18%, 58%)',  // Grigio
  success: 'hsl(140, 65%, 45%)',    // Verde
  warning: 'hsl(45, 100%, 60%)',    // Giallo
  danger: 'hsl(0, 85%, 60%)'        // Rosso
};

export const DeviceButton = React.forwardRef<HTMLButtonElement, DeviceButtonProps>(
  ({ className, variant = 'primary', state = 'default', icon, children, disabled, ...props }, ref) => {
    const isActive = state === 'active';
    const isDisabled = disabled || state === 'disabled';
    const indicatorColor = indicatorColors[variant];
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base button style - rettangolare con angoli arrotondati
          "relative inline-flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider",
          "transition-all duration-100 select-none",
          
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
          
          // Testo grigio chiaro
          "text-device-text",
          
          className
        )}
        {...props}
      >
        {/* Overlay per effetto plastica */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
        
        {/* Indicatore circolare colorato a sinistra */}
        <div 
          className={cn(
            "relative w-3 h-3 rounded-full border border-graphite-edge",
            "shadow-inner"
          )}
          style={{
            background: isActive && !isDisabled 
              ? `radial-gradient(circle at 30% 30%, ${indicatorColor}, ${indicatorColor}cc 60%, ${indicatorColor}66)`
              : 'radial-gradient(circle at 30% 30%, hsl(215 20% 25%), hsl(215 25% 15%) 60%, hsl(215 30% 8%))',
            boxShadow: isActive && !isDisabled 
              ? `0 0 4px ${indicatorColor}88, 0 0 8px ${indicatorColor}44, inset 0 1px 2px rgba(0,0,0,0.3)`
              : 'inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)'
          }}
        >
          {/* Riflesso sull'indicatore */}
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        </div>
        
        {/* Contenuto del bottone (icona + testo) */}
        <div className="relative z-10 flex items-center gap-2">
          {icon && (
            <span className="text-device-text opacity-90">
              {icon}
            </span>
          )}
          <span className="relative">{children}</span>
        </div>
        
        {/* Riflesso interno per effetto 3D */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      </button>
    );
  }
);

DeviceButton.displayName = 'DeviceButton';