import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Zap, Users, Target, Map } from 'lucide-react';

interface MobileControlsProps {
  onJoystickMove: (direction: { x: number; y: number }) => void;
  onJoystickStop: () => void;
  onAction: (action: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onJoystickMove,
  onJoystickStop,
  onAction
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !joystickRef.current) return;
    
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2 - 10;
    
    let x = deltaX;
    let y = deltaY;
    
    if (distance > maxDistance) {
      x = (deltaX / distance) * maxDistance;
      y = (deltaY / distance) * maxDistance;
    }
    
    setKnobPosition({ x, y });
    
    // Normalize direction for game logic
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance;
    
    onJoystickMove({ x: normalizedX, y: normalizedY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onJoystickStop();
  };

  return (
    <>
      {/* Virtual Joystick */}
      <div className="absolute bottom-4 left-4 z-50">
        <div 
          ref={joystickRef}
          className="relative w-20 h-20 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={knobRef}
            className="absolute w-8 h-8 bg-accent rounded-full shadow-glow transition-transform duration-100"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${knobPosition.x}px, ${knobPosition.y}px)`
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">Move</p>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 z-50">
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="w-14 h-14 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full flex items-center justify-center hover:bg-accent/20 active:bg-accent/40 transition-all duration-200"
            onTouchStart={() => onAction('jump')}
          >
            <Zap className="w-6 h-6 text-game-orange" />
          </button>
          <button 
            className="w-14 h-14 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full flex items-center justify-center hover:bg-accent/20 active:bg-accent/40 transition-all duration-200"
            onTouchStart={() => onAction('sprint')}
          >
            <Users className="w-6 h-6 text-game-blue" />
          </button>
          <button 
            className="w-14 h-14 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full flex items-center justify-center hover:bg-accent/20 active:bg-accent/40 transition-all duration-200"
            onTouchStart={() => onAction('interact')}
          >
            <Target className="w-6 h-6 text-game-green" />
          </button>
          <button 
            className="w-14 h-14 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full flex items-center justify-center hover:bg-accent/20 active:bg-accent/40 transition-all duration-200"
            onTouchStart={() => onAction('map')}
          >
            <Map className="w-6 h-6 text-game-yellow" />
          </button>
        </div>
      </div>
    </>
  );
};