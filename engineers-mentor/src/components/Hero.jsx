'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import MagneticButton from './MagneticButton';

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

export default function Hero() {
  const heroRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    let gsapModule;
    const init = async () => {
      gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      const tl = gsap.timeline({ delay: 2.8 });

      tl.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from('.hero-title-line', {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.15,
        }, '-=0.4')
        .from('.hero-description', {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.4')
        .from('.hero-buttons', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.3')
        .from('.hero-scroll-indicator', {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, '-=0.2')
        .from('.hero-stats', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        }, '-=0.3');
    };

    init();
  }, []);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Particle Background */}
      <ParticleField />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom text-center px-4 pt-20">
        {/* Subtitle badge */}
        <div className="hero-subtitle inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(0, 212, 255, 0.08)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
          }}>
          <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: 'var(--accent-blue)' }} />
          <span className="text-xs sm:text-sm font-medium tracking-wider uppercase" style={{ color: 'var(--accent-blue)' }}>
            Your Engineering Project Partner
          </span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          <span className="hero-title-line block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Building </span>
            <span className="text-gradient">Final Year</span>
          </span>
          <span className="hero-title-line block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] tracking-tight mt-1">
            <span style={{ color: 'var(--text-primary)' }}>Projects That </span>
            <span className="text-gradient-purple">Stand Out</span>
          </span>
        </h1>

        {/* Description */}
        <p className="hero-description max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}>
          From AI to IoT, Web to Robotics — we deliver premium, fully documented
          engineering projects with expert guidance and end-to-end support.
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton
            className="btn-primary text-base px-8 py-4"
            onClick={() => scrollTo('#contact')}
          >
            Start Your Project
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </MagneticButton>
          <MagneticButton
            className="btn-outline text-base px-8 py-4"
            onClick={() => scrollTo('#domains')}
          >
            View Domains
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </MagneticButton>
        </div>

        {/* Quick stats */}
        <div className="hero-stats flex items-center justify-center gap-8 sm:gap-12 mt-16 flex-wrap">
          {[
            { value: '100+', label: 'Projects' },
            { value: '13+', label: 'Domains' },
            { value: '50+', label: 'Colleges' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Scroll
        </span>
        <div className="w-[1px] h-8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-full h-full animate-scroll-indicator"
            style={{ background: 'linear-gradient(180deg, var(--accent-blue), transparent)' }} />
        </div>
      </div>
    </section>
  );
}
