"use client";
import React, { useState, useEffect } from "react";
import "@/styles/globals.css";
import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import store from "@/store";
import AppInitializer from "@/layouts/AppInitializer";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  // Set mounted flag on client-side mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Until the client has mounted, render nothing (prevents mismatches)
  if (!hasMounted) {
    return null;
  }

  // Determine if this route is for admin pages.
  // You can also add a flag on the component (e.g., Component.adminRoute = true)
  const isAdminRoute =
    Component.adminRoute || router.pathname.startsWith("/admin");

  const Layout = Component.Layout || (({ children }) => <>{children}</>);

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
  );
}

export default MyApp;
