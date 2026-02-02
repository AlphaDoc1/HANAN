import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import ContactSection from '@/components/sections/ContactSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import {
  getProfile,
  getSkills,
  getExperience,
  getProjects,
  getEducation,
  getSocialLinks,
  getSiteSettings,
  getCertifications
} from '@/lib/db';

import { DEFAULT_DATA } from '@/lib/constants';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  let dbProfile = null;
  let dbSkills: any[] = [];
  let dbExperiences: any[] = [];
  let dbProjects: any[] = [];
  let dbEducation: any[] = [];
  let dbSocialLinks: any[] = [];
  let dbSettings: any = null;
  let dbCertifications: any[] = [];

  try {
    // Fetch all portfolio data in parallel
    const [p, s, ex, pr, ed, sl, set, certs] = await Promise.all([
      getProfile(),
      getSkills(),
      getExperience(),
      getProjects(),
      getEducation(),
      getSocialLinks(),
      getSiteSettings(),
      getCertifications(),
    ]);
    dbProfile = p;
    dbSkills = s;
    dbExperiences = ex;
    dbProjects = pr;
    dbEducation = ed;
    dbSocialLinks = sl;
    dbSettings = set;
    dbCertifications = certs;
  } catch (error) {
    console.error('Database fetch error, using fallbacks:', error);
  }

  // Use DB data if available, otherwise fallback to DEFAULT_DATA
  const profile = dbProfile || DEFAULT_DATA.profile;
  const skills = dbSkills && dbSkills.length > 0 ? dbSkills : DEFAULT_DATA.skills.map((s, i) => ({
    ...s, id: `s-${i}`, proficiency_level: 5, order_index: i, is_visible: true, created_at: '', updated_at: ''
  }));
  const experiences = dbExperiences && dbExperiences.length > 0 ? dbExperiences : DEFAULT_DATA.experience.map((e, i) => ({
    ...e, id: `e-${i}`, is_visible: true, start_date: e.start_date, achievements: e.achievements || [],
    technologies: [], logo_url: null, created_at: '', updated_at: ''
  }));
  const projects = dbProjects && dbProjects.length > 0 ? dbProjects : DEFAULT_DATA.projects.map((p, i) => ({
    ...p, id: `p-${i}`, is_visible: true, created_at: '', updated_at: ''
  }));
  const education = dbEducation && dbEducation.length > 0 ? dbEducation : DEFAULT_DATA.education.map((edu, i) => ({
    ...edu, id: `edu-${i}`, is_visible: true, location: null, grade: null, description: null, achievements: [],
    logo_url: null, created_at: '', updated_at: ''
  }));
  const socialLinks = dbSocialLinks && dbSocialLinks.length > 0 ? dbSocialLinks : DEFAULT_DATA.socialLinks.map((sl, i) => ({
    ...sl, id: `sl-${i}`, is_visible: true, order_index: i, created_at: '', updated_at: ''
  }));
  const certifications = dbCertifications && dbCertifications.length > 0 ? dbCertifications : DEFAULT_DATA.certifications;
  const settings = dbSettings || {};

  const defaultOrder = ['hero', 'achievements', 'about', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact'];
  const sectionsOrder = settings.sections_order || defaultOrder;

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      case 'hero':
        return <HeroSection key="hero" profile={profile} socialLinks={socialLinks} />;
      case 'achievements':
        return <AchievementsSection key="achievements" />;
      case 'about':
        return (
          <section key="about" id="about" className="section bg-gradient" style={{ paddingBottom: '2rem' }}>
            <div className="container">
              <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 1.25rem',
                  background: 'rgba(244, 63, 94, 0.1)',
                  color: 'var(--coral)',
                  border: '2px solid var(--coral)',
                  borderRadius: '100px',
                  fontSize: '0.8125rem',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '3rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💡</span>
                  What I Do
                </div>

                <h2 style={{
                  fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                  fontWeight: '900',
                  lineHeight: '1',
                  marginBottom: '2rem',
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-display)'
                }}>
                  I Build Brands That{' '}
                  <span className="text-gradient-lime">Actually Grow</span>
                </h2>

                <p style={{
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  maxWidth: '800px',
                  margin: '0 auto 3rem',
                  fontWeight: '500'
                }}>
                  {profile?.bio || 'Marketing that understands culture. Content that people actually want to see. Strategy that drives real growth. No fluff, just results.'}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: '3rem'
                }}>
                  <span className="badge badge-lime">🎯 Strategy</span>
                  <span className="badge badge-electric">📱 Content</span>
                  <span className="badge badge-coral">📈 Growth</span>
                  <span className="badge badge-purple">🔥 Culture</span>
                </div>
              </div>
            </div>
          </section>
        );
      case 'skills':
        return skills.length > 0 ? <SkillsSection key="skills" skills={skills} /> : null;
      case 'experience':
        return experiences.length > 0 ? <ExperienceSection key="experience" experiences={experiences} /> : null;
      case 'projects':
        return projects.length > 0 ? <ProjectsSection key="projects" projects={projects} /> : null;
      case 'education':
        return education.length > 0 ? <EducationSection key="education" education={education} /> : null;
      case 'certifications':
        return <CertificationsSection key="certifications" certifications={certifications} />;
      case 'contact':
        return <ContactSection key="contact" profile={profile} socialLinks={socialLinks} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <main>
        {sectionsOrder.map((section: string) => renderSection(section))}
      </main>

      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p style={{ margin: 0, opacity: 0.6, fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} {profile?.name || 'Portfolio'}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
