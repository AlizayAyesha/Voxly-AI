/** @type {import('next-i18next').UserConfig} */

// 100+ languages supported
const languages = [
    'en', // English
    'af', // Afrikaans
    'am', // Amharic
    'ar', // Arabic
    'as', // Assamese
    'az', // Azerbaijani
    'be', // Belarusian
    'bg', // Bulgarian
    'bn', // Bengali
    'bs', // Bosnian
    'ca', // Catalan
    'cs', // Czech
    'cy', // Welsh
    'da', // Danish
    'de', // German
    'el', // Greek
    'eo', // Esperanto
    'es', // Spanish
    'et', // Estonian
    'eu', // Basque
    'fa', // Persian
    'fi', // Finnish
    'fil', // Filipino
    'fj', // Fijian
    'fo', // Faroese
    'fr', // French
    'fy', // Frisian
    'ga', // Irish
    'gd', // Scottish Gaelic
    'gl', // Galician
    'gu', // Gujarati
    'ha', // Hausa
    'haw', // Hawaiian
    'he', // Hebrew
    'hi', // Hindi
    'hr', // Croatian
    'ht', // Haitian Creole
    'hu', // Hungarian
    'hy', // Armenian
    'id', // Indonesian
    'ig', // Igbo
    'is', // Icelandic
    'it', // Italian
    'ja', // Japanese
    'ka', // Georgian
    'kk', // Kazakh
    'km', // Khmer
    'kn', // Kannada
    'ko', // Korean
    'ku', // Kurdish
    'ky', // Kyrgyz
    'la', // Latin
    'lb', // Luxembourgish
    'lo', // Lao
    'lt', // Lithuanian
    'lv', // Latvian
    'mg', // Malagasy
    'mi', // Maori
    'mk', // Macedonian
    'ml', // Malayalam
    'mn', // Mongolian
    'mr', // Marathi
    'ms', // Malay
    'mt', // Maltese
    'my', // Burmese
    'ne', // Nepali
    'nl', // Dutch
    'no', // Norwegian
    'or', // Odia
    'pa', // Punjabi
    'pl', // Polish
    'ps', // Pashto
    'pt', // Portuguese
    'qu', // Quechua
    'ro', // Romanian
    'ru', // Russian
    'rw', // Kinyarwanda
    'sa', // Sanskrit
    'sd', // Sindhi
    'si', // Sinhala
    'sk', // Slovak
    'sl', // Slovenian
    'sm', // Samoan
    'sn', // Shona
    'so', // Somali
    'sq', // Albanian
    'sr', // Serbian
    'st', // Sesotho
    'su', // Sundanese
    'sv', // Swedish
    'sw', // Swahili
    'ta', // Tamil
    'te', // Telugu
    'tg', // Tajik
    'th', // Thai
    'ti', // Tigrinya
    'tk', // Turkmen
    'tl', // Tagalog
    'tn', // Setswana
    'to', // Tongan
    'tr', // Turkish
    'tt', // Tatar
    'ug', // Uyghur
    'uk', // Ukrainian
    'ur', // Urdu
    'uz', // Uzbek
    'vi', // Vietnamese
    'wo', // Wolof
    'xh', // Xhosa
    'yi', // Yiddish
    'yo', // Yoruba
    'zh', // Chinese
    'zu', // Zulu
];

module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: languages,
        reloadOnPrerender: process.env.NODE_ENV === 'development'
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
