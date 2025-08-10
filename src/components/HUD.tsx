import React from 'react';
import { Star, Heart, DollarSign } from 'lucide-react';

interface HUDProps {
  health: number;
  money: number;
  wantedLevel: number;
  currentWeapon: string;
  weapons: string[];
}

export const HUD: React.FC<HUDProps> = ({
  health,
  money,
  wantedLevel,
  currentWeapon,
  weapons
}) => {
  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="flex justify-between items-start">
          {/* Health and Money */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-hud-bg backdrop-blur-sm rounded-lg px-3 py-2 border border-hud-border">
              <Heart className="w-5 h-5 text-game-red" />
              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-game-green transition-all duration-300"
                  style={{ width: `${health}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{health}</span>
            </div>
            <div className="flex items-center gap-2 bg-hud-bg backdrop-blur-sm rounded-lg px-3 py-2 border border-hud-border">
              <DollarSign className="w-5 h-5 text-game-green" />
              <span className="text-sm font-medium text-foreground">${money.toLocaleString()}</span>
            </div>
          </div>

          {/* Wanted Level */}
          <div className="flex items-center gap-1 bg-hud-bg backdrop-blur-sm rounded-lg px-3 py-2 border border-hud-border">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${
                  star <= wantedLevel 
                    ? 'text-game-yellow fill-game-yellow' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Weapon Hotbar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-hud-bg backdrop-blur-sm rounded-lg px-4 py-3 border border-hud-border">
          {weapons.map((weapon, index) => (
            <div 
              key={weapon}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                weapon === currentWeapon
                  ? 'bg-accent text-accent-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent/20'
              }`}
            >
              {weapon}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};