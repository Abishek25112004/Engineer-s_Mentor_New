'use client';
import { useRef, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import { processSteps } from '@/data/process';

export default function ProcessTimeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      // Line draw animation
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleY: 0,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            end: 'bottom 70%',
            scrub: 1,
          },
        });
      }

      // Steps reveal
      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -50 : 50),
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    };

    init();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="How We Work"
          title={<>Our Proven <span className="text-gradient">Process</span></>}
        />

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(180deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan))',
            }}
          />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {processSteps.map((step, i) => (
              <div
                key={step.id}
                className={`process-step relative flex items-start gap-8 md:gap-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-12 md:pl-0`}>
                  <div className="glass glass-hover p-6 md:p-8 rounded-2xl transition-all duration-500 hover:translate-y-[-4px] group">
                    <div className="text-3xl mb-3 transition-transform duration-500 group-hover:scale-110">
                      {step.icon}
                    </div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>
                      Step {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Circle node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-8">
                  <div
                    className="w-4 h-4 rounded-full border-2 transition-all duration-500"
                    style={{
                      borderColor: 'var(--accent-blue)',
                      background: 'var(--bg-primary)',
                      boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                    }}
                  />
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
