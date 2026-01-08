import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import css from './voxly-help.module.scss';

// SVG Icons as components
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

const StarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

const QuestionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const WrenchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
);

const LightbulbIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="18" x2="15" y2="18"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
);

const SupportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

const DocumentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

interface Category {
    key: string;
    title: string;
    description: string;
    icon: React.FC;
    url: string;
}

const VoxlyHelp: NextPage = () => {
    const { t } = useTranslation('voxly-help');
    const [searchQuery, setSearchQuery] = useState('');

    const categories: Category[] = [
        {
            key: 'gettingStarted',
            title: t('categories.gettingStarted.title'),
            description: t('categories.gettingStarted.description'),
            icon: RocketIcon,
            url: '/voxly-help/getting-started'
        },
        {
            key: 'features',
            title: t('categories.features.title'),
            description: t('categories.features.description'),
            icon: StarIcon,
            url: '/voxly-help/features'
        },
        {
            key: 'faq',
            title: t('categories.faq.title'),
            description: t('categories.faq.description'),
            icon: QuestionIcon,
            url: '/voxly-help/faq'
        },
        {
            key: 'troubleshooting',
            title: t('categories.troubleshooting.title'),
            description: t('categories.troubleshooting.description'),
            icon: WrenchIcon,
            url: '/voxly-help/troubleshooting'
        },
        {
            key: 'tips',
            title: t('categories.tips.title'),
            description: t('categories.tips.description'),
            icon: LightbulbIcon,
            url: '/voxly-help/tips'
        },
        {
            key: 'contact',
            title: t('categories.contact.title'),
            description: t('categories.contact.description'),
            icon: SupportIcon,
            url: '/voxly-help/contact'
        }
    ];

    const quickLinks = [
        { text: t('quickLinks.startConversation'), url: '/start-talking', icon: MessageIcon },
        { text: t('quickLinks.languageSettings'), url: '/languages', icon: DocumentIcon },
        { text: t('quickLinks.voiceSettings'), url: '/start-talking#voice', icon: DocumentIcon },
        { text: t('quickLinks.progressTracking'), url: '/dashboard', icon: DocumentIcon }
    ];

    const popularArticles = [
        { text: t('popularArticles.howToStart'), url: '/voxly-help/getting-started#start-conversation' },
        { text: t('popularArticles.voiceNotWorking'), url: '/voxly-help/troubleshooting#voice-issues' },
        { text: t('popularArticles.changeLanguage'), url: '/voxly-help/getting-started#change-language' },
        { text: t('popularArticles.quizFeature'), url: '/voxly-help/features#quizzes' }
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Search query:', searchQuery);
    };

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />
            
            <div className={css.container}>
                {/* Hero Section */}
                <section className={css.hero}>
                    <div className={css.heroContent}>
                        <h1 className={css.title}>{t('hero.title')}</h1>
                        <p className={css.subtitle}>{t('hero.subtitle')}</p>
                        
                        <form className={css.searchContainer} onSubmit={handleSearch}>
                            <input
                                type="text"
                                className={css.searchInput}
                                placeholder={t('hero.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className={css.searchButton}>
                                <SearchIcon />
                            </button>
                        </form>
                    </div>
                </section>

                {/* Main Content */}
                <main className={css.mainContent}>
                    {/* Categories Section */}
                    <section className={css.categoriesSection}>
                        <h2 className={css.sectionTitle}>Browse by Topic</h2>
                        <p className={css.sectionSubtitle}>Find the help you need in these categories</p>
                        
                        <div className={css.categoriesGrid}>
                            {categories.map((category) => (
                                <Link 
                                    key={category.key} 
                                    href={category.url}
                                    className={css.categoryCard}
                                >
                                    <div className={css.categoryIcon}>
                                        <category.icon />
                                    </div>
                                    <div className={css.categoryContent}>
                                        <h3 className={css.categoryTitle}>{category.title}</h3>
                                        <p className={css.categoryDescription}>{category.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Quick Links Section */}
                    <section className={css.quickLinksSection}>
                        <h2 className={css.sectionTitle}>{t('quickLinks.title')}</h2>
                        <div className={css.quickLinksGrid}>
                            {quickLinks.map((link, index) => (
                                <Link key={index} href={link.url} className={css.quickLink}>
                                    <link.icon />
                                    <span>{link.text}</span>
                                    <ChevronRightIcon />
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Popular Articles Section */}
                    <section className={css.popularArticles}>
                        <h2 className={css.sectionTitle}>{t('popularArticles.title')}</h2>
                        <div className={css.articlesList}>
                            {popularArticles.map((article, index) => (
                                <Link key={index} href={article.url} className={css.articleLink}>
                                    <span className={css.articleTitle}>
                                        <DocumentIcon />
                                        {article.text}
                                    </span>
                                    <span className={css.readMore}>
                                        Read <ArrowRightIcon />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className={css.contactSection}>
                        <h2 className={css.contactTitle}>{t('footer.needMoreHelp')}</h2>
                        <p className={css.contactDescription}>{t('footer.contactDescription')}</p>
                        <Link href="/voxly-help/contact" className={css.contactButton}>
                            <MessageIcon />
                            {t('footer.contactButton')}
                        </Link>
                    </section>
                </main>
            </div>

            <Footer />
        </MainLayout>
    );
};

export default VoxlyHelp;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['voxly-help']
);

