"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useExpenses } from "@/hooks/use-expenses"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

export function RecentTransactions() {
  const { expenses, deleteExpense, loadExpenses } = useExpenses()
  const { toast } = useToast()

  async function handleDelete(id: string) {
    try {
      await deleteExpense(id)
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      })
      loadExpenses()
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{transaction.description || "-"}</TableCell>
              <TableCell className="text-right">
                <span className={transaction.amount < 0 ? "text-red-500" : "text-green-500"}>
                  {formatCurrency(transaction.amount)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
} 