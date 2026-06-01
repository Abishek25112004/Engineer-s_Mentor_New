'use client';
import { useRef, useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered', icon: '🚀', color: '#00d4ff' },
  { value: 48, suffix: 'h', label: 'Fast Delivery', icon: '⚡', color: '#8b5cf6' },
  { value: 100, suffix: '%', label: 'Full Documentation', icon: '📄', color: '#06b6d4' },
  { value: 100, suffix: '%', label: 'Source Code Included', icon: '💻', color: '#ec4899' },
  { value: 24, suffix: '/7', label: 'Client Support', icon: '🤝', color: '#10b981' },
  { value: 50, suffix: '%', label: 'Affordable Pricing', icon: '💰', color: '#f59e0b' },
];

function CounterCard({ stat, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * stat.value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, stat.value]);

  return (
    <div className="group glass glass-hover glow-border px-2 py-6 rounded-2xl text-center transition-all duration-500 hover:translate-y-[-4px]">
      {/* Icon */}
      <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-125">
        {stat.icon}
      </div>

      {/* Counter */}
      <div className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: stat.color, fontFamily: 'var(--font-heading)' }}>
        {count}{stat.suffix}
      </div>

      {/* Label */}
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        {stat.label}
      </p>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `0 0 40px ${stat.color}15` }}
      />
    </div>
  );
}

export default function WhyChooseMe() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
        gsap.from('.stat-card', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 50,
          scale: 0.9,
          duration: 0.7,
          stagger: 0.1,
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
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg-dense opacity-20" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Why Choose Us"
          title={<>What Makes Us <span className="text-gradient">Different</span></>}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card relative">
              <CounterCard stat={stat} isVisible={isVisible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
