import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Toaster } from '@/components/toaster'

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geist.className} min-h-screen bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <div className="relative flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger />
                      <h1 className="font-semibold">Expense Tracker</h1>
                    </div>
                    <div className="flex items-center gap-4">
                      <ModeToggle />
                      <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                            Sign In
                          </button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </div>
                </header>
                <AppSidebar />
                <main className="flex-1 container py-6">
                  {children}
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}