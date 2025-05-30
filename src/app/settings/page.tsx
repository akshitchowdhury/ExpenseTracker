"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  mandatorySavings: z.string().min(1, "Mandatory savings is required"),
  fixedExpenses: z.object({
    rent: z.string().min(1, "Rent is required"),
    electricityBill: z.string().min(1, "Electricity bill is required"),
    furnitureRent: z.string().min(1, "Furniture rent is required"),
    houseDeposit: z.string().min(1, "House deposit is required"),
  }),
})

type FormData = z.infer<typeof formSchema>

interface SettingsFormValues {
  username: string
  monthlyIncome: number
  mandatorySavings: number
  fixedExpenses: {
    rent: number
    electricityBill: number
    furnitureRent: number
    houseDeposit: number
  }
}

export default function SettingsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      monthlyIncome: "0",
      mandatorySavings: "0",
      fixedExpenses: {
        rent: "0",
        electricityBill: "0",
        furnitureRent: "0",
        houseDeposit: "0",
      },
    },
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/user-profile")
        if (!response.ok) {
          throw new Error("Failed to load profile")
        }
        const data: SettingsFormValues = await response.json()
        form.reset({
          username: data.username,
          monthlyIncome: String(data.monthlyIncome),
          mandatorySavings: String(data.mandatorySavings),
          fixedExpenses: {
            rent: String(data.fixedExpenses.rent),
            electricityBill: String(data.fixedExpenses.electricityBill),
            furnitureRent: String(data.fixedExpenses.furnitureRent),
            houseDeposit: String(data.fixedExpenses.houseDeposit),
          },
        })
      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Failed to load profile. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadProfile()
    } else {
      setLoading(false)
    }
  }, [user, form, toast])

  async function onSubmit(values: FormData) {
    try {
      setIsSaving(true)
      const transformedValues: SettingsFormValues = {
        username: values.username,
        monthlyIncome: Number(values.monthlyIncome),
        mandatorySavings: Number(values.mandatorySavings),
        fixedExpenses: {
          rent: Number(values.fixedExpenses.rent),
          electricityBill: Number(values.fixedExpenses.electricityBill),
          furnitureRent: Number(values.fixedExpenses.furnitureRent),
          houseDeposit: Number(values.fixedExpenses.houseDeposit),
        },
      }

      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedValues),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Settings updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your profile and financial settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mandatorySavings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mandatory Savings</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fixed Expenses</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fixedExpenses.rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rent</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fixedExpenses.electricityBill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Electricity Bill</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fixedExpenses.furnitureRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Furniture Rent</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fixedExpenses.houseDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Deposit</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}