import React, { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import css from './language-selector-voxly.module.scss';
import { languages as allLanguages, popularLanguages } from 'shared/lib/i18n/languages';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag?: string;
}

interface LanguageSelectorVoxlyProps {
    value: string;
    onChange: (language: string) => void;
    disabled?: boolean;
    className?: string;
}

// Flag emojis for popular languages
const languageFlags: Record<string, string> = {
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    pt: '🇧🇷',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ru: '🇷🇺',
    ar: '🇸🇦',
    hi: '🇮🇳',
    en: '🇬🇧',
    nl: '🇳🇱',
    pl: '🇵🇱',
    tr: '🇹🇷',
    sv: '🇸🇪',
    th: '🇹🇭',
    vi: '🇻🇳',
    uk: '🇺🇦',
    ur: '🇵🇰',
};

// Build a languages list from the canonical list, injecting flags when available
const languagesData: Language[] = allLanguages.map(l => ({
    ...l,
    flag: languageFlags[l.code] || ''
}));

export const LanguageSelectorVoxly: React.FC<LanguageSelectorVoxlyProps> = ({
    value,
    onChange,
    disabled = false,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const currentLanguage = useMemo(() => 
        languagesData.find(l => l.code === value) || languagesData[0],
        [value]
    );

    // Filter languages based on search (use the full list)
    const filteredLanguages = useMemo(() => {
        if (!searchQuery) return languagesData;
        const query = searchQuery.toLowerCase();
        return languagesData.filter(lang =>
            lang.name.toLowerCase().includes(query) ||
            lang.nativeName.toLowerCase().includes(query) ||
            lang.code.toLowerCase().includes(query)
        );
    }, [searchQuery]);

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

    // Position dropdown
    useEffect(() => {
        if (isOpen && buttonRef.current && dropdownRef.current) {
            const button = buttonRef.current.getBoundingClientRect();
            const dropdown = dropdownRef.current;
            
            dropdown.style.left = '50%';
            dropdown.style.transform = 'translateX(-50%)';
        }
    }, [isOpen]);

    const handleLanguageSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
        setSearchQuery('');
    };

    // compute popular vs other (using shared popularLanguages order)
    const popularCodes = popularLanguages.filter(code => languagesData.some(l => l.code === code));
    const popularFiltered = filteredLanguages.filter(l => popularCodes.includes(l.code));
    const otherFiltered = filteredLanguages.filter(l => !popularCodes.includes(l.code));

    return (
        <div className={clsx(css.container, className)} ref={dropdownRef}>
            <button
                ref={buttonRef}
                className={clsx(css.trigger, isOpen && css.triggerOpen, disabled && css.disabled)}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className={css.flag}>{currentLanguage.flag}</span>
                <span className={css.languageName}>{currentLanguage.nativeName}</span>
                <span className={css.chevron}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className={css.dropdown}>
                    <div className={css.search}>
                        <svg className={css.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
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
                                            currentLanguage.code === lang.code && css.optionActive
                                        )}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                    >
                                        <span className={css.langName}>{lang.nativeName}</span>
                                        {lang.code !== 'en' && (
                                            <span className={css.langNative}>{lang.name}</span>
                                        )}
                                        {currentLanguage.code === lang.code && (
                                            <svg className={css.checkIcon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
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
                                                currentLanguage.code === lang.code && css.optionActive
                                            )}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                        >
                                            <span className={css.langName}>{lang.nativeName}</span>
                                            {lang.code !== 'en' && (
                                                <span className={css.langNative}>{lang.name}</span>
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

export default LanguageSelectorVoxly;

