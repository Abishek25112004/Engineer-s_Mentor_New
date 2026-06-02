'use client';
import { useEffect, useRef, useState } from 'react';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let gsapModule;
    const init = async () => {
      gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      // Counter animation
      const counter = { value: 0 };
      gsap.to(counter, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          setCount(Math.round(counter.value));
        },
        onComplete: () => {
          // Exit animation
          const tl = gsap.timeline({
            onComplete: () => {
              if (onComplete) onComplete();
            },
          });

          tl.to(preloaderRef.current?.querySelector('.preloader-content'), {
            scale: 0.9,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in',
          })
            .to(preloaderRef.current?.querySelector('.preloader-top'), {
              yPercent: -100,
              duration: 0.8,
              ease: 'power4.inOut',
            })
            .to(
              preloaderRef.current?.querySelector('.preloader-bottom'),
              {
                yPercent: 100,
                duration: 0.8,
                ease: 'power4.inOut',
              },
              '<'
            )
            .set(preloaderRef.current, { display: 'none' });
        },
      });
    };

    init();
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader">
      <div className="preloader-top absolute inset-x-0 top-0 h-1/2" style={{ background: 'var(--bg-primary)' }} />
      <div className="preloader-bottom absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'var(--bg-primary)' }} />

      <div className="preloader-content relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <img src="/Header Footer Logo.png" alt="Engineer's Mentor Logo" className="h-12 md:h-16 w-auto relative z-10" />
          <div className="absolute -inset-4 rounded-full opacity-30 blur-2xl"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }} />
        </div>

        {/* Counter */}
        <div ref={counterRef} className="preloader-counter text-gradient">
          {count}
        </div>

        {/* Progress bar */}
        <div className="w-48 h-[2px] overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${count}%`,
              background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
            }}
          />
        </div>

        <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Loading Experience
        </p>
      </div>
    </div>
  );
}
