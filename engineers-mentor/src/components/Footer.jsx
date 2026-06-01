'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Domains', href: '#domains' },
    { label: 'Projects', href: '#projects' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="container-custom relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="Engineer's Mentor Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Your trusted partner for premium final year engineering projects.
              From concept to delivery, we help you stand out.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {['Instagram', 'LinkedIn', 'Twitter', 'YouTube'].map((name) => (
                <div
                  key={name}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {name[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm transition-colors duration-300 hover:text-[var(--accent-blue)]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
              Contact Us
            </h4>
            <div className="space-y-3">
              <a href="mailto:engineersmentorservices@gmail.com"
                className="block text-sm transition-colors duration-300 hover:text-[var(--accent-blue)]"
                style={{ color: 'var(--text-secondary)' }}>
                engineersmentorservices@gmail.com
              </a>
              <a href="tel:+918072287692"
                className="block text-sm transition-colors duration-300 hover:text-[var(--accent-blue)]"
                style={{ color: 'var(--text-secondary)' }}>
                +91 8072287692
              </a>
              <a href="tel:+919080420738"
                className="block text-sm transition-colors duration-300 hover:text-[var(--accent-blue)]"
                style={{ color: 'var(--text-secondary)' }}>
                +91 9080420738
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full mb-8" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {currentYear} Engineer&apos;s Mentor. All rights reserved.
          </p>
          <div className="text-xs flex items-center" style={{ color: 'var(--text-muted)' }}>
            <span>created by</span>
            <a 
              href="https://morpin.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold relative group transition-all duration-300 ml-1.5"
            >
              <span className="text-gradient group-hover:opacity-80 transition-opacity duration-300">Morpin Technologies</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" style={{ background: 'linear-gradient(to right, var(--accent-blue), #a855f7)' }}></span>
            </a>
          </div>
          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:translate-y-[-3px]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Back to top"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
