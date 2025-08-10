import React, { useEffect, useCallback } from 'react';

interface PCControlsProps {
  onMovement: (direction: { x: number; y: number }) => void;
  onAction: (action: string) => void;
  isActive: boolean;
}

export const PCControls: React.FC<PCControlsProps> = ({
  onMovement,
  onAction,
  isActive
}) => {
  const keysPressed = React.useRef<Set<string>>(new Set());
  const lastMovement = React.useRef({ x: 0, y: 0 });

  const getMovementFromKeys = useCallback(() => {
    let x = 0;
    let y = 0;

    if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) x -= 1;
    if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) x += 1;
    if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('KeyW')) y -= 1;
    if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('KeyS')) y += 1;

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      x *= 0.7071; // 1/√2
      y *= 0.7071;
    }

    return { x, y };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    keysPressed.current.add(e.code);
    
    // Handle action keys
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        onAction('jump');
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        onAction('sprint');
        break;
      case 'KeyE':
        onAction('interact');
        break;
      case 'KeyM':
        onAction('map');
        break;
      case 'KeyF':
        onAction('shoot');
        break;
    }

    // Update movement
    const movement = getMovementFromKeys();
    if (movement.x !== lastMovement.current.x || movement.y !== lastMovement.current.y) {
      lastMovement.current = movement;
      onMovement(movement);
    }
  }, [isActive, onAction, onMovement, getMovementFromKeys]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    keysPressed.current.delete(e.code);
    
    // Update movement
    const movement = getMovementFromKeys();
    if (movement.x !== lastMovement.current.x || movement.y !== lastMovement.current.y) {
      lastMovement.current = movement;
      onMovement(movement);
    }
  }, [isActive, onMovement, getMovementFromKeys]);

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      keysPressed.current.clear();
    };
  }, []);

  return null; // This component doesn't render anything
};