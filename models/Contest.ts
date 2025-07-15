import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
  nume: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  dataDesfasurarii: {
    type: Date,
    required: true,
  },
  localitate: {
    type: String,
    required: true,
    trim: true,
  },
  locatie: {
    type: String,
    required: true,
    trim: true,
  },
  adresa: {
    type: String,
    required: true,
    trim: true,
  },
  descriere: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: false,
  },
  linkSiteOficial: {
    type: String,
    required: false,
  },
  socialMedia: {
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    tiktok: { type: String, required: false },
  },
  organizatorId: {
    type: String,
    required: true,
  },
  activ: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

ContestSchema.index({ localitate: 1 });
ContestSchema.index({ dataDesfasurarii: 1 });
ContestSchema.index({ organizatorId: 1 });

export default mongoose.models.Contest || mongoose.model('Contest', ContestSchema);
