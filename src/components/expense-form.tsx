"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useExpenses } from "@/hooks/use-expenses"
import { useToast } from "@/components/ui/use-toast"
import type { Expense } from "@/hooks/use-expenses"

const expenseCategories = [
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Gift",
  "Other",
] as const

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.enum(expenseCategories, {
    required_error: "Please select a category",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function ExpenseForm() {
  const { addExpense } = useExpenses()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const { theme: applicationTheme } = useTheme()

  const theme = createTheme({
    palette: {
      mode: applicationTheme === 'dark' ? 'dark' : 'light',
      text: {
        primary: applicationTheme === 'dark' ? '#fff' : '#000',
        secondary: applicationTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
      background: {
        paper: applicationTheme === 'dark' ? '#1c1c1c' : '#fff',
        default: applicationTheme === 'dark' ? '#121212' : '#fff',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              color: applicationTheme === 'dark' ? '#fff' : '#000',
              backgroundColor: applicationTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#fff',
            },
            '& .MuiInputLabel-root': {
              color: applicationTheme === 'dark' ? '#fff' : '#000',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: applicationTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: applicationTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: applicationTheme === 'dark' ? '#1c1c1c' : '#fff',
            color: applicationTheme === 'dark' ? '#fff' : '#000',
            '& .MuiPickersDay-root': {
              color: applicationTheme === 'dark' ? '#fff' : '#000',
              '&.Mui-selected': {
                backgroundColor: applicationTheme === 'dark' ? '#fff' : '#1976d2',
                color: applicationTheme === 'dark' ? '#000' : '#fff',
              },
            },
          },
        },
      },
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      date: new Date(),
    },
  })

  async function onSubmit(values: FormData) {
    try {
      setLoading(true)
      const expenseData: Omit<Expense, '_id' | 'userId'> = {
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date,
        description: values.description,
      }
      await addExpense(expenseData)
      toast({
        title: "Success",
        description: "Expense added successfully",
      })
      form.reset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add expense. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <ThemeProvider theme={theme}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      disableFuture
                      minDate={new Date("1900-01-01")}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!form.formState.errors.date,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Add a note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Expense"
          )}
        </Button>
      </form>
    </Form>
  )
} 