'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/ScrollProgress'), { ssr: false });
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Domains from '@/components/Domains';
import WhyChooseMe from '@/components/WhyChooseMe';
import FeaturedProjects from '@/components/FeaturedProjects';
import Testimonials from '@/components/Testimonials';
import ProcessTimeline from '@/components/ProcessTimeline';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Custom cursor */}
      <CustomCursor />

      {/* Scroll progress */}
      <ScrollProgress />

      {/* Smooth scroll wrapper */}
      <SmoothScroll>
        {/* Navigation */}
        <Navbar />

        {/* Main content */}
        <main>
          <Hero />
          <About />
          <Domains />
          <WhyChooseMe />
          <FeaturedProjects />
          <Testimonials />
          <ProcessTimeline />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </SmoothScroll>

      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </>
  );
}
