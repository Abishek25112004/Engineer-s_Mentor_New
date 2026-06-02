'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Domains', href: '#domains' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[999] transition-all duration-500"
        style={{
          background: isScrolled ? 'rgba(5, 5, 8, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          padding: isScrolled ? '12px 0' : '20px 0',
        }}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative z-10">
            <img src="/Header Footer Logo.png" alt="Engineer's Mentor Logo" className="h-12 md:h-16 w-auto mix-blend-screen" />
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[var(--accent-blue)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <MagneticButton
              className="btn-primary text-sm"
              onClick={() => scrollTo('#contact')}
            >
              Start Your Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-[2px] rounded-full transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-[2px] rounded-full transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-[2px] rounded-full transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center"
            style={{ background: 'rgba(5, 5, 8, 0.97)' }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-3xl font-bold tracking-wide transition-colors duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <button
                  className="btn-primary mt-4"
                  onClick={() => scrollTo('#contact')}
                >
                  Start Your Project
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
