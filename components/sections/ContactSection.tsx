'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/lib/db';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
    profile: {
        name?: string | null;
        email: string | null;
        phone: string | null;
        location: string | null;
    } | null;
    socialLinks?: Array<{
        platform: string;
        url: string;
    }>;
}

export default function ContactSection({ profile, socialLinks = [] }: ContactSectionProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const { error } = await submitContactMessage(formData);

        if (error) {
            setStatus('error');
        } else {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }

        setTimeout(() => setStatus('idle'), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <section id="contact" className={styles.wrapper}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.contactBadge}>
                        <span>📬</span> Inbox Open
                    </div>
                    <h2 className="statement" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}>
                        Let's <span className="text-gradient-lime">Connect</span>
                    </h2>
                </div>

                <div className={styles.contactGrid}>
                    {/* Left: Profile Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>
                                <span>👋</span>
                                <div className={styles.statusIndicator}></div>
                            </div>
                            <div>
                                <h3 className={styles.profileName}>{profile?.name || 'Hanna'}</h3>
                                <p className={styles.profileRole}>Marketing & Content</p>
                                {socialLinks.find(l => l.platform.toLowerCase() === 'linkedin') && (
                                    <a
                                        href={socialLinks.find(l => l.platform.toLowerCase() === 'linkedin')?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginTop: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: '#0077b5',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <span>🔗</span> LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>

                        {profile && (
                            <div className={styles.contactLinks}>
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className={styles.contactLink}>
                                        <span className={styles.iconWrapper}>📧</span>
                                        {profile.email}
                                    </a>
                                )}
                                {profile.phone && (
                                    <a href={`tel:${profile.phone}`} className={styles.contactLink}>
                                        <span className={styles.iconWrapper}>📞</span>
                                        {profile.phone}
                                    </a>
                                )}
                                {profile.location && (
                                    <div className={styles.contactLink}>
                                        <span className={styles.iconWrapper}>📍</span>
                                        {profile.location}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Chat Form */}
                    <div className={styles.chatInterface}>
                        <div className={styles.chatHeader}>
                            <h3 className={styles.chatTitle}>Send a Message 💬</h3>
                            <p className={styles.chatSubtitle}>I usually reply within 24 hours.</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.formGroup}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                            <textarea
                                name="message"
                                placeholder="Type your message here..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className={styles.textarea}
                                rows={5}
                            />

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent! 🚀' : 'Send Message ➤'}
                            </button>

                            {status === 'error' && (
                                <p className={`${styles.statusMessage} ${styles.error}`}>
                                    Failed to send. Please try again.
                                </p>
                            )}
                            {status === 'success' && (
                                <p className={`${styles.statusMessage} ${styles.success}`}>
                                    Thanks! I'll get back to you soon.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
