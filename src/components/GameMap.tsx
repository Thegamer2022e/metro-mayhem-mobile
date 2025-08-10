import React from 'react';
import { X, MapPin, Car, Building, Wrench } from 'lucide-react';
import cityMapImage from '@/assets/city-map.jpg';

interface GameMapProps {
  playerPosition: { x: number; y: number };
  onClose: () => void;
}

export const GameMap: React.FC<GameMapProps> = ({ playerPosition, onClose }) => {
  const locations = [
    { type: 'gunstore', x: 25, y: 30, name: 'Ammu-Nation' },
    { type: 'garage', x: 40, y: 60, name: 'Premium Garage' },
    { type: 'dealership', x: 70, y: 20, name: 'Luxury Motors' },
    { type: 'mechanic', x: 80, y: 80, name: 'LS Customs' },
    { type: 'apartment', x: 15, y: 70, name: 'High-End Apartment' },
    { type: 'garage', x: 60, y: 40, name: '6-Car Garage' },
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'gunstore': return <Target className="w-4 h-4 text-game-red" />;
      case 'garage': return <Building className="w-4 h-4 text-game-blue" />;
      case 'dealership': return <Car className="w-4 h-4 text-game-orange" />;
      case 'mechanic': return <Wrench className="w-4 h-4 text-game-green" />;
      case 'apartment': return <Building className="w-4 h-4 text-game-yellow" />;
      default: return <MapPin className="w-4 h-4 text-foreground" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm">
      <div className="relative w-full h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-primary border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">City Map</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="absolute inset-0 pt-16 p-4">
          <div 
            className="relative w-full h-full bg-cover bg-center rounded-lg border border-border overflow-hidden"
            style={{ backgroundImage: `url(${cityMapImage})` }}
          >
            {/* Player Position */}
            <div 
              className="absolute w-6 h-6 z-20"
              style={{
                left: `${playerPosition.x}%`,
                top: `${playerPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-full h-full bg-accent rounded-full border-2 border-accent-foreground animate-pulse shadow-glow">
                <div className="absolute inset-1 bg-accent-foreground rounded-full" />
              </div>
            </div>

            {/* Location Markers */}
            {locations.map((location, index) => (
              <div 
                key={index}
                className="absolute z-10 group cursor-pointer"
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-8 h-8 bg-hud-bg backdrop-blur-sm border-2 border-hud-border rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  {getLocationIcon(location.type)}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-card border border-border rounded-lg px-2 py-1 text-xs text-card-foreground whitespace-nowrap">
                    {location.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-game-red" />
              <span className="text-muted-foreground">Gun Store</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-3 h-3 text-game-orange" />
              <span className="text-muted-foreground">Dealership</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3 h-3 text-game-blue" />
              <span className="text-muted-foreground">Garage</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-3 h-3 text-game-green" />
              <span className="text-muted-foreground">Mechanic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing import fix
import { Target } from 'lucide-react';