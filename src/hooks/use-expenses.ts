import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export type Expense = {
  _id: string;
  userId: string;
  amount: number;
  category: 'Entertainment' | 'Shopping' | 'Health' | 'Education' | 'Gift' | 'Other';
  description?: string;
  date: Date;
};

export type UserProfile = {
  userId: string;
  username: string;
  monthlyIncome: number;
  mandatorySavings: number;
  fixedExpenses: {
    rent: number;
    electricityBill: number;
    furnitureRent: number;
    grocery: number;
    travel: number;
  };
};

export function useExpenses() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadProfile();
    }
  }, [user]);

  async function loadExpenses() {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to load expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    try {
      const response = await fetch('/api/user-profile');
      if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  }

  async function addExpense(expense: Omit<Expense, '_id' | 'userId'>) {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (!response.ok) throw new Error('Failed to add expense');
      const newExpense = await response.json();
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
      throw err;
    }
  }

  async function deleteExpense(id: string) {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense');
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
      throw err;
    }
  }

  async function updateProfile(data: Partial<UserProfile>) {
    try {
      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  }

  return {
    expenses,
    profile,
    loading,
    error,
    addExpense,
    deleteExpense,
    updateProfile,
    loadExpenses,
  };
} 