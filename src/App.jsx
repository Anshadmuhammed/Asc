import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, MessageSquare, Award, ArrowRight, Globe, Mail, Instagram, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const eliteRef = useRef(null);
  const contactRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Basic Hero Fade Out on Scroll
    gsap.to(heroRef.current, {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // About Section Animate In
    const aboutLines = aboutRef.current.querySelectorAll('.animate-me');
    gsap.fromTo(aboutLines,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Elite Section Cards Animate In
    const cards = eliteRef.current.querySelectorAll('.elite-card');
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.9, y: 60 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: eliteRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );

    // Contact Section Animate In
    const contactItems = contactRef.current.querySelectorAll('.contact-item');
    gsap.fromTo(contactItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );

  }, []);

  return (
    <div className="app-container" ref={containerRef}>

      {/* 3D Background Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Navigation (Glassmorphic) */}
      <nav className="navbar glass-dark">
        <div className="logo">
          <span>Ascetic Edu Solution</span>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} color="var(--color-gold)" /> : <Menu size={28} color="var(--color-offwhite)" />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#about" onClick={closeMobileMenu}>About</a>
          <a href="#services" onClick={closeMobileMenu}>Services</a>
          <a className="btn-primary" href="#contact" onClick={closeMobileMenu} style={{ textDecoration: 'none', display: 'inline-block' }}>Contact Us</a>
        </div>
      </nav>

      {/* Content overlays */}
      <main>

        {/* Section 1: Hero */}
        <section className="hero" ref={heroRef} id="home">
          <h1>Clarity in the Pursuit of Academic Excellence.</h1>
          <p>Bespoke consultancy for premier institutions all over India.</p>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            Begin Your Journey <ArrowRight size={18} />
          </button>
        </section>

        {/* Section 2: About Ascetic Philosophy */}
        <section className="about" ref={aboutRef} id="about">
          <div className="about-content">
            <div className="about-text">
              <h2 className="animate-me">The Ascetic Philosophy</h2>
              <p className="animate-me">
                True excellence requires discipline, focus, and an unwavering commitment to mastery. At Ascetic Edu Solution, we strip away the noise and guide our students on a pure, result-oriented path towards admission into the elite corridors of India's top universities.
              </p>
              <p className="animate-me">
                Inspired by minimalism and rigorous intellectual pursuit, our consultancy acts as the refined gateway between your current potential and your academic zenith.
              </p>
            </div>

            <div className="about-grid">
              <div className="glass about-card animate-me">
                <h3>Absolute Focus</h3>
                <p>Curated roadmaps tailored strictly for premier Indian colleges like IIMs, IISc, and top NITs/IITs.</p>
              </div>
              <div className="glass about-card animate-me">
                <h3>Strategic Precision</h3>
                <p>No guesswork. Every step is backed by data, alumni insights, and proven execution strategies.</p>
              </div>
            </div>

            <div className="glass director-card animate-me" style={{ gridColumn: '1 / -1', padding: '3rem', borderRadius: '16px', marginTop: '1rem', borderTop: '2px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ maxWidth: '800px' }}>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--color-gold)', marginBottom: '0.25rem', fontFamily: 'var(--font-serif)' }}>Akbar PA</h3>
                <h4 style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '1.5rem', fontWeight: 400, letterSpacing: '1px', textTransform: 'uppercase' }}>Managing Director</h4>
                <p style={{ lineHeight: 1.8, fontSize: '1.1rem', opacity: 0.9, fontStyle: 'italic' }}>
                  "Our vision at Ascetic Edu Solution is not simply to secure admissions, but to sculpt the intellectual leaders of tomorrow. We believe that with absolute discipline, curated mentorship, and a pure pursuit of academic excellence, every ambitious student can conquer the elite realms of Indian academia."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Services */}
        <section className="elite" ref={eliteRef} id="services">
          <h2 className="animate-me">Pillars of Expertise</h2>
          <p className="animate-me">Comprehensive and bespoke guidance designed to elevate your academic trajectory.</p>

          <div className="cards-container">
            <div className="glass elite-card">
              <Compass className="icon" />
              <h3>Admission & Career Guidance</h3>
              <p>Strategic profiling and holistic mentorship to navigate your unique path and unlock your highest potential.</p>
            </div>

            <div className="glass elite-card">
              <MessageSquare className="icon" />
              <h3>Free Counselling Support</h3>
              <p>Expert, unbiased advisory sessions to clarify your goals and identify the finest opportunities available.</p>
            </div>

            <div className="glass elite-card">
              <Award className="icon" />
              <h3>Scholarships & Career Support</h3>
              <p>Dedicated assistance in securing merit-based funding alongside robust early-career positioning.</p>
            </div>

            <div className="glass elite-card">
              <Globe className="icon" />
              <h3>Admission Support All Over India</h3>
              <p>A seamless, nationwide infrastructure to ensure your placement in premier institutions across the country.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Contact */}
        <section className="elite" ref={contactRef} id="contact" style={{ minHeight: '80vh', paddingBottom: '2rem' }}>
          <h2 className="animate-me">Let's Connect</h2>
          <p className="animate-me">Reach out to begin crafting your personalized pathway to excellence.</p>

          <div className="contact-container" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '3rem' }}>
            <a href="mailto:asceticedusolution@gmail.com" className="glass contact-item" style={{ padding: '2rem 3rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '250px', textDecoration: 'none', color: 'inherit' }}>
              <Mail className="icon" style={{ width: '40px', height: '40px', color: 'var(--color-gold)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Email</h3>
              <p style={{ opacity: 0.8 }}>asceticedusolution@gmail.com</p>
            </a>

            <a href="https://wa.me/917025621633" target="_blank" rel="noopener noreferrer" className="glass contact-item" style={{ padding: '2rem 3rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '250px', textDecoration: 'none', color: 'inherit' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '40px', height: '40px', fill: 'var(--color-gold)', marginBottom: '1rem' }}>
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>WhatsApp</h3>
              <p style={{ opacity: 0.8 }}>+91 70256 21633</p>
            </a>

            <a href="https://www.instagram.com/ascetic_edu_solution?igsh=MWtkN202OHBwdWM0eQ==" target="_blank" rel="noopener noreferrer" className="glass contact-item" style={{ padding: '2rem 3rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '250px', textDecoration: 'none', color: 'inherit' }}>
              <Instagram className="icon" style={{ width: '40px', height: '40px', color: 'var(--color-gold)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Instagram</h3>
              <p style={{ opacity: 0.8 }}>@ascetic_edu_solution</p>
            </a>
          </div>
        </section>

      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Ascetic Edu Solution. Elegance in Academics.</p>
      </footer>

    </div>
  );
}

export default App;
