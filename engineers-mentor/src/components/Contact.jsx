'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { domains } from '@/data/domains';
import { submitToGoogleSheets, sendEmailNotification } from '@/lib/emailService';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  college: '',
  department: '',
  domain: '',
  description: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        gsap.from('.contact-form-container', {
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

        gsap.from('.contact-info', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: 0.2,
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number';
    if (!formData.college.trim()) newErrors.college = 'College name is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.domain) newErrors.domain = 'Please select a domain';
    if (!formData.description.trim()) newErrors.description = 'Project description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Submit to Google Sheets
      await submitToGoogleSheets(formData);

      // Send emails
      await sendEmailNotification(formData);

      setIsSubmitted(true);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Get Started"
          title={<>Start Your <span className="text-gradient">Project Today</span></>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div className="contact-form-container lg:col-span-3">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass px-10 py-8 md:px-14 md:py-10 rounded-2xl text-center"
                >
                  <div className="text-6xl mb-6">🎉</div>
                  <h3 className="text-2xl font-bold mb-4 text-gradient">Thank You!</h3>
                  <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                    We&apos;ve received your project details. Our team will reach out to you within 24 hours.
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="glass px-8 py-6 md:px-12 md:py-10 rounded-2xl space-y-5"
                >
                  {/* Row: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                      />
                      {errors.name && <p className="text-xs mt-1 text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                      {errors.email && <p className="text-xs mt-1 text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row: Phone + College */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                      />
                      {errors.phone && <p className="text-xs mt-1 text-red-400">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="form-label">College Name *</label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="Your College"
                        className={`form-input ${errors.college ? 'error' : ''}`}
                      />
                      {errors.college && <p className="text-xs mt-1 text-red-400">{errors.college}</p>}
                    </div>
                  </div>

                  {/* Row: Department + Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Department *</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Computer Science"
                        className={`form-input ${errors.department ? 'error' : ''}`}
                      />
                      {errors.department && <p className="text-xs mt-1 text-red-400">{errors.department}</p>}
                    </div>
                    <div>
                      <label className="form-label">Project Domain *</label>
                      <select
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className={`form-input ${errors.domain ? 'error' : ''}`}
                        style={{ appearance: 'none' }}
                      >
                        <option value="">Select a domain</option>
                        {domains.map((d) => (
                          <option key={d.id} value={d.title}>{d.title}</option>
                        ))}
                        <option value="Others">Others</option>
                      </select>
                      {errors.domain && <p className="text-xs mt-1 text-red-400">{errors.domain}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="form-label">Project Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project requirements, features, and timeline..."
                      rows={4}
                      className={`form-input resize-none ${errors.description ? 'error' : ''}`}
                    />
                    {errors.description && <p className="text-xs mt-1 text-red-400">{errors.description}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>
                        Submit Your Project
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Info */}
          <div className="contact-info lg:col-span-2 space-y-6">
            {/* Info cards */}
            <div className="glass px-8 py-6 md:px-10 md:py-8 rounded-2xl flex flex-col gap-8">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Get In Touch
              </h3>

              {/* Email */}
              <a href="mailto:engineersmentorservices@gmail.com" className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    Email <span className="text-[10px] normal-case bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-blue)' }}>Tap to send email</span>
                  </p>
                  <p className="text-sm font-medium break-all" style={{ color: 'var(--text-secondary)' }}>
                    engineersmentorservices@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:+918072287692" className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    Phone <span className="text-[10px] normal-case bg-[var(--accent-purple)]/10 px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-purple)' }}>Tap to call</span>
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    +91 8072287692<br />+91 9080420738
                  </p>
                </div>
              </a>

            </div>

            {/* Social Links */}
            <div className="glass px-8 py-6 md:px-10 md:py-8 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Follow Us
              </h3>
              <div className="flex gap-3">
                {[
                  {
                    name: 'Instagram',
                    href: 'https://www.instagram.com/_em_projects?igsh=M2hlZGl5aDJuaW00',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  // {
                  //   name: 'LinkedIn',
                  //   href: 'https://linkedin.com/company/engineers-mentor',
                  //   icon: (
                  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  //       <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                  //     </svg>
                  //   ),
                  // },
                  // {
                  //   name: 'Twitter',
                  //   href: 'https://twitter.com/engineers_mentor',
                  //   icon: (
                  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  //     </svg>
                  //   ),
                  // },
                  // {
                  //   name: 'YouTube',
                  //   href: 'https://youtube.com/@engineers_mentor',
                  //   icon: (
                  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  //       <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
                  //     </svg>
                  //   ),
                  // },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-y-[-2px]"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-secondary)',
                    }}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="glass px-8 py-6 md:px-10 md:py-8 rounded-2xl text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Average response time: <span className="text-gradient font-bold">Under 2 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
