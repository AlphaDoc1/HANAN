'use client';

import Image from 'next/image';
import styles from './EducationSection.module.css';

interface Education {
    id: string;
    institution: string;
    degree: string;
    field_of_study: string | null;
    location: string | null;
    start_date: string;
    end_date: string | null;
    grade: string | null;
    description: string | null;
    achievements: string[] | null;
    logo_url: string | null;
}

interface EducationSectionProps {
    education: Education[];
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function EducationSection({ education }: EducationSectionProps) {
    if (!education || education.length === 0) return null;

    return (
        <section id="education" className={styles.wrapper}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.academicBadge}>
                        <span>🎓</span> Academic Intel
                    </div>
                    <h2 className="statement" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        <span className="text-gradient-electric">Education</span>
                    </h2>
                </div>

                <div className={styles.educationGrid}>
                    {education.map((edu, index) => (
                        <div key={edu.id} className={styles.educationCard}>
                            {/* Visual decorative elements */}
                            <div className={styles.cardSlot}></div>
                            <div className={styles.cardStrip}></div>

                            <div className={styles.cardContent}>
                                <div className={styles.institutionHeader}>
                                    {edu.logo_url ? (
                                        <div className={styles.institutionLogo}>
                                            <Image
                                                src={edu.logo_url}
                                                alt={edu.institution}
                                                fill
                                                className={styles.logoImage}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.institutionLogo} style={{ background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                            🏫
                                        </div>
                                    )}
                                    <h4 className={styles.institutionName}>{edu.institution}</h4>
                                </div>

                                <div className={styles.degreeInfo}>
                                    <h3 className={styles.degree}>{edu.degree}</h3>
                                    {edu.field_of_study && (
                                        <h5 className={styles.field}>{edu.field_of_study}</h5>
                                    )}
                                </div>

                                <div className={styles.metaGrid}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Term</span>
                                        <span className={styles.metaValue}>
                                            {formatDate(edu.start_date).split(' ')[1]} - {edu.end_date ? formatDate(edu.end_date).split(' ')[1] : 'Present'}
                                        </span>
                                    </div>
                                    {edu.grade && (
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>Grade</span>
                                            <span className={styles.metaValue}>{edu.grade}</span>
                                        </div>
                                    )}
                                    {edu.location && (
                                        <div className={styles.metaItem} style={{ gridColumn: 'span 2' }}>
                                            <span className={styles.metaLabel}>Location</span>
                                            <span className={styles.metaValue}>{edu.location}</span>
                                        </div>
                                    )}
                                </div>

                                {edu.description && (
                                    <p className={styles.description}>{edu.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
