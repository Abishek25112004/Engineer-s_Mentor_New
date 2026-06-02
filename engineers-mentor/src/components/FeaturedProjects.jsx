'use client';
import { useRef, useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';
import { projects as staticProjects } from '@/data/projects';
import { fetchProjectsFromSheets } from '@/lib/emailService';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

function getValidImageUrl(url) {
  if (!url) return null;
  // Extract ID from standard viewing links or ?id= links
  const gDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    // Using the thumbnail endpoint bypasses strict CORS/redirect issues for background-images
    return `https://drive.google.com/thumbnail?id=${gDriveMatch[1]}&sz=w1000`;
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

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      const response = await fetchProjectsFromSheets();
      if (response.success && response.data.length > 0) {
        setProjects(response.data);
      }
    };
    loadProjects();
  }, []);

  // Horizontal scroll on mouse wheel and touch over the container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const onWheel = (e) => {
      // Calculate boundaries
      const isAtLeft = container.scrollLeft <= 0;
      const isAtRight = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

      // If scrolling in a valid horizontal direction
      if ((e.deltaY > 0 && !isAtRight) || (e.deltaY < 0 && !isAtLeft)) {
        e.preventDefault(); // Stop native vertical scroll
        e.stopPropagation(); // Stop Lenis from intercepting

        // Smoothly animate scrollLeft using GSAP
        gsap.to(container, {
          scrollLeft: container.scrollLeft + (e.deltaY * 2), // Multiply for better sensitivity
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };
    
    let startY = 0;
    let startX = 0;
    let lastY = 0;
    let isVerticalSwipe = false;
    let hasDeterminedDirection = false;

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      lastY = startY;
      hasDeterminedDirection = false;
      isVerticalSwipe = false;
    };

    const onTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = startY - currentY;
      const deltaX = startX - currentX;
      const stepY = lastY - currentY;
      lastY = currentY;

      if (!hasDeterminedDirection) {
        // Need a small threshold to accurately determine direction
        if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
          isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX);
          hasDeterminedDirection = true;
        }
      }

      if (isVerticalSwipe) {
        const isAtLeft = container.scrollLeft <= 0;
        const isAtRight = Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

        // If scrolling down (stepY > 0) and not at right, OR scrolling up (stepY < 0) and not at left
        if ((stepY > 0 && !isAtRight) || (stepY < 0 && !isAtLeft)) {
          e.preventDefault(); // Stop native vertical scroll
          e.stopPropagation();
          
          container.scrollLeft += stepY * 1.5; // Apply manual scroll
        }
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const displayProjects = projects.slice(0, 6);

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden" style={{ background: 'var(--bg-primary)', zIndex: 10 }}>
      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Our Work"
          title={<>Featured <span className="text-gradient">Projects</span></>}
        />
      </div>

      {/* Horizontal scroll container */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          data-lenis-prevent="true"
          className="flex gap-10 px-8 md:px-12 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProjects.map((project, idx) => (
            <ProjectCard key={project.id || idx} project={project} />
          ))}
        </div>
        
        {/* Gradient edges */}
        <div className="absolute top-0 left-0 bottom-8 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, var(--bg-primary), transparent)' }} />
        <div className="absolute top-0 right-0 bottom-8 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, var(--bg-primary), transparent)' }} />
      </div>

      {projects.length > 6 && (
        <div className="flex justify-center mt-12 relative z-20">
          <button 
            onClick={() => setShowAll(true)}
            className="btn-primary"
          >
            View All Projects ({projects.length})
          </button>
        </div>
      )}

      {/* View All Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(10, 10, 15, 0.95)', backdropFilter: 'blur(10px)' }}
          >
            <div className="w-full max-w-7xl max-h-full flex flex-col glass rounded-3xl overflow-hidden border border-white/10">
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[var(--bg-primary)]/80 backdrop-blur-xl z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gradient">All Projects</h3>
                <button 
                  onClick={() => setShowAll(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                  {projects.map((project, idx) => (
                    <ProjectCard key={project.id || idx} project={project} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
