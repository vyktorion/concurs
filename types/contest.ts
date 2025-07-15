export interface Contest {
  _id: string;
  nume: string;
  slug: string;
  dataDesfasurarii: string;
  localitate: string;
  locatie: string;
  adresa: string;
  descriere: string;
  logoUrl?: string;
  linkSiteOficial?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  organizatorId: string;
  activ: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContestFormData {
  nume: string;
  dataDesfasurarii: string;
  localitate: string;
  locatie: string;
  adresa: string;
  descriere: string;
  logoUrl?: string;
  linkSiteOficial?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface User {
  _id: string;
  nume: string;
  email: string;
  role: 'user' | 'admin' | 'organizer';
  provider: 'credentials' | 'google';
  activ: boolean;
  createdAt: string;
  updatedAt: string;
}