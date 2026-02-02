'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import {
    getAllSkills,
    getAllExperience,
    getAllProjects,
    getAllEducation,
    getAllSocialLinks,
    getProfile,
    getSiteSettings,
    getAllCertifications,
    addSkill,
    addExperience,
    addEducation,
    addSocialLink,
    addCertification,
    updateProfile,
} from '@/lib/db';
import { DEFAULT_DATA } from '@/lib/constants';
import ProfileEditor from './ProfileEditor';
import SkillsEditor from './SkillsEditor';
import ExperienceEditor from './ExperienceEditor';
import ProjectsEditor from './ProjectsEditor';
import EducationEditor from './EducationEditor';
import SocialLinksEditor from './SocialLinksEditor';
import SettingsEditor from './SettingsEditor';
import CertificationsEditor from './CertificationsEditor';
import styles from './AdminDashboard.module.css';

type Tab = 'profile' | 'skills' | 'experience' | 'projects' | 'education' | 'social' | 'certifications' | 'settings';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({});
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [profile, skills, experience, projects, education, socialLinks, settings, certifications] = await Promise.all([
            getProfile(),
            getAllSkills(),
            getAllExperience(),
            getAllProjects(),
            getAllEducation(),
            getAllSocialLinks(),
            getSiteSettings(),
            getAllCertifications(),
        ]);

        setData({ profile, skills, experience, projects, education, socialLinks, settings, certifications });
        setLoading(false);
    };

    const handleSeedData = async () => {
        if (!confirm('This will populate your database with your default resume info. Continue?')) return;
        setSeeding(true);

        try {
            // 1. Update Profile (if exists) or we might need an upsert
            if (data.profile) {
                await updateProfile({ ...DEFAULT_DATA.profile, id: data.profile.id });
            }

            // 2. Add Skills
            await Promise.all(DEFAULT_DATA.skills.map((s, i) => addSkill({ ...s, order_index: i, is_visible: true })));

            // 3. Add Experience
            await Promise.all(DEFAULT_DATA.experience.map(e => addExperience({ ...e, is_visible: true })));

            // 4. Add Education
            await Promise.all(DEFAULT_DATA.education.map((edu, i) => addEducation({ ...edu, is_visible: true, order_index: i })));

            // 5. Add Social Links
            await Promise.all(DEFAULT_DATA.socialLinks.map((sl, i) => addSocialLink({ ...sl, is_visible: true, order_index: i })));

            // 6. Add Certifications (if in DEFAULT_DATA)
            if (DEFAULT_DATA.certifications) {
                await Promise.all(DEFAULT_DATA.certifications.map((c, i) => addCertification({ ...c, order_index: i, is_visible: true })));
            }

            alert('Data seeded successfully! You can now edit it in each tab.');
            await loadData();
        } catch (error) {
            console.error('Seeding error:', error);
            alert('Error seeding data. Check console.');
        } finally {
            setSeeding(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin');
        router.refresh();
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'projects', label: 'Projects', icon: '🚀' },
        { id: 'certifications', label: 'Certifications', icon: '🏆' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'social', label: 'Social Links', icon: '🔗' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Portfolio CMS</h1>
                    <div className={styles.headerActions}>
                        <button onClick={handleSeedData} disabled={seeding} className="btn btn-secondary">
                            {seeding ? 'Seeding...' : 'Seed Default Data'}
                        </button>
                        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                            View Portfolio
                        </a>
                        <button onClick={handleSignOut} className="btn btn-ghost">
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.dashboardContent}>
                <aside className={styles.sidebar}>
                    <nav className={styles.tabNav}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className={styles.mainContent}>
                    {activeTab === 'profile' && <ProfileEditor profile={data.profile} onUpdate={loadData} />}
                    {activeTab === 'skills' && <SkillsEditor skills={data.skills} onUpdate={loadData} />}
                    {activeTab === 'experience' && <ExperienceEditor experience={data.experience} onUpdate={loadData} />}
                    {activeTab === 'projects' && <ProjectsEditor projects={data.projects} onUpdate={loadData} />}
                    {activeTab === 'certifications' && <CertificationsEditor certifications={data.certifications} onUpdate={loadData} />}
                    {activeTab === 'education' && <EducationEditor education={data.education} onUpdate={loadData} />}
                    {activeTab === 'social' && <SocialLinksEditor socialLinks={data.socialLinks} onUpdate={loadData} />}
                    {activeTab === 'settings' && <SettingsEditor settings={data.settings} onUpdate={loadData} />}
                </main>
            </div>
        </div>
    );
}
