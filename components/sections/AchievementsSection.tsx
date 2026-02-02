'use client';

import styles from './AchievementsSection.module.css';

interface AchievementsSectionProps {
    achievements?: string[];
}

const IMPACT_METRICS = [
    { label: 'Content Views', value: '1.5M+', emoji: '👀', color: 'lime' },
    { label: 'LinkedIn Reach', value: '1M+', emoji: '🚀', color: 'electric' },
    { label: 'Event Launches', value: '15+', emoji: '✨', color: 'coral' },
    { label: 'Digital Assets', value: '450+', emoji: '🎨', color: 'purple' },
];

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
    return (
        <section className={styles.wrapper}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.sectionBadge}>
                        <span className={styles.badgeEmoji}>📊</span>
                        Impact
                    </span>
                    <h2 className={styles.heading}>
                        Numbers That <span className="text-gradient-lime">Matter</span>
                    </h2>
                </div>

                <div className={styles.grid}>
                    {IMPACT_METRICS.map((item, index) => (
                        <div key={index} className={`${styles.card} ${styles[item.color]}`}>
                            <div className={styles.cardEmoji}>{item.emoji}</div>
                            <div className={styles.value}>{item.value}</div>
                            <div className={styles.label}>{item.label}</div>
                            <div className={styles.glow}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
