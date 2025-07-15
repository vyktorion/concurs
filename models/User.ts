import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nume: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Nu este obligatorie pentru utilizatorii Google
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  activ: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'organizer'],
    default: 'user',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
