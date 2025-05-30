"use client"

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { ArrowRight, BarChart2, PiggyBank, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/Dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return <LoadingSkeleton />
  }

  if (isSignedIn) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Track Your Expenses Smartly
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Take control of your finances with our comprehensive expense tracking solution. 
          Monitor your spending, set savings goals, and make informed financial decisions.
        </p>
        <div className="flex gap-4">
          <SignUpButton mode="modal">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 p-8 bg-muted/50">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChart2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
          <p className="text-muted-foreground">
            Get detailed insights into your spending patterns with interactive charts and graphs.
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
            <PiggyBank className="h-6 w-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Savings</h3>
          <p className="text-muted-foreground">
            Track your mandatory savings and manage fixed expenses efficiently.
          </p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
          <p className="text-muted-foreground">
            Your financial data is protected with industry-standard security measures.
          </p>
        </Card>
      </div>
    </div>
  )
}
