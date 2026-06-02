'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { testimonials as staticTestimonials } from '@/data/testimonials';
import { submitToGoogleSheets, fetchTestimonialsFromSheets, sendReviewEmail } from '@/lib/emailService';
import { domains } from '@/data/domains';

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
  const [testimonialsList, setTestimonialsList] = useState(staticTestimonials);
  const [showModal, setShowModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    domain: '',
    rating: 5,
    text: ''
  });
  
  const sectionRef = useRef(null);

  const displayTestimonials = testimonialsList.slice(0, 5);

  // Fetch testimonials from Google Sheets
  useEffect(() => {
    const getTestimonials = async () => {
      const response = await fetchTestimonialsFromSheets();
      if (response.success && response.data.length > 0) {
        setTestimonialsList(response.data);
      }
    };
    getTestimonials();
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal || showViewAllModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, showViewAllModal]);

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Testimonials"
          title={<>What Our <span className="text-gradient">Clients Say</span></>}
        />
        
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Write a Review
          </button>
          {testimonialsList.length > 5 && (
            <button 
              onClick={() => setShowViewAllModal(true)}
              className="btn-outline"
            >
              View All ({testimonialsList.length})
            </button>
          )}
        </div>

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
                className="glass px-10 py-8 md:px-14 md:py-10 rounded-2xl text-center relative"
              >
                {/* Quote icon */}
                <div className="text-6xl leading-none mb-4 opacity-20" style={{ color: 'var(--accent-blue)' }}>
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <StarRating rating={displayTestimonials[current]?.rating || 5} />
                </div>

                {/* Text */}
                <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                  {displayTestimonials[current]?.text}
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
                    {displayTestimonials[current]?.avatar || displayTestimonials[current]?.name?.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {displayTestimonials[current]?.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {displayTestimonials[current]?.college} {displayTestimonials[current]?.domain ? `• ${displayTestimonials[current]?.domain}` : ''}
                    </p>
                    {(displayTestimonials[current]?.date || displayTestimonials[current]?.timestamp) && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {new Date(displayTestimonials[current]?.date || displayTestimonials[current]?.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {displayTestimonials.map((_, i) => (
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

      {/* Write a Review Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-8 md:p-10 rounded-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              data-lenis-prevent
            >
              <button 
                onClick={() => { setShowModal(false); setSubmitSuccess(false); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              {submitSuccess ? (
                <div className="text-center py-10">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-2 text-gradient">Review Submitted!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Thank you for your feedback. It has been sent for approval.
                  </p>
                  <button 
                    onClick={() => { setShowModal(false); setSubmitSuccess(false); }}
                    className="btn-outline mt-8"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-6 text-center text-gradient">Write a Review</h3>
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      await submitToGoogleSheets(formData, 'testimonial');
                      await sendReviewEmail(formData);
                      setIsSubmitting(false);
                      setSubmitSuccess(true);
                      setFormData({ name: '', email: '', college: '', domain: '', rating: 5, text: '' });
                    }} 
                    className="space-y-4"
                  >
                    <div>
                      <label className="form-label">Full Name</label>
                      <input required type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input required type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">College</label>
                      <input required type="text" className="form-input" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Project Domain</label>
                      <select required className="form-input" style={{ appearance: 'none' }} value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}>
                        <option value="">Select Domain</option>
                        {domains.map((d) => <option key={d.id} value={d.title}>{d.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Rating</label>
                      <div className="flex gap-2 text-2xl cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            onClick={() => setFormData({...formData, rating: star})}
                            style={{ color: star <= formData.rating ? '#f59e0b' : '#4a5568' }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Review</label>
                      <textarea required className="form-input min-h-[100px] resize-none" value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})}></textarea>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button 
                        type="button" 
                        onClick={() => { setShowModal(false); setFormData({ name: '', email: '', college: '', domain: '', rating: 5, text: '' }); }} 
                        className="btn-outline w-full justify-center"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Modal */}
      <AnimatePresence>
        {showViewAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass p-6 md:p-8 rounded-2xl w-full max-w-4xl relative max-h-[90vh] flex flex-col"
              data-lenis-prevent
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gradient">All Reviews</h3>
                <button 
                  onClick={() => setShowViewAllModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonialsList.map((testimonial, idx) => (
                  <div key={testimonial.id || idx} className="bg-white/5 border border-white/10 p-6 rounded-xl relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                            color: '#fff',
                          }}
                        >
                          {testimonial.avatar || testimonial.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {testimonial.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {testimonial.college} {testimonial.domain ? `• ${testimonial.domain}` : ''}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={testimonial.rating || 5} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {testimonial.text}
                    </p>
                    {(testimonial.date || testimonial.timestamp) && (
                      <p className="text-xs mt-3 text-right opacity-70" style={{ color: 'var(--text-muted)' }}>
                        {new Date(testimonial.date || testimonial.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
