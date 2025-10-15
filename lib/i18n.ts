export const locales = ['en', 'vi'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
}

export const languageFlags = {
  en: '🇬🇧',
  vi: '🇻🇳',
}
