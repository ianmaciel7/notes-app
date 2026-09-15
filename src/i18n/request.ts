import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['pt-BR', 'en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt-BR'
export const localeCookieName = 'NEXT_LOCALE'

const messages = {
  en: () => import('@/messages/en.json').then((module) => module.default),
  es: () => import('@/messages/es.json').then((module) => module.default),
  'pt-BR': () =>
    import('@/messages/pt-BR.json').then((module) => module.default),
} as const

function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(localeCookieName)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: await messages[locale](),
  }
})
