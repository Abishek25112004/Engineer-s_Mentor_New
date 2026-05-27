'use client';
import { useRef, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import { projects } from '@/data/projects';

function ProjectCard({ project }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[340px] md:w-[420px] rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-8px]"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      {/* Image placeholder */}
      <div className="relative h-52 md:h-60 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
        }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 grid-bg-dense opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-24 h-24 rounded-2xl rotate-12 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${project.color}30, ${project.color}10)`,
              border: `1px solid ${project.color}30`,
            }}
          />
        </div>
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: `${project.color}20`, color: project.color, border: `1px solid ${project.color}30` }}>
          {project.domain}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `${project.color}10`, backdropFilter: 'blur(4px)' }}>
          <span className="text-sm font-medium px-6 py-2 rounded-full"
            style={{ background: `${project.color}30`, color: '#fff', border: `1px solid ${project.color}50` }}>
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-[var(--accent-blue)]"
          style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth - container.clientWidth;

      gsap.to(container, {
        scrollLeft: scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    };

    init();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Our Work"
          title={<>Featured <span className="text-gradient">Projects</span></>}
        />
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 px-6 md:px-10 overflow-x-auto pb-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Gradient edges */}
      <div className="absolute top-0 left-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg-primary), transparent)' }} />
      <div className="absolute top-0 right-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg-primary), transparent)' }} />
    </section>
  );
}
