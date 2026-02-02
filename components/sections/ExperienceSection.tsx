'use client';

import Image from 'next/image';
import styles from './ExperienceSection.module.css';

interface Experience {
    id: string;
    company: string;
    position: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    description: string | null;
    achievements: string[] | null;
    technologies: string[] | null;
    logo_url: string | null;
}

interface ExperienceSectionProps {
    experiences: Experience[];
}

function getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
    if (!experiences || experiences.length === 0) return null;

    return (
        <section id="experience" className={styles.wrapper}>
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.journeyBadge}>
                        <span>💼</span> The Path
                    </div>
                    <h2 className="statement" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                        Building <span className="text-gradient-lime">Legacies</span>
                    </h2>
                </div>

                <div className={styles.timeline}>
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className={styles.timelineItem}>
                            {/* Date Column */}
                            <div className={styles.dateColumn}>
                                <span className={styles.year}>{getYear(exp.start_date)}</span>
                                <span className={styles.duration}>
                                    {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                </span>
                            </div>

                            {/* Timeline Line */}
                            <div className={styles.timelineLineContainer}>
                                <div className={styles.timelineDot}></div>
                                {index !== experiences.length - 1 && <div className={styles.timelineLine}></div>}
                            </div>

                            {/* Content Column */}
                            <div className={styles.contentColumn}>
                                <div className={styles.experienceCard}>
                                    <h3 className={styles.roleTitle}>{exp.position}</h3>

                                    <div className={styles.companyRow}>
                                        <span className={styles.companyName}>@{exp.company}</span>
                                        {exp.location && (
                                            <span className={styles.location}>
                                                • {exp.location}
                                            </span>
                                        )}
                                    </div>

                                    {exp.description && (
                                        <p className={styles.description}>{exp.description}</p>
                                    )}

                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <ul className={styles.achievements}>
                                            {exp.achievements.map((achievement, idx) => (
                                                <li key={idx}>{achievement}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
