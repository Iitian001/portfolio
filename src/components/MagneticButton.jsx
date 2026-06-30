import React, { useRef, useState } from 'react';

const MagneticButton = ({ children, className, onClick, style }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate distance from center of button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic pull strength (max pixels to move)
    const pullStrength = 15;
    
    const x = ((clientX - centerX) / (width / 2)) * pullStrength;
    const y = ((clientY - centerY) / (height / 2)) * pullStrength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-btn ${className}`}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
