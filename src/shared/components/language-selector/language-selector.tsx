import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { languages, popularLanguages } from 'shared/lib/i18n/languages';
import Sprite from 'shared/ui/sprite';
import clsx from 'clsx';
import css from './language-selector.module.scss';

export const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentLocale = i18n.language || 'en';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = languages.find(l => l.code === currentLocale) || languages[0];

    const changeLanguage = (locale: string) => {
        // Set the language
        i18n.changeLanguage(locale);
        
        // Redirect to the same page with the new locale
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale });
        
        setIsOpen(false);
        setSearchQuery('');
    };

    // Filter languages based on search query
    const filteredLanguages = languages.filter(lang => {
        const searchLower = searchQuery.toLowerCase();
        return (
            lang.name.toLowerCase().includes(searchLower) ||
            lang.nativeName.toLowerCase().includes(searchLower) ||
            lang.code.toLowerCase().includes(searchLower)
        );
    });

    // Group languages: popular first, then rest
    const popular = popularLanguages.filter(code => 
        languages.some(l => l.code === code)
    );
    const popularFiltered = filteredLanguages.filter(l => popular.includes(l.code));
    const otherFiltered = filteredLanguages.filter(l => !popular.includes(l.code));

    return (
        <div className={css.languageSelector} ref={dropdownRef}>
            <button 
                className={css.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
            >
                <span className={css.globe}>
                    <Sprite.Default icon="globe" />
                </span>
                <span className={css.currentLocale}>
                    {currentLanguage.nativeName}
                </span>
                <Sprite.Default 
                    icon="chevron-down" 
                    className={clsx(css.chevron, isOpen && css.chevronOpen)} 
                />
            </button>

            {isOpen && (
                <div className={css.dropdown}>
                    <div className={css.search}>
                        <Sprite.Default icon="search" className={css.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search languages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={css.searchInput}
                            autoFocus
                        />
                    </div>

                    <div className={css.content}>
                        {popularFiltered.length > 0 && (
                            <div className={css.section}>
                                <div className={css.sectionTitle}>Popular</div>
                                {popularFiltered.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={clsx(
                                            css.option,
                                            currentLocale === lang.code && css.optionActive
                                        )}
                                        onClick={() => changeLanguage(lang.code)}
                                    >
                                        <span className={css.langName}>{lang.nativeName}</span>
                                        {lang.code !== 'en' && (
                                            <span className={css.langNative}>
                                                {lang.name}
                                            </span>
                                        )}
                                        {currentLocale === lang.code && (
                                            <Sprite.Default 
                                                icon="check" 
                                                className={css.checkIcon} 
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {otherFiltered.length > 0 && (
                            <div className={css.section}>
                                <div className={css.sectionTitle}>All Languages</div>
                                <div className={css.languageGrid}>
                                    {otherFiltered.map(lang => (
                                        <button
                                            key={lang.code}
                                            className={clsx(
                                                css.option,
                                                css.optionGrid,
                                                currentLocale === lang.code && css.optionActive
                                            )}
                                            onClick={() => changeLanguage(lang.code)}
                                        >
                                            <span className={css.langName}>{lang.nativeName}</span>
                                            {lang.code !== 'en' && (
                                                <span className={css.langNative}>
                                                    {lang.name}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredLanguages.length === 0 && (
                            <div className={css.noResults}>
                                No languages found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

