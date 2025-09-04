import React from 'react';
import { DeviceButton } from '@/components/ui/device-button';
import { Play, Volume2 } from 'lucide-react';

interface AudioUnlockPromptProps {
  onUnlock: () => Promise<boolean>;
  onClose: () => void;
  isVisible: boolean;
}

export const AudioUnlockPrompt: React.FC<AudioUnlockPromptProps> = ({ 
  onUnlock, 
  onClose, 
  isVisible 
}) => {
  const handleUnlock = async () => {
    console.log('[AudioUnlockPrompt] User requested unlock');
    const success = await onUnlock();
    if (success) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-graphite-1 border-2 border-graphite-edge rounded-2xl p-6 max-w-sm w-full device-texture"
        style={{ 
          background: 'var(--gradient-panel)',
          boxShadow: 'var(--shadow-device)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Volume2 size={48} className="text-device-accent" />
          </div>
          
          <h3 className="label-serigraph text-lg text-device-text">
            AUDIO BLOCCATO
          </h3>
          
          <p 
            className="text-sm text-device-muted"
            style={{ lineHeight: '1.4' }}
          >
            Per motivi di sicurezza mobile, tocca per sbloccare l'audio una volta sola.
          </p>
          
          <div className="flex gap-3 justify-center">
            <DeviceButton
              variant="success"
              size="md"
              onClick={handleUnlock}
              icon={<Play size={16} />}
              className="flex-1"
            >
              SBLOCCA AUDIO
            </DeviceButton>
            
            <DeviceButton
              variant="secondary"
              size="md"
              onClick={onClose}
              className="px-4"
            >
              ANNULLA
            </DeviceButton>
          </div>
          
          <p 
            className="text-xs text-device-muted mt-2"
            style={{ opacity: 0.7 }}
          >
            Non verrà più richiesto dopo il primo tocco
          </p>
        </div>
      </div>
    </div>
  );
};