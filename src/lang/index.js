import { createI18n } from 'vue-i18n';
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';
import zbCN from 'vant/es/locale/lang/zh-CN';

import enLocale from './en/index';
import cnLocale from './cn/index';
import thLocale from './th/index';
import viLocale from './vi/index';
import { session } from '@/util/storage';

const messages = {
    en: {
        ...enLocale
    },
    zh: {
        ...cnLocale
    },
    th: {
        ...thLocale
    },
    vi: {
        ...viLocale
    }
};

Locale.use('en-US', zbCN);

const language = session.get('language');

// if (lang === 'zh') {
//     Locale.use('en-US', zbCN);
// } else if (lang === 'en') {
//     Locale.use('en-US', enUS);
// } else if (lang === 'th') {
//     Locale.use('en-US', enUS);
// } else if (lang === 'vi') {
//     Locale.use('en-US', enUS);
// }

const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    messages,
    datetimeFormats: {
        zh: {
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        }
    },
    silentTranslationWarn: true
});

export function setI18nLanguage(lang) {
    i18n.locale = lang;
    document.querySelector('html').setAttribute('lang', lang);
    // if (lang === 'ar') {
    //   document.querySelector('html').setAttribute('dir', 'rtl')
    // } else {
    //   document.querySelector('html').removeAttribute('dir')
    // }
    return lang;
}

export default i18n;
