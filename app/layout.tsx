import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Operator AI v2.0 | Autonomous E-Commerce Operating System',
  description: 'AI-driven autonomous operating system for Shopify and multi-channel commerce.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-150">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
            toastOptions={{
              className: 'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 border-slate-200 bg-white text-slate-900 shadow-xl font-sans text-xs',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
