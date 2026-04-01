'use client';

import { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import LiquidGlass from './components/LiquidGlass';

export default function FreeWebsite() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div style={{
            height: '100dvh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
        }}>
            <AnimatedBackground />

            <LiquidGlass style={{
                maxWidth: '580px',
                width: '90vw',
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center' as const,
                gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                position: 'relative',
                zIndex: 1,
                background: 'rgba(40, 25, 15, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {/* Logo */}
                <img
                    src="/automatelogo.png"
                    alt="Automate Logo"
                    style={{ width: '56px', height: 'auto' }}
                />

                {/* Headline */}
                <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: '#B69161',
                }}>
                    Your Free Custom Website
                </h1>

                {/* Subheadline */}
                <p style={{
                    color: '#B69161',
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                    margin: 0,
                    opacity: 0.8,
                }}>
                    By Automate &mdash; Agentic AI Service Company
                </p>

                {/* Body */}
                <p style={{
                    color: '#E6E0DD',
                    fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
                    lineHeight: 1.65,
                    maxWidth: '440px',
                    margin: 0,
                    opacity: 0.85,
                }}>
                    We build free, professional websites for businesses.
                    No catch &mdash; we do this to showcase our AI-powered automation
                    capabilities and build genuine, lasting partnerships.
                    Experience what agentic automation can do for you.
                </p>

                {/* CTA Button */}
                <a
                    href="https://wa.me/96176412978?text=Hi%2C%20I'm%20interested%20in%20getting%20a%20free%20website!"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                        try {
                            const leadEventId = crypto.randomUUID ? crypto.randomUUID() : 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                            if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
                                (window as any).fbq('track', 'Lead', {}, { eventID: leadEventId });
                            }
                            const getCookie = (name: string) => { const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); return m ? m[2] : null; };
                            const fbp = getCookie('_fbp');
                            const fbc = getCookie('_fbc');
                            // Send CAPI event
                            fetch('/api/capi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    event_name: 'Lead',
                                    event_id: leadEventId,
                                    event_source_url: window.location.href,
                                    user_data: { fbp, fbc }
                                })
                            }).catch(err => console.warn('[CAPI Lead]', err.message));
                            // Forward lead to scoring pipeline
                            fetch('/api/leads/forward', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    lead_name: 'WhatsApp Lead',
                                    source: 'landing_page',
                                    event_id: leadEventId,
                                    fbp, fbc,
                                    event_source_url: window.location.href,
                                })
                            }).catch(err => console.warn('[Lead Forward]', err.message));
                        } catch (e) { console.warn('[Lead tracking]', e); }
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'clamp(12px, 2vw, 16px) clamp(28px, 5vw, 44px)',
                        backgroundColor: isHovered ? '#C9A878' : '#B69161',
                        color: '#2C2520',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease, transform 0.2s ease',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        marginTop: '0.5rem',
                    }}
                >
                    Book Meeting on WhatsApp
                </a>
            </LiquidGlass>
        </div>
    );
}
