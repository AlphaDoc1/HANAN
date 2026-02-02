'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
    profile: {
        name: string;
        title: string | null;
        bio: string | null;
        image_url: string | null;
        resume_url: string | null;
    } | null;
    socialLinks: Array<{
        platform: string;
        url: string;
        icon_name: string | null;
    }>;
}

export default function HeroSection({ profile, socialLinks }: HeroSectionProps) {
    if (!profile) {
        return null;
    }

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>
            </div>

            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <div className={styles.badge}>
                            <span>●</span> Open to Collab
                        </div>

                        <h1 className={styles.name}>
                            {profile.name.split(' ').map((word, i, arr) => (
                                <span key={i}>
                                    {word}
                                    {i === arr.length - 1 ? '' : ' '}
                                </span>
                            ))}
                        </h1>

                        <div className={styles.titleWrapper}>
                            <h2 className={styles.title}>
                                Marketing <span className={styles.amp}>&</span> Content
                            </h2>
                            <h2 className={styles.title}>
                                That Actually <span className={styles.highlight}>Hits</span> 🎯
                            </h2>
                        </div>

                        <p className={styles.bio}>
                            {profile.bio || "I build brands that people actually care about. Strategy + content + culture = growth that matters."}
                        </p>

                        <div className={styles.quickStats}>
                            <div className={styles.quickStat}>
                                <span className={styles.statNumber}>1.5M+</span>
                                <span className={styles.statLabel}>Reach</span>
                            </div>
                            <div className={styles.quickStat}>
                                <span className={styles.statNumber}>450+</span>
                                <span className={styles.statLabel}>Assets</span>
                            </div>
                            <div className={styles.quickStat}>
                                <span className={styles.statNumber}>15+</span>
                                <span className={styles.statLabel}>Launches</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <a href="#projects" className="btn btn-primary">
                                See My Work ✨
                            </a>
                            <a href="#contact" className="btn btn-secondary">
                                Let's Talk
                            </a>
                        </div>

                        {socialLinks.length > 0 && (
                            <div className={styles.socialLinks}>
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.platform}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                        title={link.platform}
                                    >
                                        <span className={styles.platformName}>{link.platform}</span>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.heroImage}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.imageContainer}>
                                {profile.image_url ? (
                                    <Image
                                        src={profile.image_url}
                                        alt={profile.name}
                                        width={500}
                                        height={600}
                                        className={styles.profileImage}
                                        priority
                                    />
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <span>{profile.name.charAt(0)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span className={styles.scrollText}>Scroll to Explore</span>
                <a href="#about" aria-label="Scroll down">
                    <span className={styles.scrollLine}></span>
                </a>
            </div>
        </section>
    );
}
