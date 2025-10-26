/**
 * Root Layout Component
 * Wraps the entire app with ClerkProvider for authentication
 */

import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Celestia - Digital Time Capsule",
  description: "Preserve your memories and unlock them in the future",
  manifest: "/manifest.json",
  themeColor: "#177BE4",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Celestia 🌌",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#177BE4" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Celestia 🌌" />
        </head>
        <body>
          {/* Header Navigation */}
          <header className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="text-3xl">🌌</div>
                  <h1 className="text-2xl font-bold text-primary">
                    Celestia
                  </h1>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-4 py-2 rounded-lg border border-border-color hover:bg-primary/10 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10"
                        }
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>

          {/* Footer */}
          <footer className="glass border-t border-white/10 py-6 mt-12">
            <div className="container mx-auto px-4 text-center text-sm text-gray-400">
              <p>© 2025 Celestia. Preserve your memories across time.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
