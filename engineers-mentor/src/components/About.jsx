'use client';
import { useRef, useEffect } from 'react';
import SectionHeading from './SectionHeading';

const features = [
  {
    icon: '🎯',
    title: 'Expert Guidance',
    description: 'Personalized mentorship from experienced engineers who understand academic requirements.',
  },
  {
    icon: '📄',
    title: 'Full Documentation',
    description: 'Comprehensive reports, PPTs, research papers, and technical documentation included.',
  },
  {
    icon: '💻',
    title: 'Complete Implementation',
    description: 'Production-quality code with clean architecture, testing, and deployment support.',
  },
  {
    icon: '🔧',
    title: 'Technical Support',
    description: 'End-to-end support from concept to viva — we\'re with you throughout the journey.',
  },
  {
    icon: '💡',
    title: 'Innovation Focused',
    description: 'Unique project ideas that go beyond templates — projects your evaluators will remember.',
  },
  {
    icon: '🎓',
    title: 'All Domains Covered',
    description: '13+ engineering domains including AI, IoT, Web, Mobile, Cybersecurity, and more.',
  },
];

export default function About() {
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
        gsap.from('.about-card', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        });

        gsap.from('.about-highlight', {
          scrollTrigger: {
            trigger: '.about-highlight',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
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
    <section id="about" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Who We Are"
          title={<>We Build Projects That <span className="text-gradient">Get Results</span></>}
        />

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="about-card group glass glass-hover glow-border p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-4px]"
            >
              <div className="text-4xl mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight banner */}
        <div className="about-highlight mt-16 p-8 md:p-12 rounded-2xl text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(139,92,246,0.05))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
          <div className="absolute inset-0 grid-bg-dense opacity-30" />
          <div className="relative z-10">
            <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We&apos;ve helped <span className="text-gradient font-bold">500+ students</span> across{' '}
              <span className="text-gradient font-bold">50+ colleges</span> deliver outstanding final year projects
              in <span className="text-gradient font-bold">13+ engineering domains</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
