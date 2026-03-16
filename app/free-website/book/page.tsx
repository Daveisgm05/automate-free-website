'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '../../components/AnimatedBackground';
import LiquidGlass from '../../components/LiquidGlass';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type LeadInfo = {
    name: string;
    phone: string;
    email: string;
};

export default function FreeWebsiteBook() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState<'form' | 'chat'>('form');

    // Form state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Chat state
    const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleBack = () => {
        setIsVisible(false);
        setTimeout(() => router.push('/'), 500);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim() || !phone.trim() || !email.trim()) {
            setFormError('Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim() }),
            });

            const data = await res.json();

            if (!data.success) {
                setFormError(data.error || 'Something went wrong.');
                setIsSubmitting(false);
                return;
            }

            const info = { name: name.trim(), phone: phone.trim(), email: email.trim() };
            setLeadInfo(info);
            setMessages([{ role: 'assistant', content: `Hi ${info.name}! Thanks for your interest in getting a free website. Tell me a bit about your business — what do you do?` }]);
            setStep('chat');
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, leadInfo }),
            });

            const data = await res.json();
            const reply = data.success ? data.message : 'Sorry, something went wrong. Please try again.';
            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered a network error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(182, 145, 97, 0.35)',
        fontSize: '1rem',
        outline: 'none',
        background: 'rgba(182, 145, 97, 0.1)',
        color: '#E6E0DD',
        fontFamily: 'Arial, Helvetica, sans-serif',
    };

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

            {/* Back button */}
            <button
                onClick={handleBack}
                style={{
                    all: 'unset',
                    position: 'absolute',
                    top: 'clamp(1rem, 3vw, 2rem)',
                    left: 'clamp(1rem, 3vw, 2rem)',
                    width: '2.75rem',
                    height: '2.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(182, 145, 97, 0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(182, 145, 97, 0.3)',
                    borderRadius: '50%',
                    color: '#E6E0DD',
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
                }}
                aria-label="Back"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>

            <LiquidGlass style={{
                maxWidth: '520px',
                width: '90vw',
                maxHeight: '85dvh',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                background: 'rgba(40, 25, 15, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {step === 'form' ? (
                    /* Contact Form */
                    <form onSubmit={handleFormSubmit} style={{
                        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                            <img
                                src="/automatelogo.png"
                                alt="Automate Logo"
                                style={{ width: '44px', height: 'auto', margin: '0 auto 0.75rem' }}
                            />
                            <h1 style={{
                                margin: 0,
                                fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
                                fontWeight: 700,
                                color: '#B69161',
                                lineHeight: 1.2,
                            }}>
                                Book a Meeting
                            </h1>
                            <p style={{
                                margin: '0.5rem 0 0',
                                color: '#999',
                                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                            }}>
                                Fill in your details to get started
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#E6E0DD', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="John Doe"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#E6E0DD', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#E6E0DD', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 500 }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {formError && (
                            <p style={{ color: '#e57373', fontSize: '0.85rem', margin: 0 }}>{formError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '14px',
                                backgroundColor: '#B69161',
                                color: '#2C2520',
                                border: 'none',
                                borderRadius: '999px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.7 : 1,
                                transition: 'background-color 0.2s ease, opacity 0.2s ease',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                marginTop: '0.25rem',
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Book Now'}
                        </button>
                    </form>
                ) : (
                    /* Chat Interface */
                    <>
                        <div style={{
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(182, 145, 97, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <img
                                src="/automatelogo.png"
                                alt="Automate"
                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                            />
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#E6E0DD' }}>
                                    Automate Assistant
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
                                    Powered by AI
                                </p>
                            </div>
                        </div>

                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '16px',
                                    background: msg.role === 'user' ? '#B69161' : '#3A332D',
                                    color: msg.role === 'user' ? '#2C2520' : '#E6E0DD',
                                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                                    lineHeight: 1.5,
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                                }}>
                                    {msg.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{
                                    alignSelf: 'flex-start',
                                    padding: '0.75rem 1rem',
                                    background: '#3A332D',
                                    borderRadius: '16px',
                                    borderBottomLeftRadius: '4px',
                                    color: '#999',
                                    fontSize: '0.9rem',
                                }}>
                                    Typing...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} style={{
                            padding: '1rem 1.25rem',
                            borderTop: '1px solid rgba(182, 145, 97, 0.25)',
                            display: 'flex',
                            gap: '0.75rem',
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your message..."
                                style={{
                                    ...inputStyle,
                                    flex: 1,
                                    width: 'auto',
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                style={{
                                    padding: '0 1.5rem',
                                    background: '#B69161',
                                    color: '#2C2520',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                                    transition: 'opacity 0.2s ease',
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                }}
                            >
                                Send
                            </button>
                        </form>
                    </>
                )}
            </LiquidGlass>
        </div>
    );
}
