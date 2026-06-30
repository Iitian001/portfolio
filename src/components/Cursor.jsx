import React, { useEffect, useState, useRef } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  
  // For the trailing dot
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const trailingMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const animate = () => {
      // Lerp for smooth trailing effect
      trailingMouse.current.x += (mouse.current.x - trailingMouse.current.x) * 0.15;
      trailingMouse.current.y += (mouse.current.y - trailingMouse.current.y) * 0.15;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailingMouse.current.x}px, ${trailingMouse.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(animate);

    // Hover logic
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('glass-card')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef}
        className={`custom-cursor-dot ${hovered ? 'hovered' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
      <div 
        ref={trailRef}
        className={`custom-cursor-trail ${hovered ? 'hovered' : ''}`}
      />
    </>
  );
};

export default Cursor;
