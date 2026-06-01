'use client';
import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);
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
          duration: 0.25,
          ease: 'power2.out',
        });
        if (auraRef.current) {
          gsap.to(auraRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
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
      {/* Aura / Spotlight */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isHovering ? '150px' : '250px',
            height: isHovering ? '150px' : '250px',
            borderRadius: '50%',
            background: isHovering 
              ? 'radial-gradient(circle, rgba(255, 61, 61, 0.15) 0%, rgba(255, 61, 61, 0) 70%)'
              : 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(255, 209, 102, 0) 70%)',
            filter: 'blur(20px)',
            transition: 'all 0.5s ease',
          }}
        />
      </div>

      {/* Ring Wrapper */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isHovering ? '60px' : '40px',
            height: isHovering ? '60px' : '40px',
            borderRadius: '50%',
            border: isHovering ? '2px solid var(--accent-purple)' : '2px dashed var(--accent-blue)',
            boxShadow: isHovering ? '0 0 20px rgba(255,61,61,0.5)' : 'none',
            animation: isHovering ? 'none' : 'spin 8s linear infinite',
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      {/* Dot Wrapper */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: isHovering ? '10px' : '8px',
            height: isHovering ? '10px' : '8px',
            borderRadius: '50%',
            background: isHovering ? 'var(--accent-purple)' : 'var(--accent-cyan)',
            boxShadow: isHovering ? '0 0 15px var(--accent-purple)' : '0 0 10px var(--accent-cyan)',
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </>
  );
}
