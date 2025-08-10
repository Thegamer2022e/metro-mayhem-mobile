import React, { memo } from 'react';

interface PlayerProps {
  position: { x: number; y: number };
  inVehicle: boolean;
  health: number;
}

export const Player: React.FC<PlayerProps> = memo(({ position, inVehicle, health }) => {
  return (
    <div 
      className="absolute w-4 h-4 z-40 will-change-auto"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Player character */}
      <div className={`w-full h-full rounded-full border-2 transition-colors duration-200 ${
        inVehicle 
          ? 'bg-game-blue border-game-blue shadow-glow' 
          : 'bg-game-orange border-game-orange-glow shadow-glow'
      }`}>
        {/* Health indicator */}
        <div 
          className="absolute -bottom-1 left-0 h-0.5 bg-game-green rounded transition-all duration-300"
          style={{ width: `${health}%` }}
        />
      </div>
      
      {/* Direction indicator */}
      <div className="absolute -top-1 left-1/2 w-0.5 h-2 bg-foreground rounded transform -translate-x-1/2" />
    </div>
  );
});