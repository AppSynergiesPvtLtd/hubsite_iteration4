"use client";
import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import store from "@/store";
import AppInitializer from "@/layouts/AppInitializer";
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from '../next-i18next.config.js'

// Supported languages
const SUPPORTED_LANGUAGES = nextI18NextConfig.locales; // Add your supported languages
const DEFAULT_LANGUAGE = nextI18NextConfig.defaultLocale; // Add your default language

function detectPreferredLanguage() {
  // First, check localStorage
  const storedLanguage = localStorage.getItem('preferredLanguage');
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage;
  }

  // If not in localStorage, use browser language
  const browserLanguage = navigator.language.split('-')[0];
  
  if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
    return browserLanguage;
  }

  // Default to English if no match
  return DEFAULT_LANGUAGE;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()
  const { pathname, query, asPath } = router

  useEffect(() => {
    // Language detection and redirection logic
    const currentPath = router.pathname

    // Check if the current route already matches a language directory
    const isLanguageRoute = SUPPORTED_LANGUAGES.some(
      (lang) =>
        currentPath.startsWith(`/${lang}/`) || currentPath === `/${lang}`
    )

    // If not in a language route, perform redirection
    if (!isLanguageRoute) {
      const preferredLanguage = detectPreferredLanguage()
      console.log(preferredLanguage)

      // Save preferred language to localStorage
      // localStorage.setItem('preferredLanguage', preferredLanguage)

      // Perform client-side redirect
      router.push({ pathname, query }, asPath, {
        locale: preferredLanguage,
      })
    }

    setHasMounted(true)
  }, [router.pathname])

  // Until the client has mounted, render nothing (prevents mismatches)
  if (!hasMounted) {
    return null
  }

  // Determine if this route is for admin pages.
  const isAdminRoute =
    Component.adminRoute || router.pathname.startsWith('/admin')

  const Layout = Component.Layout || (({ children }) => <>{children}</>)

  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>
        {isAdminRoute ? (
          // Admin pages render without the AppInitializer wrapper.
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          // Normal (non-admin) pages are wrapped with the AppInitializer.
          <AppInitializer>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppInitializer>
        )}
      </ReduxProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(MyApp, {
  i18n: nextI18NextConfig,
  localePath: './public/locales',
  defaultNS: 'common',
  ns: ['common'],
  fallbackLng: 'en',
})