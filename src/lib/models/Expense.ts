import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Entertainment', 'Shopping', 'Health', 'Education', 'Gift', 'Other'],
  },
  description: { type: String },
  date: { type: Date, required: true, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster queries
ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema); 