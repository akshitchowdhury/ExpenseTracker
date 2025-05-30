import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  monthlyIncome: { type: Number, required: true, default: 0 },
  mandatorySavings: { type: Number, required: true, default: 0 },
  fixedExpenses: {
    rent: { type: Number, default: 0 },
    electricityBill: { type: Number, default: 0 },
    furnitureRent: { type: Number, default: 0 },
    grocery: { type: Number, default: 0 },
    travel: { type: Number, default: 3500 }, // Default travel expense
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema); 