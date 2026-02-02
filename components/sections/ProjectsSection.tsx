'use client';

import { useState } from 'react';
import styles from './ProjectsSection.module.css';

interface MarketingProject {
    id?: string;
    title: string;
    description: string;
    long_description?: string | null;
    tech_stack: string[];
    image_url?: string | null;
    link?: string | null;
    is_demo?: boolean;
    metrics?: {
        [key: string]: string;
    };
    goals?: string;
    strategy?: string;
}

interface ProjectsSectionProps {
    projects: MarketingProject[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<MarketingProject | null>(null);

    const displayProjects = projects || [];
    if (displayProjects.length === 0) return null;

    // Helper to get metrics with defaults
    const getMetrics = (project: MarketingProject) => {
        if (project.metrics && Object.keys(project.metrics).length > 0) {
            return Object.entries(project.metrics).slice(0, 4).map(([key, value]) => ({
                label: key.replace(/_/g, ' '),
                value: value
            }));
        }
        return [
            { label: 'Reach', value: '1.2M+' },
            { label: 'Engagement', value: '45%' },
            { label: 'Conversion', value: '8.5%' },
            { label: 'Growth', value: '3x' }
        ];
    };

    // Brand color rotation for "Gen Z" variety
    const brandColors = [
        'var(--lime)',
        'var(--electric)',
        'var(--coral)',
        'var(--purple)'
    ];

    return (
        <section id="projects" className={styles.wrapper}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.subLabel}>Selected Work</span>
                    <h2 className={styles.title}>
                        Campaign <span className={styles.titleSpan}>Highlights</span>
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                        Transforming bold ideas into measurable results.
                        A collection of high-impact campaigns and digital experiences.
                    </p>
                </div>

                <div className={styles.streamContainer}>
                    {displayProjects.map((project, index) => {
                        const metrics = getMetrics(project);
                        const accentColor = brandColors[index % brandColors.length];

                        return (
                            <article
                                key={index}
                                className={styles.projectBlock}
                                style={{ borderColor: accentColor }}
                            >
                                <div className={styles.contentSide}>
                                    <div className={styles.projectIndex}>
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>

                                    <h3 className={styles.projectTitle}>
                                        {project.title}
                                    </h3>

                                    <div className={styles.tagsWrapper}>
                                        {project.tech_stack.slice(0, 3).map((tag, i) => (
                                            <span key={i} className={styles.techTag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className={styles.projectDesc}>
                                        {project.description}
                                    </p>

                                    <div className={styles.metricsGrid} style={{ borderColor: `${accentColor}40` }}>
                                        {metrics.slice(0, 4).map((m, i) => (
                                            <div key={i} className={styles.metricItem}>
                                                <span
                                                    className={styles.metricValue}
                                                    style={{ color: accentColor }}
                                                >
                                                    {m.value}
                                                </span>
                                                <span className={styles.metricLabel}>{m.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.actionArea}>
                                        <button
                                            className={styles.openBtn}
                                            onClick={() => setSelectedProject(project)}
                                            aria-label={`View details for ${project.title}`}
                                        >
                                            View Case Study ↗
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.imageSide}>
                                    <div
                                        className={styles.visualContainer}
                                        onClick={() => setSelectedProject(project)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={project.image_url || `https://placehold.co/800x600/F5F5F5/333?text=${encodeURIComponent(project.title)}`}
                                            alt={project.title}
                                            className={styles.projectImage}
                                            loading="lazy"
                                        />
                                        <div className={styles.overlay}></div>
                                    </div>
                                    {/* Decorative styling injected via CSS pseudo-elements using custom properties if needed */}
                                    <style jsx>{`
                                        article:nth-child(${index + 1}) .imageSide::before {
                                            background: ${accentColor};
                                            opacity: 0.1;
                                        }
                                    `}</style>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            {/* Modal - Standardized Clean Layout */}
            {selectedProject && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedProject(null)}>
                    <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedProject(null)}>
                            ×
                        </button>

                        <div className={styles.modalImageContainer}>
                            <img
                                src={selectedProject.image_url || ''}
                                className={styles.modalImg}
                                alt=""
                            />
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                            }}></div>
                            <h2 style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                color: '#fff',
                                margin: 0,
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                {selectedProject.title}
                            </h2>
                        </div>

                        <div className={styles.modalContent}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                {selectedProject.tech_stack.map((t, i) => (
                                    <span key={i} className={styles.techTag}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {selectedProject.description}
                            </p>

                            {selectedProject.long_description && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Overview</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>{selectedProject.long_description}</p>
                                </div>
                            )}

                            {selectedProject.strategy && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Strategy</h4>
                                    <p style={{ color: 'var(--text-secondary)' }}>{selectedProject.strategy}</p>
                                </div>
                            )}

                            {selectedProject.link && (
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', display: 'inline-block' }}
                                >
                                    Visit Live Site
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
