'use client';

import { useState } from 'react';
import styles from './CertificationsSection.module.css';

interface Certification {
    name: string;
    institution: string;
    date: string;
    issuer: string;
    url?: string | null;
    image_url?: string | null;
    is_demo?: boolean;
}

interface CertificationsSectionProps {
    certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    // If no data, we could ideally manually inject default demos here if not passed from parent.
    // But parent (page.tsx) is passing DEFAULT_DATA.certifications which now has demos.
    const displayCerts = certifications && certifications.length > 0 ? certifications : [];

    if (displayCerts.length === 0) return null;

    return (
        <section id="certifications" className={`section ${styles.wrapper}`}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.subLabel}>Credibility</span>
                    <h2 className="statement">
                        Certifications <span className="text-gradient-electric">& Awards</span>
                    </h2>
                </div>

                <div className={styles.grid}>
                    {displayCerts.map((cert, index) => (
                        <div
                            key={index}
                            className={styles.card}
                            onClick={() => setSelectedCert(cert)}
                        >
                            {cert.is_demo && (
                                <div className={styles.demoBadge}>DEMO</div>
                            )}

                            <div className={styles.thumbnailWrapper}>
                                {/* Using standard img to avoid next/image domain configuration issues with placeholders */}
                                <img
                                    src={cert.image_url || `https://placehold.co/600x400/1a1a1a/FFF?text=${encodeURIComponent(cert.name)}`}
                                    alt={cert.name}
                                    className={styles.thumbnail}
                                    loading="lazy"
                                />
                                <div className={styles.overlay}>
                                    <div className={styles.viewIcon}>👁️</div>
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{cert.name}</h3>
                                <div className={styles.cardMeta}>
                                    <span className={styles.issuer}>
                                        {cert.issuer || cert.institution}
                                    </span>
                                    <span>{cert.date.split('-')[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedCert && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedCert(null)}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedCert(null)}>×</button>

                        <div className={styles.modalImageWrapper}>
                            <img
                                src={selectedCert.image_url || ''}
                                alt={selectedCert.name}
                                className={styles.modalImage}
                            />
                        </div>

                        <div className={styles.modalSidebar}>
                            <div>
                                <h3 className={styles.modalTitle}>{selectedCert.name}</h3>
                                <div className={styles.modalIssuer}>
                                    Issued by {selectedCert.issuer || selectedCert.institution}
                                </div>

                                <div className={styles.modalRow}>
                                    <span>Date Issued</span>
                                    <span>{selectedCert.date}</span>
                                </div>
                                <div className={styles.modalRow}>
                                    <span>Credential ID</span>
                                    <span>{selectedCert.is_demo ? 'DEMO-ID-7823' : 'Verified'}</span>
                                </div>

                                {selectedCert.url && (
                                    <a
                                        href={selectedCert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '2rem',
                                            padding: '1rem 2rem',
                                            background: 'var(--electric)',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            borderRadius: '2rem',
                                            textAlign: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        Verify Credential ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
