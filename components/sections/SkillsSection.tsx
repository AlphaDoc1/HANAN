'use client';

import styles from './SkillsSection.module.css';

interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency_level: number | null;
}

interface SkillsSectionProps {
    skills: Skill[];
}

const CATEGORY_ICONS: Record<string, string> = {
    'Marketing': '🚀',
    'Content Creation': '🎨',
    'Social Media': '📱',
    'Analytics': '📈',
    'Strategy': '🎯',
    'Design': '✨',
    'Tools': '🛠️',
    'General': '⚡'
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
    if (!skills || skills.length === 0) return null;

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const cat = skill.category || 'General';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <section id="skills" className="section bg-alt" style={{ paddingBottom: '2rem', paddingTop: '2rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div className={styles.toolkitBadge}>
                        <span>🧬</span> The DNA
                    </div>
                    <h2 className="statement" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', marginBottom: '1rem' }}>
                        Creative <span className="text-gradient-lime">Arsenal</span>
                    </h2>
                </div>

                <div className={styles.scrollContainer}>
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category} className={styles.trackWrapper}>
                            <div className={styles.categoryLabel}>
                                {CATEGORY_ICONS[category] || '⚡'} {category}
                            </div>

                            <div className={styles.marqueeContainer}>
                                <div className={styles.marqueeTrack}>
                                    {categorySkills.map((skill) => (
                                        <div key={skill.id} className={styles.skillSticker}>
                                            <div className={styles.iconBox}>
                                                {/* Use first letter as icon */}
                                                {skill.name.charAt(0)}
                                            </div>
                                            <span className={styles.skillName}>
                                                {skill.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
