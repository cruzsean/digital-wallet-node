import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IWallet {
  balance: number;
  stripeCustomerId: string;
}

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  wallet: IWallet;
  createdAt: Date;
  checkPassword(candidatePassword: string): Promise<boolean>;
}

const walletSchema = new Schema<IWallet>({
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  stripeCustomerId: {
    type: String,
    required: true
  }
}, { _id: false });

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  wallet: walletSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
