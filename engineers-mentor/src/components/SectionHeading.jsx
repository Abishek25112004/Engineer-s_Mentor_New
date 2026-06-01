'use client';
import { useRef, useEffect } from 'react';

export default function SectionHeading({ title, subtitle, align = 'center', className = '' }) {
  const headingRef = useRef(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    let ctx;
    let isCancelled = false;
    let gsapModule;
    const initAnimation = async () => {
      gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        tl.from(el.querySelector('.section-subtitle'), {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        })
          .from(
            el.querySelector('.section-title'),
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.3'
          )
          .from(
            el.querySelector('.section-line'),
            {
              scaleX: 0,
              duration: 0.8,
              ease: 'power3.out',
            },
            '-=0.4'
          );
      }, el);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div
      ref={headingRef}
      className={`mb-8 md:mb-4 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {subtitle && (
        <p className="section-subtitle text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4"
          style={{ color: 'var(--accent-blue)' }}>
          {subtitle}
        </p>
      )}
      <h2
        className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      <div
        className="section-line mx-auto mt-1 h-[2px] w-20 origin-left"
        style={{
          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
          marginLeft: align === 'center' ? 'auto' : '0',
        }}
      />
    </div>
  );
}
