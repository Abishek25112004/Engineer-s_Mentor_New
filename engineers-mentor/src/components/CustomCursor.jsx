'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let gsapModule;
    const init = async () => {
      gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const moveCursor = (e) => {
        setIsVisible(true);
        gsap.to(dotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
        });
        gsap.to(ringRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => setIsHovering(false);

      window.addEventListener('mousemove', moveCursor);

      // Add hover listeners to all interactive elements
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-hover'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      // MutationObserver to catch dynamically added elements
      const observer = new MutationObserver(() => {
        const newElements = document.querySelectorAll(
          'a, button, input, textarea, select, [role="button"], .cursor-hover'
        );
        newElements.forEach((el) => {
          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        observer.disconnect();
        interactiveElements.forEach((el) => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    init();
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          borderRadius: '50%',
          background: 'var(--accent-blue)',
          boxShadow: '0 0 10px var(--accent-blue)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? '50px' : '36px',
          height: isHovering ? '50px' : '36px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'var(--accent-purple)' : 'rgba(255, 107, 0, 0.4)'}`,
          boxShadow: isHovering ? '0 0 20px rgba(255, 61, 61, 0.3), inset 0 0 10px rgba(255, 61, 61, 0.2)' : '0 0 10px rgba(255, 107, 0, 0.15)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease',
        }}
      />
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
