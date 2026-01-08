import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import css from './docs.module.scss';

// Icons
const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
);

const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
);

const CodeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const UsersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const RocketIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
);

const GitBranchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M18 9a9 9 0 0 1-9 9"/>
    </svg>
);

const LightbulbIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const MessageCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);

const GitPullRequestIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/>
        <circle cx="6" cy="6" r="3"/>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
        <line x1="6" y1="9" x2="6" y2="21"/>
    </svg>
);

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const SparklesIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
        <path d="M5 19l3-7 2 2-3 7-2-2z"/>
        <path d="M3 14l4 4 6-6"/>
    </svg>
);

const ExternalLinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
);

const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);

interface NavItem {
    key: string;
    label: string;
    icon: React.FC;
    href: string;
}

const DocsPage: NextPage = () => {
    const { t } = useTranslation('docs');

    // Navigation items for sidebar
    const navItems: NavItem[] = [
        { key: 'about', label: t('about.title'), icon: InfoIcon, href: '#about' },
        { key: 'openSource', label: t('openSource.title'), icon: CodeIcon, href: '#open-source' },
        { key: 'contribute', label: t('contribute.title'), icon: HeartIcon, href: '#contribute' },
        { key: 'features', label: t('features.title'), icon: LightbulbIcon, href: '#features' },
        { key: 'community', label: t('community.title'), icon: UsersIcon, href: '#community' },
    ];

    // Get feature items from translation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featureItems = t('about.features.items', { returnObjects: true }) as string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contributionWays = t('contribute.ways.items', { returnObjects: true }) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contributionSteps = t('contribute.steps.items', { returnObjects: true }) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requiredFeatures = t('features.required.items', { returnObjects: true }) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const featureIdeas = t('features.ideas.items', { returnObjects: true }) as string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const engagementItems = t('community.engagement.items', { returnObjects: true }) as string[];

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />

            <div className={css.container}>
                <div className={css.pageWrapper}>
                    {/* Sidebar Navigation */}
                    <aside className={css.sidebar}>
                        <nav>
                            <span className={css.sidebarTitle}>Contents</span>
                            <ul className={css.navList}>
                                {navItems.map((item) => (
                                    <li key={item.key} className={css.navItem}>
                                        <Link href={item.href} className={css.navLink}>
                                            <item.icon />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className={css.mainContent}>
                        {/* Hero Section */}
                        <section className={css.hero}>
                            <div className={css.heroContent}>
                                <h1 className={css.heroTitle}>{t('hero.title')}</h1>
                                <p className={css.heroSubtitle}>{t('hero.subtitle')}</p>
                                <div className={css.heroTagline}>
                                    <SparklesIcon />
                                    {t('hero.tagline')}
                                </div>
                            </div>
                        </section>

                        {/* About Section */}
                        <section id="about" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('about.title')}</h2>
                            <p className={css.sectionIntro}>{t('about.content')}</p>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '32px', marginBottom: '16px' }}>
                                {t('about.features.title')}
                            </h3>
                            <div className={css.featuresGrid}>
                                {featureItems.map((feature, index) => (
                                    <div key={index} className={css.featureCard}>
                                        <CheckCircleIcon />
                                        <h4>{feature}</h4>
                                    </div>
                                ))}
                            </div>

                            <div className={css.noteBox}>
                                <p>{t('about.technology.description')}</p>
                            </div>
                        </section>

                        {/* Open Source Section */}
                        <section id="open-source" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('openSource.title')}</h2>
                            
                            <div className={css.featureList}>
                                <div className={css.featureItem}>
                                    <div className={css.featureItemIcon}>
                                        <CodeIcon />
                                    </div>
                                    <div className={css.featureItemContent}>
                                        <h4>{t('openSource.license.title')}</h4>
                                        <p>{t('openSource.license.content')}</p>
                                    </div>
                                </div>
                                
                                <div className={css.featureItem}>
                                    <div className={css.featureItemIcon}>
                                        <GitBranchIcon />
                                    </div>
                                    <div className={css.featureItemContent}>
                                        <h4>{t('openSource.repository.title')}</h4>
                                        <p>{t('openSource.repository.content')}</p>
                                    </div>
                                </div>
                                
                                <div className={css.featureItem}>
                                    <div className={css.featureItemIcon}>
                                        <HeartIcon />
                                    </div>
                                    <div className={css.featureItemContent}>
                                        <h4>{t('openSource.philosophy.title')}</h4>
                                        <p>{t('openSource.philosophy.content')}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contribute Section */}
                        <section id="contribute" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('contribute.title')}</h2>
                            <p className={css.sectionIntro}>{t('contribute.intro')}</p>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '32px', marginBottom: '16px' }}>
                                {t('contribute.ways.title')}
                            </h3>
                            <div className={css.contributionGrid}>
                                {contributionWays.map((way: { title: string; description: string }, index: number) => (
                                    <div key={index} className={css.contributionCard}>
                                        <div className={css.contributionIcon}>
                                            {index === 0 && <CodeIcon />}
                                            {index === 1 && <GlobeIcon />}
                                            {index === 2 && <BookIcon />}
                                            {index === 3 && <RocketIcon />}
                                            {index === 4 && <LightbulbIcon />}
                                        </div>
                                        <div className={css.contributionContent}>
                                            <h4>{way.title}</h4>
                                            <p>{way.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '48px', marginBottom: '16px' }}>
                                {t('contribute.steps.title')}
                            </h3>
                            <div className={css.stepsList}>
                                {contributionSteps.map((step: { title: string; description: string }, index: number) => (
                                    <div key={index} className={css.step}>
                                        <h4 className={css.stepTitle}>{step.title}</h4>
                                        <p className={css.stepContent}>{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            <div className={css.noteBox}>
                                <p>{t('contribute.guidelines.content')}</p>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section id="features" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('features.title')}</h2>
                            <p className={css.sectionIntro}>{t('features.intro')}</p>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '32px', marginBottom: '16px' }}>
                                {t('features.required.title')}
                            </h3>
                            <p style={{ marginBottom: '16px', color: '#5a5a7a' }}>{t('features.required.description')}</p>
                            <div className={css.featureList}>
                                {requiredFeatures.map((feature: { title: string; description: string }, index: number) => (
                                    <div key={index} className={css.featureItem}>
                                        <div className={css.featureItemIcon}>
                                            <RocketIcon />
                                        </div>
                                        <div className={css.featureItemContent}>
                                            <h4>{feature.title}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '48px', marginBottom: '16px' }}>
                                {t('features.ideas.title')}
                            </h3>
                            <p style={{ marginBottom: '16px', color: '#5a5a7a' }}>{t('features.ideas.description')}</p>
                            <div className={css.ideasList}>
                                {featureIdeas.map((idea, index) => (
                                    <span key={index} className={css.ideaTag}>
                                        <SparklesIcon />
                                        {idea}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Community Section */}
                        <section id="community" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('community.title')}</h2>
                            <p className={css.sectionIntro}>{t('community.intro')}</p>

                            <div className={css.communityGrid}>
                                <div className={css.communityCard}>
                                    <MessageCircleIcon />
                                    <h4>{t('community.share.title')}</h4>
                                    <p>{t('community.share.description')}</p>
                                    <a href={`mailto:${t('community.contact.email')}`} className={css.emailLink}>
                                        <MailIcon />
                                        {t('community.contact.email')}
                                    </a>
                                </div>

                                <div className={css.communityCard}>
                                    <MailIcon />
                                    <h4>{t('community.contact.title')}</h4>
                                    <p>{t('community.contact.description')}</p>
                                    <p style={{ fontSize: '14px', color: '#6C63FF', fontWeight: 600 }}>
                                        {t('community.contact.note')}
                                    </p>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#2d1b69', marginTop: '48px', marginBottom: '16px' }}>
                                {t('community.engagement.title')}
                            </h3>
                            <div className={css.engagementList}>
                                {engagementItems.map((item, index) => (
                                    <div key={index} className={css.engagementItem}>
                                        <ChevronRightIcon />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <div className={css.ctaSection}>
                            <h3 className={css.ctaTitle}>{t('footer.cta')}</h3>
                            <p className={css.ctaDescription}>{t('footer.startButton')}</p>
                            <div className={css.ctaButtons}>
                                <Link href="/start-talking" className={`${css.ctaButton} ${css.primary}`}>
                                    <RocketIcon />
                                    {t('footer.startButton')}
                                </Link>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`${css.ctaButton} ${css.secondary}`}>
                                    <GitPullRequestIcon />
                                    {t('footer.viewCode')}
                                </a>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </MainLayout>
    );
};

export default DocsPage;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['docs']
);

