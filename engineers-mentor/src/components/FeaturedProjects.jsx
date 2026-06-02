'use client';
import { useRef, useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';
import { projects as staticProjects } from '@/data/projects';
import { fetchProjectsFromSheets } from '@/lib/emailService';

function getValidImageUrl(url) {
  if (!url) return null;
  // Convert standard Google Drive viewing links to direct image links
  const gDriveMatch = url.match(/\/file\/d\/(.+?)\//) || url.match(/\?id=(.+?)(&|$)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${gDriveMatch[1]}`;
  }
  return url;
}

function ProjectCard({ project }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[340px] md:w-[420px] rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-8px]"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
    >
      {/* Image / Background */}
      <div className="relative h-52 md:h-60 overflow-hidden"
        style={{
          backgroundColor: project.color ? `${project.color}20` : '#1a1a2e',
          backgroundImage: project.image ? `url('${getValidImageUrl(project.image)}')` : `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        {/* Decorative elements only show if no actual image is provided */}
        {!project.image && (
          <>
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
          </>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium z-10"
          style={{ background: 'rgba(0,0,0,0.5)', color: project.color || '#fff', border: `1px solid ${project.color}30`, backdropFilter: 'blur(4px)' }}>
          {project.domain}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-[var(--accent-blue)]"
          style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {(typeof project.techStack === 'string' ? project.techStack.split(',').map(s=>s.trim()) : project.techStack).map((tech) => (
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
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    const loadProjects = async () => {
      const response = await fetchProjectsFromSheets();
      if (response.success && response.data.length > 0) {
        setProjects(response.data);
      }
    };
    loadProjects();
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

      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth - container.clientWidth;

      ctx = gsap.context(() => {
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
      });
    };

    init();

    return () => {
      isCancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden" style={{ background: 'var(--bg-primary)', zIndex: 10 }}>
      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Our Work"
          title={<>Featured <span className="text-gradient">Projects</span></>}
        />
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-10 px-8 md:px-12 overflow-x-auto pb-8 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, idx) => (
          <ProjectCard key={project.id || idx} project={project} />
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
