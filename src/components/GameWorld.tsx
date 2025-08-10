import React, { useState, useEffect, useCallback } from 'react';
import { HUD } from './HUD';
import { GameMap } from './GameMap';
import { MobileControls } from './MobileControls';
import { Player } from './Player';
import cityMapImage from '@/assets/city-map.jpg';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  health: number;
  money: number;
  wantedLevel: number;
  currentWeapon: string;
  weapons: string[];
  playerPosition: Position;
  inVehicle: boolean;
  mapOpen: boolean;
}

export const GameWorld: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    money: 1500,
    wantedLevel: 0,
    currentWeapon: 'Pistol',
    weapons: ['Pistol', 'SMG'],
    playerPosition: { x: 50, y: 50 },
    inVehicle: false,
    mapOpen: false,
  });

  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0 });

  // Handle player movement
  const movePlayer = useCallback((direction: { x: number; y: number }) => {
    setGameState(prev => ({
      ...prev,
      playerPosition: {
        x: Math.max(0, Math.min(100, prev.playerPosition.x + direction.x * 0.5)),
        y: Math.max(0, Math.min(100, prev.playerPosition.y + direction.y * 0.5))
      }
    }));
  }, []);

  // Game loop for continuous movement
  useEffect(() => {
    if (!joystickActive) return;

    const gameLoop = setInterval(() => {
      if (joystickDirection.x !== 0 || joystickDirection.y !== 0) {
        movePlayer(joystickDirection);
      }
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [joystickActive, joystickDirection, movePlayer]);

  // Handle actions
  const handleAction = (action: string) => {
    switch (action) {
      case 'jump':
        // Add jump animation logic
        console.log('Player jumps!');
        break;
      case 'sprint':
        // Add sprint logic
        console.log('Player sprints!');
        break;
      case 'interact':
        // Add interaction logic
        console.log('Player interacts!');
        break;
      case 'shoot':
        // Add shooting logic
        console.log('Player shoots!');
        break;
      case 'map':
        setGameState(prev => ({ ...prev, mapOpen: !prev.mapOpen }));
        break;
    }
  };

  const closeMap = () => {
    setGameState(prev => ({ ...prev, mapOpen: false }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Game World */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${cityMapImage})`,
          transform: `translate(${-gameState.playerPosition.x * 10}px, ${-gameState.playerPosition.y * 10}px)`
        }}
      >
        {/* Player */}
        <Player 
          position={gameState.playerPosition}
          inVehicle={gameState.inVehicle}
          health={gameState.health}
        />
      </div>

      {/* HUD */}
      <HUD 
        health={gameState.health}
        money={gameState.money}
        wantedLevel={gameState.wantedLevel}
        currentWeapon={gameState.currentWeapon}
        weapons={gameState.weapons}
      />

      {/* Mobile Controls */}
      <MobileControls
        onJoystickMove={(direction) => {
          setJoystickDirection(direction);
          setJoystickActive(true);
        }}
        onJoystickStop={() => {
          setJoystickActive(false);
          setJoystickDirection({ x: 0, y: 0 });
        }}
        onAction={handleAction}
      />

      {/* Game Map Overlay */}
      {gameState.mapOpen && (
        <GameMap 
          playerPosition={gameState.playerPosition}
          onClose={closeMap}
        />
      )}
    </div>
  );
};