import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HUD } from './HUD';
import { GameMap } from './GameMap';
import { MobileControls } from './MobileControls';
import { PCControls } from './PCControls';
import { Player } from './Player';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  
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

  const [movementActive, setMovementActive] = useState(false);
  const [movementDirection, setMovementDirection] = useState({ x: 0, y: 0 });

  // Optimized player movement with memoization
  const movePlayer = useCallback((direction: { x: number; y: number }) => {
    if (direction.x === 0 && direction.y === 0) return;
    
    setGameState(prev => {
      const speed = isMobile ? 0.5 : 0.8; // Faster movement on PC
      const newX = Math.max(0, Math.min(100, prev.playerPosition.x + direction.x * speed));
      const newY = Math.max(0, Math.min(100, prev.playerPosition.y + direction.y * speed));
      
      // Only update if position actually changed
      if (newX === prev.playerPosition.x && newY === prev.playerPosition.y) {
        return prev;
      }
      
      return {
        ...prev,
        playerPosition: { x: newX, y: newY }
      };
    });
  }, [isMobile]);

  // Optimized game loop with requestAnimationFrame
  useEffect(() => {
    if (!movementActive) return;

    let animationId: number;
    const gameLoop = () => {
      if (movementDirection.x !== 0 || movementDirection.y !== 0) {
        movePlayer(movementDirection);
      }
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [movementActive, movementDirection, movePlayer]);

  // Handle actions with memoization
  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'jump':
        console.log('Player jumps!');
        break;
      case 'sprint':
        console.log('Player sprints!');
        break;
      case 'interact':
        console.log('Player interacts!');
        break;
      case 'shoot':
        console.log('Player shoots!');
        break;
      case 'map':
        setGameState(prev => ({ ...prev, mapOpen: !prev.mapOpen }));
        break;
    }
  }, []);

  const closeMap = useCallback(() => {
    setGameState(prev => ({ ...prev, mapOpen: false }));
  }, []);

  // Handle movement input from both mobile and PC
  const handleMovementStart = useCallback((direction: { x: number; y: number }) => {
    setMovementDirection(direction);
    setMovementActive(true);
  }, []);

  const handleMovementStop = useCallback(() => {
    setMovementActive(false);
    setMovementDirection({ x: 0, y: 0 });
  }, []);

  const handleMovementUpdate = useCallback((direction: { x: number; y: number }) => {
    setMovementDirection(direction);
  }, []);

  // Memoize background transform to prevent unnecessary recalculations
  const backgroundTransform = useMemo(() => 
    `translate(${-gameState.playerPosition.x * 10}px, ${-gameState.playerPosition.y * 10}px)`,
    [gameState.playerPosition.x, gameState.playerPosition.y]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background select-none">
      {/* Game World */}
      <div 
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: `url(${cityMapImage})`,
          transform: backgroundTransform
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

      {/* PC Controls (invisible) */}
      <PCControls
        onMovement={handleMovementUpdate}
        onAction={handleAction}
        isActive={!gameState.mapOpen}
      />

      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls
          onJoystickMove={handleMovementStart}
          onJoystickStop={handleMovementStop}
          onAction={handleAction}
        />
      )}

      {/* PC Instructions */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 bg-hud-bg backdrop-blur-sm border border-hud-border rounded-lg px-4 py-2 z-40">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>WASD/Arrow Keys: Move</div>
            <div>Space: Jump | Shift: Sprint | E: Interact</div>
            <div>M: Map | F: Shoot</div>
          </div>
        </div>
      )}

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