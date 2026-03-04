import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import logoImg from './assets/logo.png';

export default function Journey() {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const containerRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // Fade in entire page
        gsap.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" }
        );
        // Animate the form popping up
        gsap.fromTo(formRef.current,
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "back.out(1.2)" }
        );
    }, []);

    const handleBack = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => navigate('/')
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const handleOk = () => {
        setShowPopup(false);
        window.scrollTo(0, 0);
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => navigate('/')
        });
    };

    return (
        <div className="app-container" ref={containerRef}>
            {/* Background 3D Scene */}
            <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <Scene />
                </Canvas>
            </div>

            {/* Navigation */}
            <nav className="navbar glass-dark" style={{ justifyContent: 'flex-start' }}>
                <button
                    onClick={handleBack}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-offwhite)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </nav>

            {/* Content Form Overlay */}
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 5vw' }}>
                <div className="glass" ref={formRef} style={{ padding: 'clamp(2rem, 5vw, 4rem)', borderRadius: '16px', maxWidth: '600px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <h1 style={{ fontSize: '3rem', color: 'var(--color-gold)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
                        Begin Your Journey
                    </h1>
                    <p style={{ opacity: 0.8, marginBottom: '3rem', fontSize: '1.1rem' }}>
                        Fill out the consultation form below, and our elite advisory team will reach out to schedule your personalized session.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Full Name</label>
                            <input type="text" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Email</label>
                            <input type="email" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Ph.no</label>
                            <input type="tel" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>State</label>
                            <select required defaultValue="" style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }}>
                                <option value="" disabled style={{ background: '#111', color: 'gray' }}>Select your state</option>
                                {[
                                    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
                                    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry', 'Ladakh', 'Jammu and Kashmir'
                                ].map(state => (
                                    <option key={state} value={state} style={{ background: '#111', color: 'white' }}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Target Course</label>
                            <input type="text" placeholder="e.g. Bca" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Target Institution</label>
                            <input type="text" placeholder="e.g. IIM Bangalore" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Additional Details</label>
                            <textarea rows="4" placeholder="Tell us about your academic background..." style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', width: '100%' }}>
                            Submit Request
                        </button>
                    </form>
                </div>

                {/* Success Popup Modal */}
                {showPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div className="glass" style={{ padding: '3rem', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Success</h2>
                            <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>Your Details submitted Successfully</p>
                            <button onClick={handleOk} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
