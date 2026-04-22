import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  // useMotionValue avoids React state re-renders for max performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the trailing ring effect
  const springConfig = { damping: 20, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      // Check if hovering over an interactive element
      if (
        e.target.tagName.toLowerCase() === 'button' || 
        e.target.tagName.toLowerCase() === 'a' || 
        e.target.closest('button') || 
        e.target.closest('a') || 
        e.target.classList.contains('menu-card')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer Glow Ring with Spring Physics */}
      <motion.div
        className="cursor-ring"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.4)' : 'rgba(212, 175, 55, 0)',
          borderColor: isHovering ? 'transparent' : '#d4af37'
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Inner Dot with Instant Follow */}
      <motion.div
        className="cursor-dot-inner"
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        animate={{
          scale: isHovering ? 0 : 1
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
