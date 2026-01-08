import React from 'react';
import styles from './language-selector-voxly.module.scss';

export interface Language {
    code: string;
    name: string;
    nativeName: string;
}

interface LanguageSelectorVoxlyProps {
    value: string;
    onChange: (code: string) => void;
    disabled?: boolean;
    className?: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export const LanguageSelectorVoxly: React.FC<LanguageSelectorVoxlyProps> = ({
    value,
    onChange,
    disabled = false,
    className
}) => {
    const selectedLanguage = languages.find(lang => lang.code === value) || languages[0];

    return (
        <div className={`${styles.selector} ${disabled ? styles.disabled : ''} ${className || ''}`}>
            <div className={styles.flagIcon}>
                {getFlagEmoji(value)}
            </div>
            
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={styles.select}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                    </option>
                ))}
            </select>
            
            <div className={styles.chevron}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
};

// Helper function to get flag emoji from language code
function getFlagEmoji(langCode: string): string {
    const codePoints = langCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export default LanguageSelectorVoxly;

