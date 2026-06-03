'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { domains } from '@/data/domains';

function DomainCard({ domain, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      x: ((y - centerY) / centerY) * -10,
      y: ((x - centerX) / centerX) * 10,
    });
    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, null, '#contact');
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="domain-card group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        perspective: '1000px',
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={scrollToContact}
      whileHover={{ y: -5 }}
    >
      {/* Mouse-follow glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${domain.color}20, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Glowing border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${domain.color}40, 0 0 30px ${domain.color}15`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      <div className="relative z-10 px-8 py-6 md:px-10 md:py-8">
        {/* Icon */}
        <div className="text-4xl md:text-5xl mb-5 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
          {domain.icon}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold mb-3 transition-colors duration-300"
          style={{ color: isHovered ? domain.color : 'var(--text-primary)' }}
        >
          {domain.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {domain.description}
        </p>

        {/* Arrow */}
        <div
          className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
          style={{
            color: domain.color,
            transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
            opacity: isHovered ? 1 : 0.6,
          }}
        >
          Explore
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Domains() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx;
    let isCancelled = false;
    const init = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      if (isCancelled) return;
      ctx = gsap.context(() => {
        gsap.from('.domain-card', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }, sectionRef);
    };

    init();

    return () => {
      isCancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section id="domains" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Our Expertise"
          title={<>Projects Across <span className="text-gradient">Every Domain</span></>}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {domains.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
