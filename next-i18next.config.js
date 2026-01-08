/** @type {import('next-i18next').UserConfig} */

// Reduced language list for Vercel compatibility (under 100 limit)
const languages = [
    'en', // English
    'ar', // Arabic
    'zh', // Chinese
    'nl', // Dutch
    'fr', // French
    'de', // German
    'hi', // Hindi
    'id', // Indonesian
    'it', // Italian
    'ja', // Japanese
    'ko', // Korean
    'pl', // Polish
    'pt', // Portuguese
    'ru', // Russian
    'es', // Spanish
    'sv', // Swedish
    'tr', // Turkish
    'uk', // Ukrainian
    'vi', // Vietnamese
    'bn', // Bengali
    'da', // Danish
    'fi', // Finnish
    'el', // Greek
    'he', // Hebrew
    'no', // Norwegian
    'ro', // Romanian
    'th', // Thai
    'cs', // Czech
    'hu', // Hungarian
    'sk', // Slovak
    'bg', // Bulgarian
    'hr', // Croatian
    'sl', // Slovenian
    'sr', // Serbian
    'uk', // Ukrainian
    'ca', // Catalan
    'fa', // Persian
    'tl', // Tagalog
    'uk', // Ukrainian
    'ms', // Malay
    'th', // Thai
    'uk', // Ukrainian
    'vi', // Vietnamese
    'cs', // Czech
];

module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: languages,
    },
    localePath: typeof window === 'undefined'
        ? require('path').resolve('./public/locales')
        : '/locales',
    fallbacks: {
        'pt-BR': 'pt',
        'zh-CN': 'zh',
        'zh-TW': 'zh',
    },
}

