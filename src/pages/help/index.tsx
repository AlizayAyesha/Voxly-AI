import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import css from './help.module.scss';

// Icons
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

const CreditCardIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);

const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);

const MessageCircleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);

const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
    </svg>
);

const ExternalLinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
);

interface FAQItem {
    question: string;
    answer: string;
}

interface CategoryItem {
    title: string;
    description: string;
    icon: string;
}

interface UsefulLink {
    name: string;
    url: string;
    description: string;
}

const HelpPage: NextPage = () => {
    const { t } = useTranslation('help');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

    // Get data from translation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories = t('categories.items', { returnObjects: true }) as CategoryItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const faqItems = t('faq.items', { returnObjects: true }) as FAQItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usefulLinks = t('usefulLinks.items', { returnObjects: true }) as UsefulLink[];

    const handleFaqToggle = (index: number) => {
        setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
    };

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'rocket': return RocketIcon;
            case 'credit-card': return CreditCardIcon;
            case 'settings': return SettingsIcon;
            case 'grid': return GridIcon;
            case 'shield': return ShieldIcon;
            case 'users': return UsersIcon;
            default: return SettingsIcon;
        }
    };

    // Filter FAQ items based on search
    const filteredFaqs = faqItems.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />

            <div className={css.container}>
                {/* Hero Section with Search */}
                <section className={css.hero}>
                    <div className={css.heroContent}>
                        <h1 className={css.heroTitle}>{t('hero.title')}</h1>
                        <p className={css.heroSubtitle}>{t('hero.subtitle')}</p>
                        
                        <div className={css.searchBox}>
                            <div className={css.searchInputWrapper}>
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder={t('hero.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={css.searchInput}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className={css.pageWrapper}>
                    {/* Sidebar Navigation */}
                    <aside className={css.sidebar}>
                        <nav>
                            <span className={css.sidebarTitle}>Quick Links</span>
                            <ul className={css.navList}>
                                {usefulLinks.map((link, index) => (
                                    <li key={index} className={css.navItem}>
                                        <Link href={link.url} className={css.navLink}>
                                            <ChevronRightIcon />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className={css.mainContent}>
                        {/* Categories Section */}
                        <section className={css.section}>
                            <h2 className={css.sectionTitle}>{t('categories.title')}</h2>
                            <div className={css.categoriesGrid}>
                                {categories.map((category, index) => {
                                    const IconComponent = getIconComponent(category.icon);
                                    return (
                                        <div key={index} className={css.categoryCard}>
                                            <div className={css.categoryIcon}>
                                                <IconComponent />
                                            </div>
                                            <div className={css.categoryContent}>
                                                <h3>{category.title}</h3>
                                                <p>{category.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className={css.section}>
                            <h2 className={css.sectionTitle}>{t('faq.title')}</h2>
                            <div className={css.faqList}>
                                {(searchQuery ? filteredFaqs : faqItems).map((faq, index) => (
                                    <div 
                                        key={index} 
                                        className={`${css.faqItem} ${expandedFaqIndex === index ? css.expanded : ''}`}
                                    >
                                        <button 
                                            className={css.faqQuestion}
                                            onClick={() => handleFaqToggle(index)}
                                            aria-expanded={expandedFaqIndex === index}
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDownIcon />
                                        </button>
                                        <div 
                                            className={css.faqAnswer}
                                            style={{ maxHeight: expandedFaqIndex === index ? '500px' : '0' }}
                                        >
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchQuery && filteredFaqs.length === 0 && (
                                <div className={css.noResults}>
                                    <p>No results found for "{searchQuery}"</p>
                                </div>
                            )}
                        </section>

                        {/* Contact Section */}
                        <section className={css.section}>
                            <h2 className={css.sectionTitle}>{t('contact.title')}</h2>
                            <p className={css.sectionSubtitle}>{t('contact.subtitle')}</p>
                            
                            <div className={css.contactGrid}>
                                <div className={css.contactCard}>
                                    <div className={css.contactIcon}>
                                        <MailIcon />
                                    </div>
                                    <h3>{t('contact.email.title')}</h3>
                                    <p>{t('contact.email.description')}</p>
                                    <a href={`mailto:${t('contact.email.email')}`} className={css.contactLink}>
                                        {t('contact.email.email')}
                                    </a>
                                    <span className={css.responseTime}>{t('contact.email.responseTime')}</span>
                                </div>

                                <div className={css.contactCard}>
                                    <div className={css.contactIcon}>
                                        <MessageCircleIcon />
                                    </div>
                                    <h3>{t('contact.chat.title')}</h3>
                                    <p>{t('contact.chat.description')}</p>
                                    <span className={css.availableBadge}>
                                        {t('contact.chat.available')}
                                    </span>
                                </div>

                                <div className={css.contactCard}>
                                    <div className={css.contactIcon}>
                                        <UsersIcon />
                                    </div>
                                    <h3>{t('contact.social.title')}</h3>
                                    <p>{t('contact.social.description')}</p>
                                    <Link href="/chathub" className={css.contactLink}>
                                        Join Community
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Useful Links Section */}
                        <section className={css.usefulLinksSection}>
                            <h2 className={css.sectionTitle}>{t('usefulLinks.title')}</h2>
                            <div className={css.usefulLinksGrid}>
                                {usefulLinks.map((link, index) => (
                                    <Link 
                                        key={index} 
                                        href={link.url} 
                                        className={css.usefulLinkCard}
                                    >
                                        <span className={css.usefulLinkName}>{link.name}</span>
                                        <span className={css.usefulLinkDesc}>{link.description}</span>
                                        <ExternalLinkIcon />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            <Footer />
        </MainLayout>
    );
};

export default HelpPage;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['help']
);

