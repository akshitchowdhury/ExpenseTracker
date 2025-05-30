"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
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

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
})

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      date: new Date(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await addExpense({
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date,
        description: values.description,
      })
      toast({
        title: "Success",
        description: "Expense added successfully",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
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
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Gift">Gift</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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
          {loading ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </Form>
  )
} 