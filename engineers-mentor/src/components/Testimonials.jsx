'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { testimonials } from '@/data/testimonials';

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#4a5568'}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.testimonial-container', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    init();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Testimonials"
          title={<>What Our <span className="text-gradient">Clients Say</span></>}
        />

        <div className="testimonial-container max-w-3xl mx-auto">
          {/* Testimonial card */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="glass p-8 md:p-12 rounded-2xl text-center relative"
              >
                {/* Quote icon */}
                <div className="text-6xl leading-none mb-4 opacity-20" style={{ color: 'var(--accent-blue)' }}>
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <StarRating rating={testimonials[current].rating} />
                </div>

                {/* Text */}
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                  {testimonials[current].text}
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                      color: '#fff',
                    }}
                  >
                    {testimonials[current].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {testimonials[current].name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {testimonials[current].college} • {testimonials[current].domain}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === current ? 'var(--accent-blue)' : 'rgba(255,255,255,0.15)',
                  width: i === current ? '24px' : '8px',
                  boxShadow: i === current ? '0 0 10px var(--accent-blue)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
