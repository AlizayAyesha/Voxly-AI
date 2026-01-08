import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import css from './getting-started.module.scss';

// Icons
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
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

const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

const LayoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
);

const LightbulbIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

const GettingStartedPage: NextPage = () => {
    const { t } = useTranslation('voxly-help-getting-started');

    const navItems = [
        { key: 'welcome', label: 'Welcome', icon: HomeIcon, href: '#welcome' },
        { key: 'firstConversation', label: 'First Conversation', icon: RocketIcon, href: '#start-conversation' },
        { key: 'changeLanguage', label: 'Change Language', icon: GlobeIcon, href: '#change-language' },
        { key: 'interface', label: 'Interface', icon: LayoutIcon, href: '#interface' },
        { key: 'tips', label: 'Tips', icon: LightbulbIcon, href: '#tips' }
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const steps = t('sections.firstConversation.steps', { returnObjects: true }) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tips = t('sections.tips.items', { returnObjects: true }) as any[];

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
                        {/* Hero */}
                        <section className={css.hero}>
                            <h1 className={css.title}>{t('hero.title')}</h1>
                            <p className={css.subtitle}>{t('hero.subtitle')}</p>
                        </section>

                        {/* Welcome Section */}
                        <section id="welcome" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('sections.welcome.title')}</h2>
                            <div className={css.sectionContent}>
                                <p>{t('sections.welcome.content')}</p>
                            </div>
                        </section>

                        {/* First Conversation Steps */}
                        <section id="start-conversation" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('sections.firstConversation.title')}</h2>
                            <div className={css.stepsList}>
                                {steps.map((step: {title: string; content: string}, index: number) => (
                                    <div key={index} className={css.step}>
                                        <h3 className={css.stepTitle}>{step.title}</h3>
                                        <p className={css.stepContent}>{step.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Change Language */}
                        <section id="change-language" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('sections.changeLanguage.title')}</h2>
                            <div className={css.sectionContent}>
                                <p>{t('sections.changeLanguage.content')}</p>
                            </div>
                            <div className={css.noteBox}>
                                <p>{t('sections.changeLanguage.note')}</p>
                            </div>
                        </section>

                        {/* Understanding Interface */}
                        <section id="interface" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('sections.understandingInterface.title')}</h2>
                            <div className={css.sectionContent}>
                                <p>{t('sections.understandingInterface.content')}</p>
                            </div>
                            <div className={css.elementsGrid}>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {(['0', '1', '2', '3', '4'] as const).map((index) => (
                                    <div key={index} className={css.elementCard}>
                                        <h4>{t(`sections.understandingInterface.elements.${index}.name`)}</h4>
                                        <p>{t(`sections.understandingInterface.elements.${index}.description`)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tips Section */}
                        <section id="tips" className={css.section}>
                            <h2 className={css.sectionTitle}>{t('sections.tips.title')}</h2>
                            <div className={css.tipsList}>
                                {tips.map((tip: string, index: number) => (
                                    <div key={index} className={css.tipItem}>
                                        <StarIcon />
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Next Steps */}
                        <div className={css.nextSteps}>
                            <Link href="/voxly-help/features" className={css.nextStepLink}>
                                <ArrowRightIcon />
                                {t('nextSteps.exploreFeatures')}
                            </Link>
                            <Link href="/voxly-help/faq" className={css.nextStepLink}>
                                <ArrowRightIcon />
                                {t('nextSteps.viewFaq')}
                            </Link>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </MainLayout>
    );
};

export default GettingStartedPage;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['voxly-help-getting-started']
);

